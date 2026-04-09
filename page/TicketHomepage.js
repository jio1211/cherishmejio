import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './TicketHomePage.css';
import { FavoriteContext } from "../../context/FavoriteContext";
import { useAuth } from '../auth/AuthContext';

export default function TicketHomepage() {
  const { handleFavorite } = useContext(FavoriteContext);
  const { member } = useAuth();
  const navigate = useNavigate();

  const [performanceInfos, setPerformanceInfos] = useState([]);
  const [rankPerformanceInfos, setRankPerformanceInfos] = useState([]);
  const [recommendPerformanceInfos, setRecommendPerformanceInfos] = useState([]);
  const [regionPerformanceInfos, setRegionPerformanceInfos] = useState([]);
  const [regionCode, setRegionCode] = useState("11");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(true);
  const [regionLoading, setRegionLoading] = useState(true);
  //지역 코드
  const regions = [
    { code: "11", name: "서울" },
    { code: "28", name: "인천" },
    { code: "26", name: "부산" },
    { code: "41", name: "경기" },
    { code: "51", name: "강원" },
    { code: "50", name: "제주" },
    { code: "43", name: "충북" },
    { code: "44", name: "충남" },
    { code: "45", name: "전북" },
    { code: "46", name: "전남" },
    { code: "47", name: "경북" },
    { code: "48", name: "경남" },
  ];

  //기본 날짜 설정 (오늘 기준 2주전 ~ 2주후) ***임시***
  function getDefaultDates() {
    const today = new Date();
    const twoWeeksBefore = new Date();
    twoWeeksBefore.setDate(today.getDate() - 14);
    const twoWeeksAfter = new Date();
    twoWeeksAfter.setDate(today.getDate() + 14);

    return {
      startDate: twoWeeksBefore.toISOString().split("T")[0],
      endDate: twoWeeksAfter.toISOString().split("T")[0],
    };
  }

  // 기본 날짜
  const { startDate, endDate } = getDefaultDates();
  // 실제 API 호출용 날짜 / 달력
  // const [startDate, setStartDate] = useState(defaultStartDate);
  // const [endDate, setEndDate] = useState(defaultEndDate);
  // 달력에서 선택하는 임시 날짜
  // const [tempStartDate, setTempStartDate] = useState(defaultStartDate);
  // const [tempEndDate, setTempEndDate] = useState(defaultEndDate);


  // 날짜 데이터를 YYYYMMDD형식의 문자열로 반환하는 함수
  function formatDate(date) {
    const year = date.getFullYear(); // date에서 년도 추출
    const month = String(date.getMonth() + 1).padStart(2, "0"); // date에서 월 추출(1자리일 경우에 앞에 0 추가)
    const day = String(date.getDate()).padStart(2, "0"); // date에서 일 추출(1자리일 경우에 앞에 0 추가)
    return `${year}${month}${day}`;
  }

  // 추천 공연, 공연 랭킹
  useEffect(() => {
    const fetchStatusData = async (sDate, eDate) => {
      try {
        setStatusLoading(true);

        const rankResponse = await axios.get("http://localhost:8080/tl/getPerformanceInfo", {
          params: { startdate: sDate, enddate: eDate, rows: 5, cpage: 1, perRequestT: "rank" },
        });
        const recommendResponse = await axios.get("http://localhost:8080/tl/getPerformanceInfo", {
          params: { startdate: sDate, enddate: eDate, rows: 5, cpage: 1, perRequestT: "recommend" },
        });

        setRankPerformanceInfos(rankResponse.data);
        setRecommendPerformanceInfos(recommendResponse.data);
        setStatusLoading(false);
      } catch (err) {
        console.error("api 불러오기 실패:", err);
        setStatusLoading(false);
      }
    }
    if (startDate && endDate) fetchStatusData(formatDate(new Date(startDate)), formatDate(new Date(endDate)));
  }, [startDate, endDate]);

  // 전체 공연
  useEffect(() => {
    const fetchData = async (sDate, eDate) => {
      try {
        setLoading(true);
        const allResponse = await axios.get("http://localhost:8080/tl/getPerformanceInfo", {
          params: { startdate: sDate, enddate: eDate, cpage: 1, rows: 5 },
        });

        setPerformanceInfos(allResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("api 불러오기 실패:", err);
        setLoading(false);
      }
    };
    if (startDate && endDate) fetchData(formatDate(new Date(startDate)), formatDate(new Date(endDate)));
  }, [startDate, endDate]);

  // 지역별 공연
  useEffect(() => {
    const fetchRegionData = async (sDate, eDate) => {
      try {
        setRegionLoading(true);
        const regionResponse = await axios.get("http://localhost:8080/tl/getPerformanceInfo", {
          params: { startdate: sDate, enddate: eDate, cpage: 1, rows: 5, signgucode: regionCode },
        });
        setRegionPerformanceInfos(regionResponse.data);
        setRegionLoading(false);
      } catch (err) {
        console.error("지역 데이터 불러오기 실패:", err);
        setRegionLoading(false);
      }
    };

    if (startDate && endDate) fetchRegionData(formatDate(new Date(startDate)), formatDate(new Date(endDate)));
  }, [regionCode, startDate, endDate]);

  // 커밋 버튼 동작 (API만 다시 불러옴) 달력
  // const handleCommit = () => {
  //   setStartDate(tempStartDate);
  //   setEndDate(tempEndDate);
  // };

  // 공연 목록 출력
  function PerformanceList({ data, loading }) {
    if (loading) return <div>불러오는 중...</div>

    return (
      <div className="perform_layout"
      >
        {data?.map((performanceInfo, idx) => (
          <div key={idx}
            className="perform_container"
          >
            <Link to="/ticket/info" state={{ performanceInfo }}> {/* 공연 상세 정보 페이지 이동 */}
  
              <img
                // alt={performanceInfo.perTitle} 
                className="img"
                src={performanceInfo.perPoster} //공연 포스터
              />
              <div className="title">
                {performanceInfo.perTitle} {/* 공연 제목 */}               
               </div>
            </Link>
          </div>
        ))}
      </div>
    );
  }
  // 검색어 폼 핸들링
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate("./list", { state: { title : searchQuery } });
  }
  return (
    <div id="my_layout">
      <div id="th_layout">
        <div id="th_header">
          <div>
            {/* 검색창 */}
            <form
              id="search_container"
              onSubmit={handleSearchSubmit} >
              <input
                id="search_box"
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                id="search_button"
                type="submit">
                <img
                  id="search_img"
                  src="/images/search.png" />
              </button>
            </form>
          </div>
        </div>
        <div id="th_body">
          {/* 상단 광고 이미지 영역 */}
          <div id="th_body1">
            {/* <div id="th_main_inform">
                <div id="main_inform_inform">MUSICAL | 서울</div>
                <div id="main_inform_title">영웅</div>
                <div id="main_inform_date">2025.09.04~2025.11.23</div>
              </div> */}
            <div id="th_main_poster">
              <img id="th_poster_img" src="/images/musical_poster.jpg" />
            </div>
          </div>
          {/* 공연 랭킹 */}
          <div className="th_perform_list">
            <div className="list_title">
              <div className="list_name">랭킹</div>
              <Link // 모두 보기 버튼
                className="show_all"
                to="/ticket/list"
                state={{ type: "rank" }}
              >
                |&nbsp;전체 보기&nbsp;|
              </Link>
            </div>
            <PerformanceList data={rankPerformanceInfos} loading={statusLoading} />
          </div>

          {/* 추천 공연 */}
          <div className="th_grey_container">
            <div className="th_perform_list">
              <div className="list_title">
                <div className="list_name">추천 공연</div>
              </div>
              <PerformanceList data={recommendPerformanceInfos} loading={statusLoading} />
            </div>
          </div>

          {/* 전체 공연 */}
          <div className="th_perform_list">
            <div className="list_title">
              <div className="list_name">전체 공연</div>
              <Link
                className="show_all"
                to="/ticket/list" // 모두 보기 버튼
              >
                |&nbsp;전체 보기&nbsp;|
              </Link>
            </div>
            <PerformanceList data={performanceInfos} loading={loading} />
          </div>

          {/* 지역별 공연 */}
          <div className="th_grey_container">
            <div className="th_perform_list">
              <div className="list_title">
                <div className="list_name">지역별 공연</div>
                <Link
                  className="show_all"
                  to="/ticket/list"
                  state={{ region: regionCode }} // 모두 보기 버튼
                >
                  |&nbsp;전체 보기&nbsp;|
                </Link>
              </div>
              <div id="region_list">
                {regions.map((region) => (
                  <button
                    className={`region_button ${regionCode === region.code ? "active" : ""}`}
                    key={region.code}
                    onClick={() => setRegionCode(region.code)}>
                    {region.name}
                  </button>
                ))}
              </div>
              <PerformanceList data={regionPerformanceInfos} loading={regionLoading} />
            </div>
          </div>
        </div>
      </div >
    </div>
  );
}
