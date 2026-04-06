import "../assets/css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">FIND SHOES</div>
        <div className="footer-links">
          <span>회사소개</span>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>고객센터</span>
        </div>
        <p className="footer-copy">© 2026 FIND SHOES. All rights reserved.</p>
      </div>
    </footer>
  );
}