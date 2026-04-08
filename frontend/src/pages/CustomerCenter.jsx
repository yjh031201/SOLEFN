import React from "react";
import "../assets/css/CustomerCenter.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import CategoryPanel from "../components/CategoryPanel";
import AlarmPanel from "../components/AlarmPanel";

export default function CustomerCenter() {

  const menus = [
    {
      title: "공지사항",
      items: []
    },
    {
      title: "자주 묻는 질문",
      items: []
    }
  ];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  return (
    <div className="container">
      {/* 헤더 */}
      <Header
        onCategoryClick={() => setIsCategoryOpen(true)}
        onAlarmClick={() => setIsAlarmOpen(true)}
      />
      <CategoryPanel isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <AlarmPanel isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />


      <div className="content">
        {/* 좌측 메뉴 */}
        <Sidebar title="고객센터" menus={menus} link="/customer" />

        {/* 메인 영역 */}
        <main className="main">

          {/* 공지사항 내용 */}
          <section className="notice">
            <h2>공지사항</h2>
          </section>

          <section className="contents">
            <h2>이벤트</h2>
            <p> Kream draw 3월 3주차 서비스  웰컴 드로우 신규회원</p>
          </section>

          <section className="contents">
            <h2>이벤트</h2>
            <p> Kream draw 3월 3주차 서비스  웰컴 드로우 신규회원</p>
          </section>

          <section className="contents">
            <h2>공지</h2>
            <p> Kream draw 3월 3주차 서비스  웰컴 드로우 신규회원</p>
          </section>

          <section className="contents">
            <h2>공지</h2>
            <p> Kream draw 3월 3주차 서비스  웰컴 드로우 신규회원</p>
          </section>



        </main>
      </div>

      {/* 푸터 */}

      <Footer />
    </div>
  );
}


