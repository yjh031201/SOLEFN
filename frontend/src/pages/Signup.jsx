import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/LoginUi/Button";
import { Card, CardContent } from "../components/LoginUi/Card";
import { Input } from "../components/LoginUi/Input";
import solefn from "../assets/images/SOLEFN.png";

const fields = [
  { id: "username", name: "username", placeholder: "아이디", type: "text", roundedClass: "rounded-t-[20px] rounded-b-none border-b-0" },
  { id: "name",     name: "name",     placeholder: "이름",   type: "text", roundedClass: "rounded-none border-b-0" },
  { id: "email",    name: "email",    placeholder: "이메일", type: "email", roundedClass: "rounded-none border-b-0" },
  { id: "password", name: "password", placeholder: "비밀번호", type: "password", roundedClass: "rounded-b-[20px] rounded-t-none" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "회원가입에 실패했습니다.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
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
        <h1 className="mb-[121px] text-center">
          <img src={solefn} alt="SOLEFN 로고" className="logo-image" />
        </h1>

        <Card className="w-full rounded-[20px] border border-black bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center px-[64px] pt-[41px] pb-[44px]">
            <form className="flex w-full max-w-[489px] flex-col" onSubmit={handleSubmit}>
              <fieldset className="flex flex-col">
                {fields.map((field) => (
                  <Input
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className={`h-[93px] border-black px-[20px] font-['Montserrat',Helvetica] text-2xl font-normal tracking-[0] text-black placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 ${field.roundedClass}`}
                  />
                ))}
              </fieldset>

              {error && (
                <p className="mt-3 text-sm text-red-500">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-[14px] h-auto min-h-[91px] w-full rounded-[14px] bg-[#d9d9d9] py-5 font-['Montserrat',Helvetica] text-[40px] font-normal leading-normal tracking-[0] text-black hover:bg-[#d9d9d9]"
              >
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <nav className="mt-[69px]">
          <p className="font-['Montserrat',Helvetica] text-2xl font-normal text-[#7b7b7b]">
            이미 계정이 있으신가요?{" "}
            <a href="/login" className="text-black hover:underline">로그인</a>
          </p>
        </nav>
      </section>
    </main>
  );
}
