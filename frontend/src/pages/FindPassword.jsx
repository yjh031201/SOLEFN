import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import solefn from "../assets/images/SOLEFN.png";

export default function FindPassword() {
  const [form, setForm] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "아이디를 입력하세요.";
    if (!form.email.trim()) newErrors.email = "이메일을 입력하세요.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSent(false);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await axiosInstance.post("/auth/find-password", {
        username: form.username.trim(),
        email: form.email.trim(),
      });
      setSent(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "비밀번호 재설정 메일 발송에 실패했습니다.";
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors duration-200 bg-white text-gray-900 placeholder-gray-400 ${
      errors[name]
        ? "border-red-500"
        : focused === name
          ? "border-gray-900"
          : "border-gray-300"
    }`;

  return (
    <div className="flex w-screen h-screen">
      {/* 좌측 검정 패널 */}
      <div className="w-1/2 bg-black" />

      {/* 우측 폼 패널 */}
      <div className="w-1/2 bg-white px-8 py-12 overflow-y-auto flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="text-4xl font-black tracking-tighter mb-10">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src={solefn} alt="SOLEFN 로고" className="logo-image" />
            </Link>
          </div>

          <h2 className="text-xl font-bold mb-6">비밀번호 찾기</h2>

          <div className="flex flex-col gap-5">
            {/* 아이디 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                아이디
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="가입 시 입력한 아이디"
                className={inputClass("username")}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                이메일
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="가입 시 입력한 이메일"
                className={inputClass("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* 결과 영역 */}
            {sent && (
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                입력하신 이메일로 <strong className="text-black">비밀번호 재설정 안내</strong>
                를 발송했습니다. 메일함을 확인해주세요.
              </div>
            )}

            {/* 서버 에러 */}
            {submitError && (
              <p className="text-sm text-red-500 -mt-2">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-4 bg-gray-900 text-white text-sm font-bold rounded-lg tracking-wider hover:bg-gray-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "발송 중..." : "재설정 메일 받기"}
            </button>

            <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
              <Link to="/login" className="hover:text-gray-800 transition-colors">
                로그인
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/find-id" className="hover:text-gray-800 transition-colors">
                아이디 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/signup" className="hover:text-gray-800 transition-colors">
                회원가입
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
