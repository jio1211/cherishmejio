import './ComHomePage.css';
import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReplyCountContext } from '../../context/ReplyCountContext';
import { LikeContext } from "../../context/LikeContext";
import { useAuth } from "../auth/AuthContext";

export default function ComeHomePage() {
  const { totalReplies, setInitialReplies } = useContext(ReplyCountContext);
  const { handleLike, totalLikes, liked, setInitialLikes } = useContext(LikeContext);
  const { member } = useAuth();

  const [topPosts, setTopPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  const topFeedRef = useRef(null);

  const fetchTopPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/post/getComHomeTop");
      setTopPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("fetchTopPosts error:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/post/getReviewList?no=0");
      const newPosts = Array.isArray(response.data) ? response.data : [];
      setPosts(newPosts);
      setInitialReplies(newPosts);
    } catch (error) {
      console.error("fetchPosts error:", error);
    }
  };

  useEffect(() => {
    fetchTopPosts();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (member && posts.length > 0) {
      setInitialLikes(posts);
    }
  }, [member, posts]);

  // 화살표 스크롤
  const scrollLeft = () => {
    topFeedRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    topFeedRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="reddit_layout">
      <h2 className="reddit_header">인기게시물</h2>
      <div className="reddit_top_wrapper">
        <button className="scroll_btn left" onClick={scrollLeft}>&lt;</button>
        <div className="reddit_top_feed" ref={topFeedRef}>
          {topPosts.filter(post => post.media).map(post => (
            <Link key={post.no} to={`./posts/${post.no}`} className="reddit_top_card">
              <div
                className="reddit_top_img"
                style={{ backgroundImage: `url(http://localhost:8080${post.media})` }}
              >
                <div className="reddit_top_text">
                  <div className="reddit_top_title">{post.title}</div>
                  <div className="reddit_top_content">{post.content}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button className="scroll_btn right" onClick={scrollRight}>&gt;</button>
      </div>

      <h2 className="reddit_header">최신게시물</h2>
      <div className="reddit_feed">
        {posts.map(post => (
          <div key={post.no} className="reddit_card">
            <div className="reddit_card_header">
              <img className="reddit_profile_img" src="/images/grey.jpg" alt="profile" />
              <div>
                <div className="reddit_member">{post.memberId}</div>
                <div className="reddit_date">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <Link className="reddit_card_title" to={`./posts/${post.no}`}>
              <h3>{post.title}</h3>
              {post.media && (
                <img
                  src={`http://localhost:8080${post.media}`}
                  alt="media"
                  className="reddit_card_img"
                />
              )}
              <p className="reddit_card_content">{post.content}</p>
            </Link>
            <div className="reddit_card_actions">
              <button onClick={() => handleLike(member.memberId, post.no)} className="reddit_btn">
                <img
                  src={liked[post.no] === 1 ? "/images/like.png" : "/images/like_grey.png"}
                  alt="like"
                  className="reddit_icon"
                />
                {totalLikes[post.no] ?? 0}
              </button>
              <div className="reddit_btn">
                <img src="/images/reply.png" alt="reply" className="reddit_icon" />
                {totalReplies[post.no] ?? 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
