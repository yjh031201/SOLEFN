import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../assets/css/SearchResult.css";
import Header from "../components/layout/Header";
import CategoryPanel from "../components/panel/CategoryPanel";
import AlarmPanel from "../components/panel/AlarmPanel";
import { addRecentSearch } from "../utils/recentSearches";

export default function SearchResult() {
  // --- [URL 쿼리] ---
  const [searchParams] = useSearchParams();
  const keyword = (searchParams.get("q") || "").trim();

  // --- [상태 관리] ---
  const [activeModal, setActiveModal] = useState(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("인기순");
  const [wishList, setWishList] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // 추가된 상태: '직접입력' 라디오가 체크되었는지 확인
  const [isDirectInputMode, setIsDirectInputMode] = useState(false);

  // <!-- 헤더 상태 -->
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  // --- [상품 데이터(API)] ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // 검색어가 변경되면 초기화
  useEffect(() => {
    if (keyword) addRecentSearch(keyword);
  }, [keyword]);

  // 상품 데이터 페칭
  useEffect(() => {
    if (!keyword) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchProducts = async () => {
      const isFirstLoad = offset === 0;
      if (isFirstLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setErrorMsg("");

      try {
        const res = await axios.get("/api/search", {
          params: { q: keyword, offset },
          signal: controller.signal,
        });
        if (cancelled) return;

        const newItems = res.data?.items ?? [];
        const nextHasMore = res.data?.hasMore ?? false;

        setHasMore(nextHasMore);
        if (isFirstLoad) {
          setProducts(newItems);
        } else {
          setProducts((prev) => [...prev, ...newItems]);
        }
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") return;
        if (cancelled) return;
        console.error(err);
        setErrorMsg("검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        if (offset === 0) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          if (isFirstLoad) {
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [keyword, offset]);

  // --- [정렬/필터 적용된 상품 목록] ---
  const visibleProducts = useMemo(() => {
    let list = [...products];

    // 가격대 필터 (직접입력)
    if (isDirectInputMode && priceRange.min && priceRange.max) {
      const min = Number(priceRange.min);
      const max = Number(priceRange.max);
      list = list.filter((p) => {
        const price = Number(p.price);
        return price >= min && price <= max;
      });
    }

    // 정렬
    if (currentSort === "높은가격순") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (currentSort === "낮은가격순") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    // 그 외 정렬(인기순/관심순/판매일순)은 API에서 받은 순서 유지

    return list;
  }, [products, currentSort, isDirectInputMode, priceRange]);

  // --- [데이터(필터용 상수)] ---
  const colorData = [
    { name: "라벤더", hex: "#A58FCF" },
    { name: "민트", hex: "#81CBB0" },
    { name: "오렌지", hex: "#E85C2E" },
    { name: "다크핑크", hex: "#9D3E64" },
    { name: "페일 핑크", hex: "#D9B8A9" },
    { name: "골드", hex: "#E9D06D" },
    { name: "라임", hex: "#D9FF5C" },
    { name: "라이트 그린", hex: "#9ACD32" },
    { name: "다크 블루", hex: "#2E3192" },
    { name: "오트밀", hex: "#EAE7D6" },
  ];

  const sizes = [
    "220 이하",
    "225",
    "230",
    "235",
    "240",
    "245",
    "250",
    "255",
    "260",
    "265",
    "270",
    "275",
    "280",
    "285",
    "290 이상",
  ];

  // --- [이벤트 핸들러] ---
  const toggleWish = (id) => {
    setWishList((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleColor = (name) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handlePriceInput = (e, type) => {
    // 직접입력 모드일 때만 숫자 로직 작동
    if (!isDirectInputMode) return;
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const applyPrice = () => {
    if (!priceRange.min || !priceRange.max) return alert("가격을 입력하세요");
    console.log("최소 가격:", priceRange.min, "최대 가격:", priceRange.max);
    setActiveModal(null);
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return `${num.toLocaleString("ko-KR")}원`;
  };

  return (
    <div className="search-page-container">
      {/* 헤더 */}
      <Header
        onCategoryClick={() => {
          setIsCategoryOpen(true);
          setIsAlarmOpen(false);
        }}
        onAlarmClick={() => {
          setIsAlarmOpen(true);
          setIsCategoryOpen(false);
        }}
      />
      <CategoryPanel
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
      />
      <AlarmPanel
        isOpen={isAlarmOpen}
        onClose={() => setIsAlarmOpen(false)}
      />

      {/* 검색 키워드 / 결과 요약 */}
      <section className="search-summary" style={{ padding: "12px 16px" }}>
        {keyword ? (
          <p style={{ margin: 0, fontSize: "15px" }}>
            <strong>"{keyword}"</strong> 검색 결과
            {!loading && !errorMsg && (
              <span style={{ color: "#888", marginLeft: 8 }}>
                총 {visibleProducts.length}건
              </span>
            )}
          </p>
        ) : (
          <p style={{ margin: 0, color: "#888" }}>검색어를 입력해주세요.</p>
        )}
      </section>

      {/* 필터 바 */}
      <section className="filter-section">
        <div className="filter-bar">
          <div className="filters">
            <button onClick={() => setActiveModal("color")}>색상 ▾</button>
            <button onClick={() => setActiveModal("price")}>가격대 ▾</button>
            <button onClick={() => setActiveModal("size")}>사이즈 ▾</button>
          </div>
          <div className="sort-container">
            <div className="sort" onClick={() => setIsSortOpen(!isSortOpen)}>
              {currentSort} ⇅
            </div>
            {isSortOpen && (
              <div className="sort-dropdown show">
                {[
                  "인기순",
                  "관심순",
                  "판매일순",
                  "높은가격순",
                  "낮은가격순",
                ].map((item) => (
                  <div
                    key={item}
                    className="sort-item"
                    onClick={() => {
                      setCurrentSort(item);
                      setIsSortOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 상품 그리드 */}
      <main className="product-grid">
        {loading && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: 24 }}>
            검색 중...
          </p>
        )}

        {!loading && errorMsg && (
          <p
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 24,
              color: "#e74c3c",
            }}
          >
            {errorMsg}
          </p>
        )}

        {!loading && !errorMsg && keyword && visibleProducts.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: 24 }}>
            "{keyword}"에 대한 검색 결과가 없습니다.
          </p>
        )}

        {!loading &&
          !errorMsg &&
          visibleProducts.map((item) => {
            const isWished = wishList.includes(item.id);
            const brandText = item.brand?.trim() || item.mallName || "Shop";
            return (
              <Link
                to={`/product/${item.id}`}
                state={item}
                className="product-card"
                key={item.id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-img">
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="product-info">
                  <div className="brand-row">
                    <span className="brand">{brandText}</span>
                    <span
                      className={`material-symbols-outlined wish-icon ${isWished ? "active" : ""
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWish(item.id);
                      }}
                    >
                      {isWished ? "favorite" : "favorite_border"}
                    </span>
                  </div>
                  <p className="name">{item.title}</p>
                  <div className="price-row">
                    <span className="price">{formatPrice(item.price)}</span>
                  </div>
                  <div className="extra-row">
                    <span className="review">{item.category2}</span>
                    {item.category3 && (
                      <span className="wish-count">{item.category3}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

        {/* 더보기 버튼 */}
        {!loading && hasMore && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 24 }}>
            <button
              onClick={() => setOffset(offset + 50)}
              disabled={loadingMore}
              style={{
                padding: "12px 32px",
                fontSize: "16px",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loadingMore ? "not-allowed" : "pointer",
                opacity: loadingMore ? 0.6 : 1,
              }}
            >
              {loadingMore ? "로딩 중..." : "더보기"}
            </button>
          </div>
        )}
      </main>

      {/* 모달 시스템 */}
      {activeModal && (
        <div
          className="modal-overlay"
          style={{ display: "flex" }}
          onClick={() => setActiveModal(null)}
        >
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3>필터</h3>
              <span className="close-x" onClick={() => setActiveModal(null)}>
                &times;
              </span>
            </div>

            <div className="modal-tabs">
              <span className="active-tab">
                {activeModal === "color"
                  ? "색상"
                  : activeModal === "price"
                    ? "가격"
                    : "사이즈"}
              </span>
            </div>

            {activeModal === "color" && (
              <div className="color-selection-grid">
                {colorData.map((c) => (
                  <div
                    key={c.name}
                    className={`color-opt ${selectedColors.includes(c.name) ? "selected" : ""}`}
                    onClick={() => toggleColor(c.name)}
                  >
                    <div
                      className="color-dot"
                      style={{ background: c.hex }}
                    ></div>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            )}

            {activeModal === "price" && (
              <div className="price-content">
                <h4 className="section-title">가격</h4>
                <div className="price-radio-grid">
                  {[
                    "전체",
                    "5만원 이하",
                    "5만원 ~ 10만원",
                    "10만원 ~ 20만원",
                    "20만원 ~ 30만원",
                    "30만원 이상",
                  ].map((p, idx) => (
                    <label key={p}>
                      <input
                        type="radio"
                        name="p"
                        defaultChecked={idx === 0 && !isDirectInputMode}
                        onChange={() => setIsDirectInputMode(false)}
                      />{" "}
                      {p}
                    </label>
                  ))}
                  <label className="full-row">
                    <input
                      type="radio"
                      name="p"
                      checked={isDirectInputMode}
                      onChange={() => setIsDirectInputMode(true)}
                    />{" "}
                    직접입력
                  </label>
                </div>
                <div className="direct-input-row">
                  <input
                    type="text"
                    placeholder="1,000"
                    value={priceRange.min}
                    onChange={(e) => handlePriceInput(e, "min")}
                    disabled={!isDirectInputMode}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    placeholder="5,720,000"
                    value={priceRange.max}
                    onChange={(e) => handlePriceInput(e, "max")}
                    disabled={!isDirectInputMode}
                  />
                  <button
                    className={`small-apply-btn ${priceRange.min && priceRange.max && isDirectInputMode ? "active" : ""}`}
                    onClick={applyPrice}
                    disabled={!isDirectInputMode}
                  >
                    적용
                  </button>
                </div>
              </div>
            )}

            {activeModal === "size" && (
              <div className="size-content">
                <h4 className="section-title">신발 사이즈(mm)</h4>
                <div className="size-grid">
                  {sizes.map((size) => (
                    <label key={size}>
                      <input type="checkbox" /> {size}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-bottom">
              <button
                className="view-products-btn"
                onClick={() => setActiveModal(null)}
              >
                상품보기
              </button>
              <div
                className="reset-link"
                onClick={() => {
                  setSelectedColors([]);
                  setPriceRange({ min: "", max: "" });
                  setIsDirectInputMode(false);
                }}
              >
                ↺ 선택 초기화 및 그 외 상품 보기
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
