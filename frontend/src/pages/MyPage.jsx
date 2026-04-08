import React from "react";
import "../assets/css/MyPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import CategoryPanel from "../components/CategoryPanel";
import AlarmPanel from "../components/AlarmPanel";

export default function MyPage() {

  const menus = [
    {
      title: "쇼핑 정보",
      items: ["최근 본 상품", "관심 상품"]
    },
    {
      title: "내 정보",
      items: ["로그인 정보", "프로필 정보"]
    }
  ];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  return (
    <div className="container">
      <Header
        showNav={false}
        onCategoryClick={() => setIsCategoryOpen(true)}
        onAlarmClick={() => setIsAlarmOpen(true)}
      />
      <CategoryPanel isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <AlarmPanel isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />

      <div className="content">
        {/* 좌측 메뉴 */}
        <Sidebar title="마이페이지" menus={menus} />

        {/* 메인 영역 */}
        <main className="main">
          {/* 사용자 정보 */}

          <div className="user-box">
            <div className="left-group">
              <div className="user-profile">

              </div>
              <div className="user-info">
                <strong>홍길동</strong>
                <p>example@email.com</p>
              </div>

            </div>
            <div className="user-bottons">
              <button>프로필 관리</button>
              <button>내 스타일</button>
            </div>
          </div>

          {/* 최근 본 상품 */}
          <section className="section">
            <h3>최근 본 상품</h3>

            <div className="item">

              <div>
                <p>Apple 2022 MacBook Air</p>
                <span>100원</span>
              </div>
            </div>

            <div className="item">

              <div>
                <p>Louis Vuitton Belt</p>
                <span>100원</span>
              </div>
            </div>

            <div className="item">

              <div>
                <p>Adidas Sneakers</p>
                <span>100원</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}


