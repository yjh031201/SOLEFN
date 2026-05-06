const KEY = "solefn_recent_searches";
const MAX_ITEMS = 10;

// 최근 검색어 목록 가져오기
export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 검색어 추가 (중복 제거 + 맨 앞 + 최대 10개)
export function addRecentSearch(keyword) {
  if (!keyword || !keyword.trim()) return;
  const trimmed = keyword.trim();

  const list = getRecentSearches();
  const filtered = list.filter((item) => item !== trimmed);
  filtered.unshift(trimmed);

  const limited = filtered.slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(limited));
}

// 특정 검색어 삭제
export function removeRecentSearch(keyword) {
  const list = getRecentSearches();
  const filtered = list.filter((item) => item !== keyword);
  localStorage.setItem(KEY, JSON.stringify(filtered));
}

// 전체 삭제
export function clearRecentSearches() {
  localStorage.removeItem(KEY);
}