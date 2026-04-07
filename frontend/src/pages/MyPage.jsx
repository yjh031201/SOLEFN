import React from "react";
import "../assets/css/MyPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MyPage() {
  return (
    <div className="container">
      <Header showNav={false} />

      <div className="content">
        {/* 좌측 메뉴 */}
        <Sidebar/>

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


