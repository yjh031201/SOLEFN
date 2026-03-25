import { useState } from "react";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  };

  const handleLogout = () => {
    setIsLogin(false);
  };
  return (
    <>
      <div className="header-wrap">
        <header className="top-header">
          <div className="logo-area">
            <span className="logo-main">FIND</span>
            <span className="logo-sub">SHOES</span>
          </div>

          <div className="header-right">
            <div className="top-links">
              <span>고객센터</span>
              <span>마이페이지</span>
              {isLogin ? (
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                로그아웃
              </span>
            ) : (
              <span onClick={handleLogin} style={{ cursor: "pointer" }}>
                로그인
              </span>
            )}
            </div>

            <div className="top-icons">
              <button className="icon-btn" aria-label="검색">
                🔍
              </button>
              <button className="icon-btn" aria-label="알림">
                🔔
              </button>
              <button className="icon-btn" aria-label="메뉴">
                ☰
              </button>
            </div>
          </div>
        </header>

        <nav className="category-nav">
          <span className="active">추천</span>
          <span>신상</span>
          <span>이벤트</span>
          <span>세일</span>
        </nav>
      </div>
    </>
  );
}
