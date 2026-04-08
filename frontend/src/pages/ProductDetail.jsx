import React, { useState } from 'react';
import Header from '../components/Footer';
import Footer from '../components/Header';
import '../assets/css/ProductDetail.css';
import CategoryPanel from '../components/CategoryPanel';
import AlarmPanel from '../components/AlarmPanel';

export default function ProductDetail() {
  const [activeTab, setActiveTab] = useState('spec');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);

  return (
    <>
      <Header
        onCategoryClick={() => setIsCategoryOpen(true)}
        onAlarmClick={() => setIsAlarmOpen(true)}
      />
      <CategoryPanel isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
      <AlarmPanel isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />

      <main className="container">
        <section>
          <main className="product-detail-container">
            <section className="product-top">
              <div className="product-image">
                <img src="./image/Air.png" alt="상품 이미지" />
              </div>
              <div className="price-comparison">
                <div className="price-header">
                  <span className="price-label">최저가</span>
                  <span className="price-value">47,348원</span>
                  <button className="btn-buy">최저가 구매하기</button>
                </div>

                <table className="mall-list">
                  <thead>
                    <tr>
                      <th colSpan="2">쇼핑몰별 최저가</th>
                      <th>배송비 포함 <div className="toggle-switch"></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="highlight">
                      <td>SSG.COM</td> {/* 로고 이미지 파일 */}
                      <td className="mall-price">최저가 47,348원</td>
                      <td>무료배송</td>
                    </tr>
                    <tr>
                      <td>CJ 온스타일</td> {/* 로고 이미지 파일 */}
                      <td className="mall-price">49,840원</td>
                      <td>무료배송</td>
                    </tr>
                    <tr>
                      <td>롯데홈쇼핑</td> {/* 로고 이미지 파일 */}
                      <td className="mall-price">55,540원</td>
                      <td>무료배송 <small>최대 10개월</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 그래프 영역 */}

            <div className="action-section">
              <button className="btn-notify">
                <i className="fa-regular fa-bell"></i> 원하는 가격에 알림 받기
              </button>
            </div>

            <nav className="product-tabs">
              <ul>
                <li className={activeTab === 'spec' ? 'active' : ''}>
                  <a href="#spec-section" onClick={() => setActiveTab('spec')}>상품 상세정보</a>
                </li>
                <li className={activeTab === 'review' ? 'active' : ''}>
                  <a href="#review-section" onClick={() => setActiveTab('review')}>의견/리뷰 <span>1,235</span></a>
                </li>
                <li className={activeTab === 'related' ? 'active' : ''}>
                  <a href="#related-section" onClick={() => setActiveTab('related')}>연관상품</a>
                </li>
              </ul>
            </nav>

            <main className="product-detail-container">
              <section id="spec-section" className="product-spec-section">
                <div className="spec-title-bar">
                  <h2>상품 상세정보</h2>
                </div>
                <table className="spec-table">
                  <colgroup>
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '35%' }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th scope="row">제조회사</th>
                      <td>나이키 (제조사 웹사이트 바로가기)</td>
                      <th scope="row">등록년월</th>
                      <td>2020년 12월</td>
                    </tr>
                    <tr>
                      <th scope="row">분류</th>
                      <td><a href="#" className="link-text">운동화</a></td>
                      <th scope="row">사용자</th>
                      <td>남성용(M)</td>
                    </tr>
                    <tr>
                      <th scope="row">탑라인 형태</th>
                      <td>로우탑</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="spec-category">
                      <td colSpan="4">색상</td>
                    </tr>
                    <tr>
                      <th scope="row">화이트</th>
                      <td>○</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="spec-category">
                      <td colSpan="4" className="cert-title">
                        <span className="cert-icon">KC</span> 인증
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">적합성평가인증</th>
                      <td>상세설명 / 판매 사이트 문의 <button className="btn-cert">인증번호 확인</button></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <th scope="row">안전확인인증</th>
                      <td>상세설명 / 판매 사이트 문의 <button className="btn-cert">인증번호 확인</button></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section id="review-section" className="review-section">
                <div className="spec-title-bar">
                  <h2>의견/리뷰</h2>
                </div>
                <div className="review-notice">
                  <span><i className="fa-solid fa-thumbtack"></i> 알림판</span>
                  <p>[필독] [주의사항] 상품의견 서비스 이용시 유의해 주세요.</p>
                </div>

                <div className="review-summary">
                  <div className="rating-total">
                    <div className="stars">★★★★★</div>
                    <div className="score"><strong>4.8</strong>점 (746)</div>
                    <ul className="rating-bars">
                      <li>5점 <div className="bar-bg"><div className="bar-fill" style={{ width: '90%' }}></div></div> 90%</li>
                      <li>4점 <div className="bar-bg"><div className="bar-fill" style={{ width: '8%' }}></div></div> 8%</li>
                      <li>3점 <div className="bar-bg"><div className="bar-fill" style={{ width: '2%' }}></div></div> 2%</li>
                      <li>2점 <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div> 0%</li>
                      <li>1점 <div className="bar-bg"><div className="bar-fill" style={{ width: '0%' }}></div></div> 0%</li>
                    </ul>
                  </div>

                  <div className="photo-review-grid">
                    <div className="photo-item"><img src="thumb1.jpg" alt="" /></div>
                    <div className="photo-item"><img src="thumb2.jpg" alt="" /></div>
                    <div className="photo-item"><img src="thumb3.jpg" alt="" /></div>
                    <div className="photo-item"><img src="thumb4.jpg" alt="" /></div>
                    <div className="photo-item"><img src="thumb5.jpg" alt="" /></div>
                    <div className="photo-item"><img src="thumb6.jpg" alt="" /></div>
                    <div className="photo-item more">94+</div>
                  </div>
                </div>

                <div className="review-filter">
                  <div className="filter-left">
                    <span className="active">✔ 유용한 리뷰순</span>
                    <span>최신순</span>
                    <span><i className="fa-regular fa-image"></i> 포토 리뷰만 보기</span>
                  </div>
                </div>

                <article className="review-item">
                  <div className="review-item-header">
                    <span className="stars-sm">★★★★★</span>
                    <span className="mall-tag">CJ 온스타일</span>
                    <span className="date">2024.10.15.</span>
                    <span className="user-id">******</span>
                  </div>
                  <div className="review-content-wrapper">
                    <div className="review-text">
                      <h4 className="review-title">고3 아들이 워낙에 좋아하는 운동화라서 또 구입하고 또 구입</h4>
                      <p>고3 아들이 워낙에 좋아하는 운동화라서 또 구입하고 또 구입하고 몇번째 구입하고 있는지 모르겠어요^^ 워낙 아이들 사이에서 유명한 운동화다 보니 계속해서 구입하게 되고 교복에도 잘 어울리고 청바지나 일상복에도 잘 어울려서 하나 장만해 놓으면 괜찮은 것 같아요...</p>
                      <button className="btn-more">펼쳐보기 ∨</button>
                    </div>
                    <div className="review-img-single">
                      <img src="review_img1.jpg" alt="리뷰이미지" />
                    </div>
                  </div>
                </article>

                <article className="review-item">
                  <div className="review-item-header">
                    <span className="stars-sm">★★★★★</span>
                    <span className="mall-tag">롯데홈쇼핑</span>
                    <span className="date">2025.11.08.</span>
                    <span className="user-id">tt***</span>
                  </div>
                  <div className="review-text">
                    <h4 className="review-title">아이가 성장기라 사이즈 고민 많았는데 다행히 잘 맞...</h4>
                    <p>아이가 성장기라 사이즈 고민 많았는데 다행히 잘 맞다고 해요 ㅎㅎ 발볼 10cm 발길이 25cm라 260이 사실상 지금 잘 맞을 것 같긴 했는데 하도 쑥쑥 자라서 265 했더니 발볼은 딱 좋고 발길이는 살짝 크지만 벗겨져서 못 신을 정도는 아니라 만족합니다...</p>
                  </div>
                </article>
              </section>

              <section id="related-section" className="related-products-section">
                <div className="spec-title-bar">
                  <h2>연관상품</h2>
                </div>
                <div className="related-header">
                  <h3>나이키 에어포스1 색상 비교</h3>
                  <div className="related-controls">
                    <div className="dropdown-option">옵션: 나이키 에어포스 1 '07 <i className="fa-solid fa-chevron-down"></i></div>
                    <div className="pagination">
                      <span className="page-num">1/1</span>
                      <button className="btn-page"><i className="fa-solid fa-chevron-left"></i></button>
                      <button className="btn-page"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                  </div>
                </div>

                <table className="compare-table">
                  <thead>
                    <tr>
                      <th className="row-label">상품(4)</th>
                      <th className="current-item">
                        <div className="view-tag">내가 보는 상품</div>
                        <div className="compare-img"><img src="af1_white.jpg" alt="" /></div>
                        <p className="compare-name">나이키 나이키 에어포스 1 '07 CW2288-111(공식판매처)</p>
                      </th>
                      <th>
                        <div className="compare-img"><img src="af1_black.jpg" alt="" /></div>
                        <p className="compare-name">나이키 나이키 에어포스 1 '07 CW2288-001(공식판매처)</p>
                      </th>
                      <th>
                        <div className="compare-img"><img src="af1_white2.jpg" alt="" /></div>
                        <p className="compare-name">나이키 나이키 에어포스 1 '07 DD8959-100(공식판매처)</p>
                      </th>
                      <th>
                        <div className="compare-img"><img src="af1_black2.jpg" alt="" /></div>
                        <p className="compare-name">나이키 나이키 에어포스 1 '07 DD8959-001(공식판매처)</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="row-label">평점</th>
                      <td><span className="star-orange">★</span> 4.9 (746)</td>
                      <td><span className="star-orange">★</span> 5 (147)</td>
                      <td><span className="star-orange">★</span> 4.9 (145)</td>
                      <td><span className="star-orange">★</span> 4.9 (106)</td>
                    </tr>
                    <tr>
                      <th className="row-label">최저가</th>
                      <td className="price-blue">149,000원</td>
                      <td className="price-blue">135,590원</td>
                      <td className="price-blue">149,000원</td>
                      <td className="price-blue">119,740원</td>
                    </tr>
                    <tr>
                      <th className="row-label">가격차</th>
                      <td className="diff">-</td>
                      <td className="diff-red">-13,410</td>
                      <td className="diff">-</td>
                      <td className="diff-red">-29,260</td>
                    </tr>
                    <tr>
                      <th className="row-label">등록년월</th>
                      <td>2023.01.20.</td>
                      <td>2024.07.04.</td>
                      <td>2024.07.01.</td>
                      <td>2024.07.05.</td>
                    </tr>
                    <tr>
                      <th className="row-label">색상</th>
                      <td>화이트</td>
                      <td>블랙</td>
                      <td>화이트</td>
                      <td>블랙</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>

            <section className="recommend-section">
              <h3>이런 상품 어때요?</h3>
              <div className="recommend-grid">
                <div className="recommend-item">
                  <div className="item-img"></div>
                  <p className="item-name">[스니커즈] 뉴발란스...</p>
                  <p className="item-price">107,100원</p>
                </div>
                <div className="recommend-item">
                  <div className="item-img"></div>
                  <p className="item-name">아식스 젤 1130...</p>
                  <p className="item-price">115,000원</p>
                </div>
              </div>
            </section>
          </main>
        </section>
      </main>

      <Footer />
    </>
  );
}