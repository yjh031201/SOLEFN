import { Link, useNavigate } from "react-router-dom";
import solefn from "../assets/images/SOLEFN.png";
import search from "../assets/images/search.svg";
import notification from "../assets/images/notification.svg";
import category from "../assets/images/category.svg";
export default function TopBar({ onCategoryClick, onAlarmClick }) {
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="logo-area">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={solefn} alt="SOLEFN 로고" className="logo-image" />
        </Link>
      </div>

      <div className="header-right">
        <div className="top-links">
          <Link
            to="/customer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            고객센터
          </Link>
          <Link
            to="/mypage"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            마이페이지
          </Link>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            로그인
          </Link>
        </div>

        <div className="top-icons">
          <button
            className="icon-btn"
            aria-label="검색"
            onClick={() => navigate("/search")}
          >
            <img src={search} alt="검색" className="logo-search" />
          </button>

          <button className="icon-btn" aria-label="알림" onClick={onAlarmClick}>
            <img src={notification} alt="알림" className="logo-notification" />
          </button>

          <button
            className="icon-btn"
            aria-label="메뉴"
            onClick={onCategoryClick}
            style={{ cursor: "pointer" }}
          >
            <img src={category} alt="카테고리" className="logo-category" />
          </button>
        </div>
      </div>
    </header>
  );
}
