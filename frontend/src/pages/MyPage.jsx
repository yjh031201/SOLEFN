import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      items: [
        { label: "최근 본 상품", scrollTo: "section-recent" },
        { label: "관심 상품", scrollTo: "section-wishlist" },
      ],
    },
    {
      title: "내 정보",
      items: ["로그인 정보", "프로필 정보"],
    },
  ];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  // null = 로딩 중, [] = 로딩 끝났는데 비어있음, [...] = 데이터 있음
  const [recentViews, setRecentViews] = useState(null);
  const [recentShowAll, setRecentShowAll] = useState(false);

  const [wishlists, setWishlists] = useState(null);
  const [wishShowAll, setWishShowAll] = useState(false);

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

    axiosInstance
      .get("/recent-views")
      .then((res) => {
        if (!cancelled) setRecentViews(res.data);
      })
      .catch((err) => {
        console.error("최근 본 상품 조회 실패:", err);
        if (!cancelled) setRecentViews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  // 관심상품 가져오기
  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    axiosInstance
      .get("/wishlist")
      .then((res) => {
        if (!cancelled) setWishlists(res.data ?? []);
      })
      .catch((err) => {
        console.error("관심상품 조회 실패:", err);
        if (!cancelled) setWishlists([]);
      });

    return () => {
      cancelled = true;
    };
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
      <CategoryPanel
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
      />
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
          <section className="section" id="section-recent">
            <h3>최근 본 상품</h3>

            {recentViews === null ? (
              <p style={{ padding: "20px 0", color: "#888" }}>불러오는 중...</p>
            ) : recentViews.length === 0 ? (
              <p style={{ padding: "20px 0", color: "#888" }}>
                최근 본 상품이 없습니다.
              </p>
            ) : (
              <>
                {(recentShowAll ? recentViews : recentViews.slice(0, 4)).map((item) => (
                  <Link
                    to={`/product/${item.productId}`}
                    state={{
                      id: item.productId,
                      title: item.title,
                      image: item.image,
                      price: item.price,
                      mallName: item.mallName,
                      brand: item.brand,
                      link: item.link,
                      variants: [],
                      stores: [],
                    }}
                    key={item.id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="item">
                      {item.image && <img src={item.image} alt={item.title} />}
                      <div>
                        <p>{item.title}</p>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentViews.length > 4 && (
                  <button
                    className="mypage-more-btn"
                    onClick={() => setRecentShowAll((prev) => !prev)}
                  >
                    {recentShowAll ? "접기 ∧" : `더보기 (${recentViews.length - 4}개 더) ∨`}
                  </button>
                )}
              </>
            )}
          </section>

          {/* 관심 상품 */}
          <section className="section" id="section-wishlist">
            <h3>관심 상품</h3>

            {wishlists === null ? (
              <p style={{ padding: "20px 0", color: "#888" }}>불러오는 중...</p>
            ) : wishlists.length === 0 ? (
              <p style={{ padding: "20px 0", color: "#888" }}>
                관심 상품이 없습니다.
              </p>
            ) : (
              <>
                {(wishShowAll ? wishlists : wishlists.slice(0, 4)).map((item) => (
                  <Link
                    to={`/product/${item.productId}`}
                    state={{
                      id: item.productId,
                      title: item.title,
                      image: item.image,
                      price: item.price,
                      mallName: item.mallName,
                      brand: item.brand,
                      link: item.link,
                      variants: [],
                      stores: [],
                    }}
                    key={item.id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="item">
                      {item.image && <img src={item.image} alt={item.title} />}
                      <div>
                        <p>{item.title}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>{formatPrice(item.price)}</span>
                          <span
                            className="material-symbols-outlined wish-icon active"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              axiosInstance
                                .delete(`/wishlist/${item.productId}`)
                                .then(() => {
                                  setWishlists((prev) =>
                                    prev.filter((w) => w.productId !== item.productId)
                                  );
                                })
                                .catch(() => {});
                            }}
                          >
                            favorite
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {wishlists.length > 4 && (
                  <button
                    className="mypage-more-btn"
                    onClick={() => setWishShowAll((prev) => !prev)}
                  >
                    {wishShowAll ? "접기 ∧" : `더보기 (${wishlists.length - 4}개 더) ∨`}
                  </button>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
