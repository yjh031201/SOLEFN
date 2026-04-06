import React, { useState } from "react";
import "./style.css";

interface Product {
  name: string;
  price: string;
  discount: string;
  img: string;
}

interface ColorOption {
  name: string;
  hex: string;
}

const SearchResultPage: React.FC = () => {
  // --- [상태 관리] ---
  const [activeModal, setActiveModal] = useState<
    "color" | "price" | "size" | null
  >(null);
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [currentSort, setCurrentSort] = useState<string>("인기순");
  const [wishList, setWishList] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // 추가된 상태: '직접입력' 라디오가 체크되었는지 확인
  const [isDirectInputMode, setIsDirectInputMode] = useState<boolean>(false);

  // --- [데이터] ---
  const productData: Product[] = [
    {
      name: "나이키 에어포스 1 '07 로우 화이트",
      price: "100,000원",
      discount: "32%",
      img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400",
    },
    {
      name: "나이키 에어포스 1 '07 로우 트리플 블랙",
      price: "109,000원",
      discount: "26%",
      img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    },
  ];

  const colorData: ColorOption[] = [
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

  const sizes: string[] = [
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
  const toggleWish = (index: number) => {
    setWishList((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const toggleColor = (name: string) => {
    setSelectedColors((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  };

  const handlePriceInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max",
  ) => {
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

  return (
    <div className="search-page-container">
      {/* 헤더 */}
      <header>
        <div className="header-content">
          <h1 className="logo">로고</h1>
          <div className="user-area">
            <nav className="user-menu">
              <span>고객센터</span>
              <span>마이페이지</span>
              <span>로그아웃</span>
            </nav>
            <div className="icon-row">
              <span className="material-symbols-outlined">search</span>
              <span className="material-symbols-outlined">menu</span>
              <span className="material-symbols-outlined">notifications</span>
            </div>
          </div>
        </div>
      </header>

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
        {Array.from({ length: 15 }).map((_, i) => {
          const item = productData[i % productData.length];
          const isWished = wishList.includes(i);
          return (
            <div className="product-card" key={i}>
              <div className="product-img">
                <img
                  src={`${item.img}&sig=${i}`}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="product-info">
                <div className="brand-row">
                  <span className="brand">Nike</span>
                  <span
                    className={`material-symbols-outlined wish-icon ${isWished ? "active" : ""}`}
                    onClick={() => toggleWish(i)}
                  >
                    {isWished ? "favorite" : "favorite_border"}
                  </span>
                </div>
                <p className="name">{item.name}</p>
                <div className="price-row">
                  {item.discount && (
                    <span className="discount">{item.discount}</span>
                  )}
                  <span className="price">{item.price}</span>
                </div>
                <div className="extra-row">
                  <span className="review">후기 1,234</span>
                  <span className="wish-count">관심 2,345</span>
                </div>
              </div>
            </div>
          );
        })}
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
};

export default SearchResultPage;
