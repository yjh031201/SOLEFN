const TOKEN_KEY = "solefn_token";
const USER_KEY = "solefn_user";

// 토큰 저장 (로그인 유지 여부에 따라 localStorage / sessionStorage)
export function saveAuth(token, user, keepLogin = false) {
    const storage = keepLogin ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
}

// 토큰 조회 (둘 다 확인)
export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

// 사용자 정보 조회
export function getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try {
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// 로그아웃 (양쪽 다 지우기)
export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
}

// 로그인 상태 확인
export function isLoggedIn() {
    return !!getToken();
}