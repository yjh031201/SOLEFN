import { useState } from "react";

const popularKeywords = [
  { rank: 1, keyword: "아디다스", trend: "up" },
  { rank: 2, keyword: "에어 포스", trend: "down" },
  { rank: 3, keyword: "휠라", trend: "up" },
  { rank: 4, keyword: "운동화", trend: "down" },
  { rank: 5, keyword: "크록스", trend: "up" },
];

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [recentList, setRecentList] = useState([]);

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setRecentList((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      return [trimmed, ...filtered];
    });
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const removeRecent = (keyword) => {
    setRecentList((prev) => prev.filter((item) => item !== keyword));
  };

  return (
    <div style={styles.container}>
      {/* 검색 박스 */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <span
          className="material-symbols-outlined"
          style={styles.searchIcon}
          onClick={handleSearch}
        >
          search
        </span>
      </div>

      {/* 최근 검색어 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>최근 검색어</h2>
        <ul style={styles.recentList}>
          {recentList.length === 0 ? (
            <li style={styles.emptyText}>최근 검색어가 없습니다.</li>
          ) : (
            recentList.map((keyword) => (
              <li key={keyword} style={styles.recentItem}>
                <span>{keyword}</span>
                <button
                  onClick={() => removeRecent(keyword)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 인기 검색어 */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>인기 검색어</h2>
        <ul style={styles.rankList}>
          {popularKeywords.map(({ rank, keyword, trend }) => (
            <li key={rank} style={styles.rankItem}>
              <span style={styles.rank}>{rank}</span>
              <span style={styles.keyword}>{keyword}</span>
              <span style={trend === "up" ? styles.arrowUp : styles.arrowDown}>
                {trend === "up" ? "▲" : "▼"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "0 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    border: "2px solid #ccc",
    borderRadius: "24px",
    padding: "8px 16px",
    gap: "8px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "transparent",
  },
  searchIcon: {
    cursor: "pointer",
    color: "#555",
    fontSize: "24px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  recentList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f0f0f0",
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: "14px",
  },
  removeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
    fontSize: "12px",
    padding: 0,
    lineHeight: 1,
  },
  emptyText: {
    fontSize: "14px",
    color: "#aaa",
    listStyle: "none",
  },
  rankList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  rankItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 4px",
    borderBottom: "1px solid #eee",
    fontSize: "15px",
  },
  rank: {
    fontWeight: "bold",
    color: "#333",
    width: "20px",
    textAlign: "center",
  },
  keyword: {
    flex: 1,
    color: "#222",
  },
  arrowUp: {
    color: "#e74c3c",
    fontSize: "12px",
  },
  arrowDown: {
    color: "#3498db",
    fontSize: "12px",
  },
};
