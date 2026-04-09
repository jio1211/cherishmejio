import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import './Mypage.css';
import './reset.css';


export default function Mypage() {
  const { member } = useAuth();
  // const [per_id, setPer_id] = useState(0);
  // const [myName, setMyName] = useState("");
  // const [joinDate, setJoinDate] = useState("");
  // const [myNicl, setMyNick] = useState("");
  const [myInfo, setMyInfo] = useState({});
  const [myPosts, setMyPosts] = useState([]);
  const [myReplies, setMyReplies] = useState([]);
  const [myFavorite, setMyFavorite] = useState([]);



  const getMyInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getMyInfo?memberId=${member.memberId}`)
      setMyInfo(response.data) //[{memberName:oo, memberId:oo, createdAt:yyyy.mm.dd. time}] 형태
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getMyPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/post/getMyPost?memberId=${member.memberId}`)
      setMyPosts(response.data); //[{title:oo , no:0, createdAt:yyyy.mm.dd.time}] 의 ArrayList 형태. map으로
    } catch (error) {

    }
  }

  const getMyReplies = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/reply/getMyReplies?memberId=${member.memberId}`)
      setMyReplies(response.data); //[{content:oo , originTitle:00, createdAt:yyyy.mm.dd.time}] 의 ArrayList 형태. map으로
    } catch (error) {

    }
  }
  const getMyFavorite = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/favorite/getFavorite?memberId=${member.memberId}`)
      setMyFavorite(response.data); //[{content:oo , originTitle:00, createdAt:yyyy.mm.dd.time}] 의 ArrayList 형태. map으로
      console.log(response.data)
    } catch (error) {

    }
  }
  useEffect(() => {
    getMyInfo();
    getMyPosts();
    getMyReplies();
    getMyFavorite();
  }, []);

  return (
    <div id="myLayout">
      <div id="my_top">
      </div>
      <div id="my_mid">
        <div id="my_mid_left">
          <div id="m_info_container">
            <div id="info_name"> {myInfo.memberName}</div>
            <div id="info_date">가입&nbsp; {new Date(myInfo.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        <div id="my_mid_right">
          <div id="favorite_container">
            <div className="my_container_name">나의 좋아요</div>
            <div id="favorite_list">
              {myFavorite.map(favorite =>
                <div className="favorite_box" key={favorite.favId}>
                  <div className="favorite_poster"><img className="favorite_poster_img" alt={favorite.perTitle} src={favorite.perPoster} //공연 포스터
                  /></div>
                  <div className="favorite_contents">
                    <div className="favorite_title">&nbsp;{favorite.perTitle}</div>
                    <div className="favorite_run_date">
                      &nbsp;&nbsp;{favorite.perStartD}&nbsp;~
                      <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;  {favorite.perEndD}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div id="post_container">
            <div id="post_container_name">내가 쓴 글</div>
            <div id="post_title_layout">
              <div id="post_top_date">작성일</div>
              <div id="post_top_title">제목</div>
              <div id="post_top_content">내용</div>
            </div>
            {myPosts.map(post =>
              <div className="my_post_mid">
                <div className="my_post_date">{new Date(post.createdAt).toLocaleDateString()}</div>
                <div className="my_post" key={post.no} >
                  <div className="my_post_title">·&nbsp;{post.title}</div>
                  <div className="my_post_content">{post.content}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
