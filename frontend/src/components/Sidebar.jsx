import { Link } from "react-router-dom";
import "../assets/css/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/mypage" className="mypage">
        마이페이지
      </Link>

      <div className="menu">
        <h3>쇼핑 정보</h3>
        <p>최근 본 상품</p>
        <p>관심 상품</p>
      </div>

      <div className="menu">
        <h3>내 정보</h3>
        <p>로그인 정보</p>
        <p>프로필 정보</p>
      </div>
    </aside>
  );
}