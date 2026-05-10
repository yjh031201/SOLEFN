import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/MyPage.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar.jsx";
import CategoryPanel from "../components/panel/CategoryPanel.jsx";
import AlarmPanel from "../components/panel/AlarmPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axiosInstance from "../utils/axiosInstance";

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
  // null = 로딩 중, [] = 로딩 끝났는데 비어있음, [...] = 데이터 있음
  const [recentViews, setRecentViews] = useState(null);

  // 로그인 안 된 사용자는 로그인 페이지로
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 최근 본 상품 가져오기 (외부 API 호출이라 useEffect가 적합)
  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    axiosInstance.get("/recent-views")
      .then((res) => {
        if (!cancelled) setRecentViews(res.data);
      })
      .catch((err) => {
        console.error("최근 본 상품 조회 실패:", err);
        if (!cancelled) setRecentViews([]);
      });

    return () => { cancelled = true; };
  }, [isLoggedIn]);

  // ⭐ early return은 모든 Hook 호출 후에!
  if (!isLoggedIn || !user) {
    return null;
  }

  const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return `${num.toLocaleString("ko-KR")}원`;
  };

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

            {recentViews === null ? (
              <p style={{ padding: "20px 0", color: "#888" }}>불러오는 중...</p>
            ) : recentViews.length === 0 ? (
              <p style={{ padding: "20px 0", color: "#888" }}>
                최근 본 상품이 없습니다.
              </p>
            ) : (
              recentViews.map((item) => (
                <div className="item" key={item.id}>
                  {item.image && (
                    <img src={item.image} alt={item.title} />
                  )}
                  <div>
                    <p>{item.title}</p>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}