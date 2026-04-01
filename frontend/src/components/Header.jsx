import TopBar from "./TopBar";
import NavBar from "./NavBar";

export default function Header({ onCategoryClick, onAlarmClick, showNav = true }) {
  
  return (
    <div className={`header-wrap ${showNav ? "with-nav" : "no-nav"}`}>
      <TopBar
        onCategoryClick={onCategoryClick}
        onAlarmClick={onAlarmClick}
      />
      {showNav && <NavBar />}
    </div>
  );
}