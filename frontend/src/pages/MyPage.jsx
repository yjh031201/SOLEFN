import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/MyPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar.jsx";
import CategoryPanel from "../components/panel/CategoryPanel.jsx";
import AlarmPanel from "../components/panel/AlarmPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function MyPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const menus = [
    {
      title: "쇼핑 정보",
      items: ["최근 본 상품", "관심 상품"]
    },
    {
      title: "내 정보",
      items: ["로그인 정보", "프로필 정보"]
    }
  ];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  // 로그인 안 된 사용자는 로그인 페이지로 (lazy init이 아니라 useEffect 사용)
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 로그인 안 된 상태면 화면 안 그림 (리다이렉트되기 전)
  if (!isLoggedIn || !user) {
    return null;
  }

  return (
      <div className="mypagecontainer">
        <Header
            onCategoryClick={() => setIsCategoryOpen(true)}
            onAlarmClick={() => setIsAlarmOpen(true)}
        />
        <CategoryPanel isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
        <AlarmPanel isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />

        <div className="mypagecontent">
          <Sidebar title="마이페이지" menus={menus} link="/mypage" />

          <main className="mypagemain">
            <div className="user-box">
              <div className="left-group">
                <div className="user-profile"></div>
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="user-bottons">
                <button>프로필 관리</button>
                <button>내 스타일</button>
              </div>
            </div>

            <section className="section">
              <h3>최근 본 상품</h3>

              <div className="item">
                <div>
                  <p>Apple 2022 MacBook Air</p>
                  <span>100원</span>
                </div>
              </div>

              <div className="item">
                <div>
                  <p>Louis Vuitton Belt</p>
                  <span>100원</span>
                </div>
              </div>

              <div className="item">
                <div>
                  <p>Adidas Sneakers</p>
                  <span>100원</span>
                </div>
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </div>
  );
}