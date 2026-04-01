import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar({ onCategoryClick, onAlarmClick }) {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="logo-area">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="logo-main">FIND</span>
          <span className="logo-sub">SHOES</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="top-links">
          <Link to="/customer" style={{ textDecoration: 'none', color: 'inherit' }}>
            고객센터
          </Link>
          <Link to="/mypage" style={{ textDecoration: 'none', color: 'inherit' }}>
            마이페이지
          </Link>

          {isLogin ? (
            <span onClick={() => setIsLogin(false)} style={{ cursor: 'pointer' }}>
              로그아웃
            </span>
          ) : (
            <span onClick={() => setIsLogin(true)} style={{ cursor: 'pointer' }}>
              로그인
            </span>
          )}
        </div>

        <div className="top-icons">
          <button
            className="icon-btn"
            aria-label="검색"
            onClick={() => navigate('/search')}
          >
            🔍
          </button>

          <button
            className="icon-btn"
            aria-label="알림"
            onClick={onAlarmClick}
          >
            🔔
          </button>

          <button
            className="icon-btn"
            aria-label="메뉴"
            onClick={onCategoryClick}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}