import { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/ProductDetail.css';
import CategoryPanel from '../components/CategoryPanel';
import AlarmPanel from '../components/AlarmPanel';
import PriceChart from '../components/PriceChart';

export default function ProductDetail() {
  const { state: product } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const variants = product?.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState(
    variants.length > 0 ? variants[0] : null
  );

  const [activeTab, setActiveTab] = useState('spec');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('1M');

  const priceDataByPeriod = {
    '1M': [
      { date: '11-01', price: 142000 },
      { date: '11-04', price: 139000 },
      { date: '11-07', price: 138500 },
      { date: '11-10', price: 135000 },
      { date: '11-13', price: 137000 },
      { date: '11-16', price: 132000 },
      { date: '11-19', price: 130000 },
      { date: '11-22', price: 128000 },
      { date: '11-25', price: 131000 },
      { date: '11-28', price: 129000 },
      { date: '12-01', price: 127000 },
      { date: '12-04', price: 127000 },
    ],
    '3M': [
      { date: '09', price: 149000 },
      { date: '10', price: 145000 },
      { date: '11', price: 135000 },
      { date: '12', price: 127000 },
    ],
    '6M': [
      { date: '06', price: 159000 },
      { date: '07', price: 155000 },
      { date: '08', price: 152000 },
      { date: '09', price: 149000 },
      { date: '10', price: 145000 },
      { date: '11', price: 135000 },
      { date: '12', price: 127000 },
    ],
    '1Y': [
      { date: '23.12', price: 168000 },
      { date: '24.02', price: 165000 },
      { date: '24.04', price: 162000 },
      { date: '24.06', price: 159000 },
      { date: '24.08', price: 152000 },
      { date: '24.10', price: 145000 },
      { date: '24.12', price: 127000 },
    ],
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return `${num.toLocaleString('ko-KR')}원`;
  };

  if (!product) {
    return (
      <>
        <Header
          onCategoryClick={() => setIsCategoryOpen(true)}
          onAlarmClick={() => setIsAlarmOpen(true)}
        />
        <CategoryPanel isOpen={isCategoryOpen} onClose={() => setIsCategoryOpen(false)} />
        <AlarmPanel isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />
        <main className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
          <p>상품 정보를 불러올 수 없습니다.</p>
          <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: '8px 24px', cursor: 'pointer' }}>
            뒤로가기
          </button>
        </main>
        <Footer />
      </>
    );
  }

  // 선택된 색상 기준으로 표시할 데이터
  const currentImage = selectedVariant?.image ?? product.image;
  const currentPrice = selectedVariant?.lowestPrice ?? product.price;
  const currentLink = selectedVariant?.link ?? product.link;
  const currentMallName = selectedVariant?.mallName ?? product.mallName;
  const currentStores = selectedVariant?.stores ?? product.stores ?? [];

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
              <div className="product-image-wrapper">
                <div className="product-image">
                  <img src={currentImage} alt={product.title} />
                </div>

                {/* 색상 선택 버튼 - 이미지 아래 */}
                {variants.length > 1 && (
                  <div className="color-selector">
                    {variants.map((variant) => (
                      <button
                        key={variant.color}
                        className={`color-btn${selectedVariant?.color === variant.color ? ' active' : ''}`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.color}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="price-comparison">
                <div className="price-header">
                  <span className="price-label">최저가</span>
                  <span className="price-value">{formatPrice(currentPrice)}</span>
                  <a href={currentLink} target="_blank" rel="noopener noreferrer">
                    <button className="btn-buy">최저가 구매하기</button>
                  </a>
                </div>

                <table className="mall-list">
                  <thead>
                    <tr>
                      <th colSpan="2">쇼핑몰별 최저가</th>
                      <th>배송비 포함 <div className="toggle-switch"></div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStores.length > 0 ? currentStores.map((store, idx) => (
                      <tr key={store.id} className={idx === 0 ? 'highlight' : ''}>
                        <td>{store.mallName}</td>
                        <td className="mall-price">
                          {idx === 0 ? '최저가 ' : ''}{formatPrice(store.price)}
                        </td>
                        <td>
                          <a href={store.link} target="_blank" rel="noopener noreferrer">
                            구매하기
                          </a>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td>{currentMallName}</td>
                        <td className="mall-price">최저가 {formatPrice(currentPrice)}</td>
                        <td>
                          <a href={currentLink} target="_blank" rel="noopener noreferrer">
                            구매하기
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 그래프 영역 */}
            <section className="price-chart-section">
              <h3>가격 추이</h3>
              <div className="chart-period-tabs">
                {['1M', '3M', '6M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className={chartPeriod === period ? 'active' : ''}
                    onClick={() => setChartPeriod(period)}
                  >
                    {period === '1M' ? '1개월'
                      : period === '3M' ? '3개월'
                        : period === '6M' ? '6개월'
                          : '1년'}
                  </button>
                ))}
              </div>
              <PriceChart
                key={chartPeriod}
                data={priceDataByPeriod[chartPeriod]}
                currentPrice={Number(currentPrice)}
              />
            </section>

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
                      <th scope="row">브랜드</th>
                      <td>{product.brand || '-'}</td>
                      <th scope="row">판매처 수</th>
                      <td>{product.storeCount ?? currentStores.length}개</td>
                    </tr>
                    <tr>
                      <th scope="row">분류</th>
                      <td>{product.category2 || '-'}</td>
                      <th scope="row">세부 분류</th>
                      <td>{product.category3 || '-'}</td>
                    </tr>
                    {variants.length > 0 && (
                      <tr>
                        <th scope="row">색상</th>
                        <td colSpan="3">{variants.map(v => v.color).join(', ')}</td>
                      </tr>
                    )}
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
                  </div>
                </article>
              </section>

              <section id="related-section" className="related-products-section">
                <div className="spec-title-bar">
                  <h2>연관상품</h2>
                </div>
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
