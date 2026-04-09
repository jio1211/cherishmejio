import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReplyList from "./ReplyList";
import ReplyWrite from "./ReplyWrite";
import { useAuth } from "../auth/AuthContext";
import { ReplyCountContext } from '../../context/ReplyCountContext';
import { LikeContext } from "../../context/LikeContext";
import { DeleteContext } from '../../context/DeleteContext';
import './PostDetailPage.css';

export default function PostDetailPage() {
  const { no: postNo } = useParams();
  const { totalReplies, setInitialReplies } = useContext(ReplyCountContext);
  const { handleLike, totalLikes, liked, setInitialLikes } = useContext(LikeContext);
  const { handlePostDelete } = useContext(DeleteContext);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState("");
  const [memberId, setMemberId] = useState("");
  const [media, setMedia] = useState("");
  const [refreshReply, setRefreshReply] = useState(false);
  const [date, setDate] = useState("");
  const { member } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/post/read?no=${postNo}`);
        const data = response.data;

        setTitle(data.title);
        setContent(data.content);
        setMemberId(data.memberId);
        setMedia(data.media);
        setDate(new Date(data.createdAt).toLocaleDateString());

        // 좋아요, 댓글 초기값 설정
        setInitialLikes([data]);
        setInitialReplies([data]);
      } catch (error) {
        console.log("서버 에러:", error);
      }
    };
    fetchPost();
  }, [postNo]);

  const handleAddReply = () => {
    setRefreshReply(prev => !prev); // 상태 반전으로 댓글 갱신
  };

  return (
    <div id="pageLayout">
      <div id="postLayout">
        <div id="post_head">
          <div id="ph_1">
            <div id="post_writer">{memberId}</div>
            <div id="post_date">{date}</div>
          </div>
        </div>

        <div id="post_title">{title}</div>
        <div id="post_body">
          {media && (
            <img
              className="post_img"
              src={`http://localhost:8080${media}`}
              alt="media"
            />
          )}
          <div id="post_content">{content}</div>
        </div>

        <div id="pdp_react">
          {/* 좋아요 버튼 */}
          {member && member.memberId ? (
            <button
              onClick={() => handleLike(member.memberId, postNo)}
              className="pdp_re"
            >
              <img
                src={
                  liked[postNo] === 1
                    ? "/images/like.png"
                    : "/images/like_grey.png"
                }
                className="pdp_re_img"
                alt="좋아요"
              />
              {totalLikes[postNo] ?? 0}
            </button>
          ) : (
            <div className="pdp_re">
              <img
                src="/images/like_grey.png"
                className="pdp_re_img"
                alt="좋아요"
              />
              {totalLikes[postNo] ?? 0}
            </div>
          )}

          {/* 댓글 수 표시 */}
          <div className="pdp_re">
            <img
              src="/images/reply.png"
              alt="댓글"
              className="pdp_re_img"
            />
            {totalReplies[postNo] ?? 0}
          </div>

          {/* 게시글 삭제 버튼 (작성자 본인만 표시) */}
          {member && member.memberId === memberId && (
            <button
              onClick={() => handlePostDelete(postNo)}
              className="pdp_re"
            >
              <img
                src="/images/trashbin.png"
                alt="삭제"
                className="pdp_re_img"
              />
            </button>
          )}
        </div>
      </div>

      {/* 댓글 영역 */}
      <div className="ReplyLayout">
        <ReplyWrite onReplyAdded={handleAddReply} />
        <ReplyList refreshReply={refreshReply} />
      </div>
    </div>
  );
}
