import "../../assets/css/CategoryPanel.css";

const categoryData = {
  "신발종류": [
    { name: "스니커즈", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "러닝화",   image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "구두",     image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
    { name: "슬리퍼",  image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop" },
    { name: "샌들",    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop" },
    { name: "등산화",  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "워커",    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "캔버스화",image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
  ],
  "브랜드": [
    { name: "나이키",   image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "아디다스", image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "뉴발란스", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
    { name: "푸마",     image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop" },
    { name: "아식스",   image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop" },
    { name: "반스",     image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "컨버스",   image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "르꼬끄",   image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
  ],
  "인기모델": [
    { name: "에어포스", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "조던",     image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "삼바",     image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
    { name: "1906",     image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop" },
    { name: "젤카야노", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop" },
    { name: "슈퍼스타", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" },
    { name: "올스타",   image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=600&auto=format&fit=crop" },
    { name: "팔레르모", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop" },
  ],
};

export default function CategoryPanel({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="category-overlay" onClick={onClose} />
      )}

      <aside className={`category-drawer ${isOpen ? "open" : ""}`}>
        <div className="category-drawer-header">
          <button onClick={onClose}>✕</button>
          <h2>카테고리</h2>
        </div>

        <div className="category-drawer-body">
          {Object.entries(categoryData).map(([title, items]) => (
            <div key={title} className="drawer-section">
              <h3>{title}</h3>
              <div className="drawer-grid">
                {items.map((item) => (
                  <div key={item.name} className="drawer-card">
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