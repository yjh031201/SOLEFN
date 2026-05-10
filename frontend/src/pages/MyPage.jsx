import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/MyPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import CategoryPanel from "../components/CategoryPanel";
import AlarmPanel from "../components/AlarmPanel";
import { useAuth } from "../context/AuthContext";
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
  const [recentViews, setRecentViews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 안 된 사용자는 로그인 페이지로
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // 최근 본 상품 가져오기
  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    axiosInstance.get("/recent-views")
      .then((res) => {
        setRecentViews(res.data);
      })
      .catch((err) => {
        console.error("최근 본 상품 조회 실패:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLoggedIn]);

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

          {/* 최근 본 상품 */}
          <section className="section">
            <h3>최근 본 상품</h3>

            {loading ? (
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