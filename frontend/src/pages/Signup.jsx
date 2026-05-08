import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { useAuth } from "../context/AuthContext.jsx";
import solefn from "../assets/images/SOLEFN.png";

// 비밀번호 보기/숨기기 아이콘
const EyeOpen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    passwordConfirm: "",
    emailId: "",
    emailDomain: "",
  });

  const [idChecked, setIdChecked] = useState(false);
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // 아이디가 바뀌면 중복확인 상태 초기화
    if (e.target.name === "username") setIdChecked(false);
    // 입력하면 해당 필드 에러 메시지 제거
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // 아이디 중복확인 (백엔드 API 호출)
  const checkDuplicate = async () => {
    if (!form.username.trim()) {
      setErrors((prev) => ({ ...prev, username: "아이디를 입력하세요." }));
      return;
    }

    setIdCheckLoading(true);
    setErrors((prev) => ({ ...prev, username: "" }));

    try {
      const res = await axiosInstance.get("/auth/check-username", {
        params: { username: form.username.trim() },
      });

      if (res.data?.available) {
        setIdChecked(true);
      } else {
        setIdChecked(false);
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용 중인 아이디입니다.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        username: "중복확인 중 오류가 발생했습니다.",
      }));
    } finally {
      setIdCheckLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "이름을 입력하세요.";
    if (!form.username.trim()) newErrors.username = "아이디를 입력하세요.";
    else if (!idChecked) newErrors.username = "중복확인을 해주세요.";
    if (!form.password) newErrors.password = "비밀번호를 입력하세요.";
    if (form.password !== form.passwordConfirm)
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!form.emailId || !form.emailDomain)
      newErrors.email = "이메일을 입력하세요.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    const payload = {
      username: form.username.trim(),
      name: form.name.trim(),
      email: `${form.emailId.trim()}@${form.emailDomain}`,
      password: form.password,
    };

    try {
      const res = await axiosInstance.post("/auth/signup", payload);
      const { token, username, email, name } = res.data;

      // 회원가입 후 자동 로그인 (localStorage에 저장)
      login(token, { username, email, name }, true);

      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "회원가입에 실패했습니다.";
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

          <div className="flex flex-col gap-5">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                이름
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요."
                className={inputClass("name")}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* 아이디 + 중복확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                아이디
              </label>
              <div className="flex gap-2">
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요."
                  className={`${inputClass("username")} flex-1`}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                />
                <button
                  type="button"
                  onClick={checkDuplicate}
                  disabled={idCheckLoading}
                  className={`px-4 text-white text-xs font-semibold rounded-lg whitespace-nowrap transition-colors duration-200 ${
                    idChecked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-900 hover:bg-gray-700"
                  } ${idCheckLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {idCheckLoading
                    ? "확인 중..."
                    : idChecked
                      ? "✓ 확인됨"
                      : "중복확인"}
                </button>
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요."
                  className={inputClass("password")}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 재확인 */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                비밀번호 재확인
              </label>
              <div className="relative">
                <input
                  name="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요."
                  className={inputClass("passwordConfirm")}
                  onFocus={() => setFocused("passwordConfirm")}
                  onBlur={() => setFocused("")}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPasswordConfirm ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
              {errors.passwordConfirm && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* 이메일 (아이디@도메인) */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                이메일
              </label>
              <div
                className={`flex items-center border rounded-lg bg-white overflow-hidden transition-colors duration-200 ${
                  errors.email
                    ? "border-red-500"
                    : focused === "emailId" || focused === "emailDomain"
                      ? "border-gray-900"
                      : "border-gray-300"
                }`}
              >
                <input
                  name="emailId"
                  value={form.emailId}
                  onChange={handleChange}
                  placeholder="이메일"
                  className="min-w-0 flex-1 px-4 py-3 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
                  onFocus={() => setFocused("emailId")}
                  onBlur={() => setFocused("")}
                />
                <span className="text-gray-400 text-sm flex-shrink-0">@</span>
                <div className="relative flex-shrink-0 w-36">
                  <select
                    name="emailDomain"
                    value={form.emailDomain}
                    onChange={handleChange}
                    className="w-full pl-2 pr-8 py-3 text-sm outline-none bg-transparent text-gray-500 cursor-pointer appearance-none"
                    onFocus={() => setFocused("emailDomain")}
                    onBlur={() => setFocused("")}
                  >
                    <option value="">선택하기</option>
                    <option value="naver.com">naver.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="daum.net">daum.net</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* 서버 에러 (가입 실패 시) */}
            {submitError && (
              <p className="text-sm text-red-500 -mt-2">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-4 bg-gray-900 text-white text-sm font-bold rounded-lg tracking-wider hover:bg-gray-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "가입 중..." : "가입하기"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-2">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-black hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
