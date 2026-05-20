import "../../assets/css/AlarmPanel.css";
import { useAlarm } from "../../context/AlarmContext";
import { useNavigate } from "react-router-dom";

function formatTime(date) {
  const d = new Date(date);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function AlarmPanel({ isOpen, onClose }) {
  const { alarms, removeAlarm, clearAlarms } = useAlarm();
  const navigate = useNavigate();

  const handleAlarmClick = (alarm) => {
    if (!alarm.productId) return;
    onClose();
    navigate(`/product/${alarm.productId}`, { state: alarm.productState });
  };

  return (
    <>
      {isOpen && (
        <div className="alarm-overlay" onClick={onClose} />
      )}

      <aside className={`alarm-drawer ${isOpen ? "open" : ""}`}>
        <div className="alarm-header">
          <button onClick={onClose}>✕</button>
          <h2>알림</h2>
          {alarms.length > 0 && (
            <button
              onClick={clearAlarms}
              style={{ marginLeft: "auto", fontSize: "13px", color: "#888", width: "auto", padding: "4px 8px" }}
            >
              전체 삭제
            </button>
          )}
        </div>
        <div className="alarm-body">
          {alarms.length === 0 ? (
            <p style={{ padding: "20px 0", color: "#999" }}>새로운 알림이 없습니다.</p>
          ) : (
            alarms.map((alarm) => (
              <div key={alarm.id} className="alarm-item">
                {/* 썸네일 */}
                {alarm.productImage ? (
                  <img
                    src={alarm.productImage}
                    alt={alarm.productTitle}
                    className="alarm-thumbnail"
                    onClick={() => handleAlarmClick(alarm)}
                  />
                ) : (
                  <div className="alarm-icon">🤍</div>
                )}

                {/* 내용 */}
                <div
                  className="alarm-content"
                  onClick={() => handleAlarmClick(alarm)}
                >
                  <p className="alarm-message">{alarm.message}</p>
                  {alarm.productTitle && (
                    <p className="alarm-product">{alarm.productTitle}</p>
                  )}
                  <span className="alarm-time">{formatTime(alarm.createdAt)}</span>
                </div>

                {/* 개별 삭제 버튼 */}
                <button
                  className="alarm-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAlarm(alarm.id);
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
