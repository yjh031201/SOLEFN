import { Link } from "react-router-dom";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ title, menus, link }) {
  const handleClick = (scrollTo) => {
    if (!scrollTo) return;
    const el = document.getElementById(scrollTo);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="sidebar">
      <Link to={link} className="mypage">
        {title}
      </Link>

      {menus.map((menu, idx) => (
        <div className="menu" key={idx}>
          <h3>{menu.title}</h3>

          {menu.items.map((item, i) => {
            const label = typeof item === "string" ? item : item.label;
            const scrollTo = typeof item === "object" ? item.scrollTo : null;
            return (
              <p
                key={i}
                onClick={() => handleClick(scrollTo)}
                style={scrollTo ? { cursor: "pointer" } : {}}
              >
                {label}
              </p>
            );
          })}
        </div>
      ))}
    </aside>
  );
}