import TopBar from "./TopBar";
import "../assets/css/Header.css";

export default function Header({ onCategoryClick, onAlarmClick }) {
  return (
    <div className="header-wrap">
      <TopBar
        onCategoryClick={onCategoryClick}
        onAlarmClick={onAlarmClick}
      />
    </div>
  );
}