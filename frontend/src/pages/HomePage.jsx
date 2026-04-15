import { useState } from "react";
import "../assets/css/HomePage.css";
import CategoryPanel from "../components/CategoryPanel";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AlarmPanel from "../components/AlarmPanel";
import NavBar from "../components/NavBar";
import mainimage from "../assets/images/mainimage.png";

export default function HomePage() {
  //더미 데이터
  const brandItems = [
    {
      id: 1,
      name: "나이키",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "아디다스",
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "뉴발란스",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "컨버스",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "반스",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const categoryItems = [
    {
      id: 1,
      name: "지금 인기",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "스니커즈",
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "구두",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "슬리퍼",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "하이힐",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "등산화",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "워커",
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "크로스",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "샌들",
      image:
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 10,
      name: "캔버스화",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const cards = [
    {
      id: 1,
      title: "브랜드 비교",
      desc: "여러 쇼핑몰의 가격을 한눈에 비교해보세요.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "최저가 확인",
      desc: "신발별 최저가를 빠르게 확인할 수 있어요.",
      image:
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "바로 이동",
      desc: "원하는 쇼핑몰로 이동해서 바로 구매하세요.",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  return (
    <>
      <div className="page">
        {/* 헤더추가 */}
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
        <NavBar />
        {/* 상단 슬라이드*/}
        <main className="main-content">
          <section className="hero-section">
            <button className="slide-btn left" aria-label="이전">
              ‹
            </button>

            <div className="hero-overlay">
              <p className="hero-small">새로운 브랜드</p>
              <h1 className="hero-title">나이키</h1>
              <p className="hero-desc">
                다양한 판매처의 가격을 비교하고
                <br />
                원하는 신발의 최저가를 찾아보세요.
              </p>
              <button className="hero-cta">최저가 보러가기</button>
            </div>

            <img
              className="hero-image"
              src={mainimage}
              alt="메인 신발 배너"
            />

            <button className="slide-btn right" aria-label="다음">
              ›
            </button>
          </section>
          {/* 스타일 신발 섹션 */}
          <section className="sub-hero-section">
            <img
              src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=1600&auto=format&fit=crop"
              alt="추가 배너"
              className="sub-hero-image"
            />
          </section>
          {/* 슬로건 섹션 */}
          <section className="slogan-section">
            <h2>모든 가격을 넘어, 단 하나의 최선으로</h2>
            <p>수천 개의 가격 데이터가 정돈된 하나의 선명한 결론, <br />
              비교의 수고로움이 사라진 자리에 채워지는 쇼핑의 즐거움</p>
          </section>
          {/* 프로모션 섹션 */}
          <section className="promo-section">
            <div className="section-title-row">
              <h2>FIND SHOES가 추천하는 신발</h2>
              <div className="more-btn">더보기</div>
            </div>

            <div className="promo-grid">
              {cards.map((card) => (
                <article className="promo-card" key={card.id}>
                  <img src={card.image} alt={card.title} />
                  <div className="promo-card-body">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          {/* 브랜드 섹션 */}
          <section className="brand-section">
            <div className="section-title-row">
              <h2>브랜드</h2>
              <div className="more-btn">전체보기</div>
            </div>

            <div className="brand-grid">
              {brandItems.map((item) => (
                <div className="brand-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="brand-item-image"
                  />
                  <p className="brand-item-name">{item.name}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="category-section">
            <div className="section-title-row">
              <h2>카테고리 모두보기</h2>
              <div className="more-btn">전체보기</div>
            </div>

            <div className="category-grid">
              {categoryItems.map((item) => (
                <div className="category-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="category-item-image"
                  />
                  <p className="category-item-name">{item.name}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
