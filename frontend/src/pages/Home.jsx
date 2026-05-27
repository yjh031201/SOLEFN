import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/HomePage.css";

import CategoryPanel from "../components/panel/CategoryPanel";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AlarmPanel from "../components/panel/AlarmPanel";
import NavBar from "../components/layout/NavBar";

// 메인 히어로 슬라이드용 이미지/영상
import MainHero from "../assets/images/MainHero.png";
import CrocsImage from "../assets/images/Crocs.png";
import NewImage from "../assets/images/new.png";
import SampleVideo from "../assets/videos/sample.mp4";

// 브랜드 로고
import nikeLogo from "../assets/images/nike_logo.png";
import adidasLogo from "../assets/images/adidas_logo.png";
import newbalanceLogo from "../assets/images/newbalance_logo.png";
import converseLogo from "../assets/images/Converse_logo.svg.png";
import vansLogo from "../assets/images/vans_logo.png";

export default function HomePage() {
  // ───────── 히어로 슬라이드 데이터 ─────────
  const heroSlides = [
    {
      id: 1,
      image: MainHero,
      smallTitle: "어디서나 편안한",
      title: "뉴발란스",
      desc: "당신의 모든 걸음이 가벼워질 수 있게,\n가장 합리적인 선택을 도와드립니다.",
    },
    {
      id: 2,
      image: NewImage,
      smallTitle: "남들보다 빠르게",
      title: "오늘의 신상 트렌드",
      desc: "지금 가장 핫한 스니커즈부터 한정판까지,\n당신의 스타일을 완성할 최신 라인업을 확인하세요.",
    },
    {
      id: 3,
      image: CrocsImage,
      hideText: true,
      desc: "가볍고 편안한 크록스와 함께\n매일을 자유롭게 걸어보세요.",
    },
    {
      id: 4,
      video: SampleVideo,
      hideText: true,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isPlaying) return;
    const currentIsVideo = heroSlides[currentSlide]?.video;
    if (currentIsVideo) return; // 영상 슬라이드면 자동 넘김 중단

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  // ───────── 더미 데이터 ─────────
  const brandItems = [
    { id: 1, name: "나이키", image: nikeLogo },
    { id: 2, name: "아디다스", image: adidasLogo },
    { id: 3, name: "뉴발란스", image: newbalanceLogo },
    { id: 4, name: "컨버스", image: converseLogo },
    { id: 5, name: "반스", image: vansLogo },
  ];

  const categoryItems = [
    {
      id: 1,
      name: "지금 인기",
      image:
        "https://images.unsplash.com/photo-1554192833-605c183c9f45?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "스니커즈",
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "구두",
      image:
        "https://images.unsplash.com/photo-1552422554-0d5af0c79fc6?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "슬리퍼",
      image:
        "https://images.unsplash.com/photo-1622920799137-86c891159e44?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "하이힐",
      image:
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "등산화",
      image:
        "https://images.unsplash.com/photo-1631287381310-925554130169?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 7,
      name: "워커",
      image:
        "https://images.unsplash.com/photo-1674421240323-1a8d4602cc1e?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "크로스",
      image:
        "https://images.unsplash.com/photo-1662380683558-8325ab2ca065?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "샌들",
      image:
        "https://images.unsplash.com/photo-1618615098938-84fc29796e76?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 10,
      name: "캔버스화",
      image:
        "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const cards = [
    {
      id: 1,
      title: "브랜드 비교",
      desc: "여러 쇼핑몰의 가격을 한눈에 비교해보세요.",
      image:
        "https://images.unsplash.com/photo-1618677831741-6260a73ff4f9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "최저가 확인",
      desc: "신발별 최저가를 빠르게 확인할 수 있어요.",
      image:
        "https://images.unsplash.com/photo-1571907483086-3c0ea40cc16d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "바로 이동",
      desc: "원하는 쇼핑몰로 이동해서 바로 구매하세요.",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryInitialSection, setCategoryInitialSection] = useState(null);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  const navigate = useNavigate();

  const goSearch = (keyword) => {
    navigate(`/search/result?q=${encodeURIComponent(keyword)}`);
  };

  const openCategoryPanel = (section = null) => {
    setCategoryInitialSection(section);
    setIsCategoryOpen(true);
    setIsAlarmOpen(false);
  };

  return (
    <>
      <div className="page">
        {/* 헤더 */}
        <Header
          onCategoryClick={() => {
            setCategoryInitialSection(null);
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
          initialSection={categoryInitialSection}
        />

        <AlarmPanel
          isOpen={isAlarmOpen}
          onClose={() => setIsAlarmOpen(false)}
        />
        <NavBar />

        <main className="main-content">
          {/* ───────── 메인 히어로 슬라이드 ───────── */}
          <section className="hero-section">
            <div className="hero-slides-wrapper">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`hero-slide ${index === currentSlide ? "active" : ""}`}
                >
                  {slide.video ? (
                    <video
                      className="hero-image hero-video"
                      src={slide.video}
                      autoPlay
                      muted
                      playsInline
                      loop
                    />
                  ) : (
                    <img
                      className="hero-image"
                      src={slide.image}
                      alt={slide.title || "hero slide"}
                    />
                  )}

                  <div
                    className={`hero-overlay ${slide.hideText ? "hide-text" : ""}`}
                  >
                    {!slide.hideText && (
                      <>
                        <p className="hero-small">{slide.smallTitle}</p>
                        <h1 className="hero-title">{slide.title}</h1>
                        <p
                          className="hero-desc"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {slide.desc}
                        </p>
                        <button className="hero-cta">최저가 보러가기</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="slide-btn left"
              aria-label="이전"
              onClick={prevSlide}
            >
              ‹
            </button>
            <button
              className="slide-btn right"
              aria-label="다음"
              onClick={nextSlide}
            >
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
            <p>
              수천 개의 가격 데이터가 정돈된 하나의 선명한 결론, <br />
              비교의 수고로움이 사라진 자리에 채워지는 쇼핑의 즐거움
            </p>
          </section>

          {/* 프로모션 섹션 */}
          <section className="promo-section">
            <div className="section-title-row">
              <h2>SOLEFN만의 특별한 혜택</h2>
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
              <div
                className="more-btn"
                onClick={() => openCategoryPanel("브랜드")}
              >
                더보기
              </div>
            </div>

            <div className="brand-grid">
              {brandItems.map((item) => (
                <div
                  className="brand-item"
                  key={item.id}
                  onClick={() => goSearch(item.name)}
                >
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

          {/* 카테고리 섹션 */}
          <section className="category-section">
            <div className="section-title-row">
              <h2>카테고리 모두보기</h2>
            </div>

            <div className="category-grid">
              {categoryItems.map((item) => (
                <div
                  className="category-item"
                  key={item.id}
                  onClick={() => goSearch(item.name)}
                >
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