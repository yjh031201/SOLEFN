import { createContext, useContext, useState } from "react";
import { saveAuth, getUser, clearAuth, isLoggedIn } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // 페이지 첫 로드 시 storage에서 사용자 정보 가져오기 (lazy init)
    const [user, setUser] = useState(() => getUser());

    // 로그인: 토큰과 사용자 정보 저장
    const login = (token, userData, keepLogin = false) => {
        saveAuth(token, userData, keepLogin);
        setUser(userData);
    };

    // 로그아웃: 모든 정보 삭제
    const logout = () => {
        clearAuth();
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isLoggedIn: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 다른 컴포넌트에서 쓰기 편하게 커스텀 훅 제공
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth는 AuthProvider 안에서만 사용 가능합니다");
    }
    return context;
}