import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/LoginUi/Button";
import { Card, CardContent } from "../components/LoginUi/Card";
import { Checkbox } from "../components/LoginUi/CheckBox";
import { Input } from "../components/LoginUi/Input";
import solefn from "../assets/images/SOLEFN.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "로그인에 실패했습니다.");
        return;
      }

      const storage = keepLogin ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify({
        username: data.username,
        email: data.email,
        name: data.name,
      }));

      navigate("/");
    } catch {
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full min-w-[1512px] items-start justify-center bg-white px-6 pt-[61px] pb-[120px]">
      <section className="flex w-full max-w-[975px] flex-col items-center">
        <h1 className="mb-[121px] text-center font-['Montserrat',Helvetica] text-[100px] font-semibold leading-none tracking-[0] text-black">
          <img src={solefn} alt="SOLEFN 로고" className="logo-image" />
        </h1>

        <Card className="w-full rounded-[20px] border border-black bg-transparent shadow-none">
          <CardContent className="flex min-h-[454px] flex-col items-center px-[64px] pt-[41px] pb-[44px]">
            <form
              className="flex w-full max-w-[489px] flex-col"
              onSubmit={handleSubmit}
            >
              <fieldset className="flex flex-col">
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-[93px] border-black px-[20px] font-['Montserrat',Helvetica] text-2xl font-normal tracking-[0] text-black placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-t-[20px] rounded-b-none border-b-0"
                />
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-[93px] border-black px-[20px] font-['Montserrat',Helvetica] text-2xl font-normal tracking-[0] text-black placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 rounded-b-[20px] rounded-t-none"
                />
              </fieldset>

              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}

              <label
                htmlFor="keep-login"
                className="mt-[14px] flex w-fit cursor-pointer items-center gap-3"
              >
                <Checkbox
                  id="keep-login"
                  checked={keepLogin}
                  onCheckedChange={setKeepLogin}
                  className="h-5 w-5 rounded-[4px] border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                />
                <span className="font-['Montserrat',Helvetica] text-2xl font-normal leading-normal tracking-[0] text-black">
                  로그인 상태 유지
                </span>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="mt-[14px] h-auto min-h-[91px] w-full rounded-[14px] bg-[#d9d9d9] py-5 font-['Montserrat',Helvetica] text-[40px] font-normal leading-normal tracking-[0] text-black hover:bg-[#d9d9d9]"
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <nav aria-label="계정 관련 링크" className="mt-[69px]">
          <ul className="flex items-center justify-center font-['Montserrat',Helvetica] text-2xl font-normal leading-normal tracking-[0] text-[#7b7b7b]">
            <li className="flex items-center">
              <a href="#" className="px-[37px] transition-opacity hover:opacity-80">비밀번호 찾기</a>
              <span aria-hidden="true" className="text-[#7b7b7b]">|</span>
            </li>
            <li className="flex items-center">
              <a href="#" className="px-[37px] transition-opacity hover:opacity-80">아이디 찾기</a>
              <span aria-hidden="true" className="text-[#7b7b7b]">|</span>
            </li>
            <li className="flex items-center">
              <a href="/signup" className="px-[37px] transition-opacity hover:opacity-80">회원가입</a>
            </li>
          </ul>
        </nav>
      </section>
    </main>
  );
}
