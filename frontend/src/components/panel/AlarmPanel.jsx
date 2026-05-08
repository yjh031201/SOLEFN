import "../../assets/css/AlarmPanel.css";

export default function AlarmPanel({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="alarm-overlay" onClick={onClose} />
      )}

      <aside className={`alarm-drawer ${isOpen ? "open" : ""}`}>
        <div className="alarm-header">
          <button onClick={onClose}>✕</button>
          <h2>알림</h2>
        </div>
        <div className="alarm-body">
          <p style={{ padding: "20px", color: "#999" }}>새로운 알림이 없습니다.</p>
        </div>
      </aside>
    </>
  );
}