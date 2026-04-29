import { Button } from "../components/LoginUi/Button";
import { Card, CardContent } from "../components/LoginUi/Card";
import { Checkbox } from "../components/LoginUi/CheckBox";
import { Input } from "../components/LoginUi/Input";
import solefn from "../assets/images/SOLEFN.png";
const formFields = [
  {
    id: "login-id",
    name: "login-id",
    placeholder: "아이디 또는 전화번호",
    type: "text",
    roundedClass: "rounded-t-[20px] rounded-b-none border-b-0",
  },
  {
    id: "login-password",
    name: "login-password",
    placeholder: "비밀번호",
    type: "password",
    roundedClass: "rounded-b-[20px] rounded-t-none",
  },
];

const footerLinks = [
  { label: "비밀번호 찾기", href: "#" },
  { label: "아이디 찾기", href: "#" },
  { label: "회원가입", href: "#" },
];

export default function Login() {
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
              action="#"
              method="post"
            >
              <fieldset className="flex flex-col">
                {formFields.map((field) => (
                  <Input
                    key={field.id}
                    id={field.id}
                    name={field.name}
                    type={field.type}
                    defaultValue=""
                    placeholder={field.placeholder}
                    className={`h-[93px] border-black px-[20px] font-['Montserrat',Helvetica] text-2xl font-normal tracking-[0] text-black placeholder:text-black focus-visible:ring-0 focus-visible:ring-offset-0 ${field.roundedClass}`}
                  />
                ))}
              </fieldset>

              <label
                htmlFor="keep-login"
                className="mt-[14px] flex w-fit cursor-pointer items-center gap-3"
              >
                <Checkbox
                  id="keep-login"
                  className="h-5 w-5 rounded-[4px] border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                />
                <span className="font-['Montserrat',Helvetica] text-2xl font-normal leading-normal tracking-[0] text-black">
                  로그인 상태 유지
                </span>
              </label>

              <Button
                type="submit"
                className="mt-[14px] h-auto min-h-[91px] w-full rounded-[14px] bg-[#d9d9d9] py-5 font-['Montserrat',Helvetica] text-[40px] font-normal leading-normal tracking-[0] text-black hover:bg-[#d9d9d9]"
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>

        <nav aria-label="계정 관련 링크" className="mt-[69px]">
          <ul className="flex items-center justify-center font-['Montserrat',Helvetica] text-2xl font-normal leading-normal tracking-[0] text-[#7b7b7b]">
            {footerLinks.map((link, index) => (
              <li key={link.label} className="flex items-center">
                <a
                  href={link.href}
                  className="px-[37px] transition-opacity hover:opacity-80"
                >
                  {link.label}
                </a>
                {index < footerLinks.length - 1 && (
                  <span aria-hidden="true" className="text-[#7b7b7b]">
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
