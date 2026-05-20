import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/CategoryPanel.css";
import nikeLogo from "../../assets/images/nike_logo.png";
import adidasLogo from "../../assets/images/adidas_logo.png";
import newbalanceLogo from "../../assets/images/newbalance_logo.png";
import pumaLogo from "../../assets/images/puma_logo.png";
import asicsLogo from "../../assets/images/asics_logo.png";
import vansLogo from "../../assets/images/vans_logo.png";
import converseLogo from "../../assets/images/Converse_logo.svg.png";
import lecoqsportifLogo from "../../assets/images/lecoqsportif_logo.png";

const categoryData = {
  "신발종류": [
    { name: "스니커즈", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop" },
    { name: "러닝화",   image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=600&auto=format&fit=crop" },
    { name: "구두",     image: "https://images.unsplash.com/photo-1552422554-0d5af0c79fc6?q=80&w=600&auto=format&fit=crop" },
    { name: "슬리퍼",   image: "https://images.unsplash.com/photo-1622920799137-86c891159e44?q=80&w=600&auto=format&fit=crop" },
    { name: "샌들",     image: "https://images.unsplash.com/photo-1618615098938-84fc29796e76?q=80&w=600&auto=format&fit=crop" },
    { name: "등산화",   image: "https://images.unsplash.com/photo-1631287381310-925554130169?q=80&w=600&auto=format&fit=crop" },
    { name: "워커",     image: "https://images.unsplash.com/photo-1674421240323-1a8d4602cc1e?q=80&w=600&auto=format&fit=crop" },
    { name: "캔버스화", image: "https://images.unsplash.com/photo-1650320079970-b4ee8f0dae33?q=80&w=600&auto=format&fit=crop" },
  ],
  "브랜드": [
    { name: "나이키",   image: nikeLogo },
    { name: "아디다스", image: adidasLogo },
    { name: "뉴발란스", image: newbalanceLogo },
    { name: "푸마",     image: pumaLogo },
    { name: "아식스",   image: asicsLogo },
    { name: "반스",     image: vansLogo },
    { name: "컨버스",   image: converseLogo },
    { name: "르꼬끄",   image: lecoqsportifLogo },
  ],
  "인기모델": [
    { name: "에어포스", image: "https://images.unsplash.com/photo-1597350584914-55bb62285896?q=80&w=600&auto=format&fit=crop" },
    { name: "조던",     image: "https://images.unsplash.com/photo-1656944227421-416b1d2186c9?q=80&w=600&auto=format&fit=crop" },
    { name: "삼바",     image: "https://images.unsplash.com/photo-1718220130188-428c7dc27fd2?q=80&w=600&auto=format&fit=crop" },
    { name: "1906",     image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=600&auto=format&fit=crop" },
    { name: "젤카야노", image: "https://images.unsplash.com/photo-1560072810-1cffb09faf0f?q=80&w=600&auto=format&fit=crop" },
    { name: "슈퍼스타", image: "https://images.unsplash.com/photo-1593287073863-c992914cb3e3?q=80&w=600&auto=format&fit=crop" },
    { name: "올스타",   image: "https://images.unsplash.com/photo-1565379793984-e65b51b33b37?q=80&w=600&auto=format&fit=crop" },
    { name: "팔레르모", image: "https://images.unsplash.com/photo-1619253341026-74c609e6ce50?q=80&w=600&auto=format&fit=crop" },
  ],
};

export default function CategoryPanel({ isOpen, onClose, initialSection }) {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const headerRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const target = initialSection ? sectionRefs.current[initialSection] : null;
    if (target) {
      const headerH = headerRef.current ? headerRef.current.offsetHeight : 0;
      drawer.scrollTop = Math.max(0, target.offsetTop - headerH);
    } else {
      drawer.scrollTop = 0;
    }
  }, [isOpen, initialSection]);

  const handleItemClick = (name) => {
    if (onClose) onClose();
    navigate(`/search/result?q=${encodeURIComponent(name)}`);
  };

  return (
    <>
      {isOpen && (
        <div className="category-overlay" onClick={onClose} />
      )}

      <aside ref={drawerRef} className={`category-drawer ${isOpen ? "open" : ""}`}>
        <div ref={headerRef} className="category-drawer-header">
          <button onClick={onClose}>✕</button>
          <h2>카테고리</h2>
        </div>

        <div className="category-drawer-body">
          {Object.entries(categoryData).map(([title, items]) => (
            <div
              key={title}
              className={`drawer-section ${title === "브랜드" ? "is-brand" : ""}`}
              ref={(el) => {
                sectionRefs.current[title] = el;
              }}
            >
              <h3>{title}</h3>
              <div className="drawer-grid">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="drawer-card"
                    onClick={() => handleItemClick(item.name)}
                  >
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
