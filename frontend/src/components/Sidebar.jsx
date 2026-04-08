import { Link } from "react-router-dom";
import "../assets/css/Sidebar.css";



export default function Sidebar({ title, menus }) {
  return (
    <aside className="sidebar">
      <Link to="/mypage" className="mypage">
        {title}
      </Link>

      {menus.map((menu, idx) => (
        <div className="menu" key={idx}>
          <h3>{menu.title}</h3>

          {menu.items.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      ))}
    </aside>
  );
}