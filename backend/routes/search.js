const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const query = req.query.q;
  const offset = parseInt(req.query.offset) || 0;  // pagination offset
  const limit = 50;  // 한 번에 50개씩

  if (!query) {
    return res.status(400).json({ error: '검색어를 입력해주세요' });
  }

  try {
    // 네이버 API는 start 파라미터 사용 (1부터 시작)
    // offset을 반영하기 위해 networkOffset을 계산
    const networkStart = (offset / limit) + 1;

    const response = await axios.get(
      'https://openapi.naver.com/v1/search/shop.json',
      {
        params: {
          query: `${query} 신발`,
          display: Math.min(100, limit * 2),  // 필터링을 위해 충분히 가져오기
          start: networkStart,
          sort: 'sim',
        },
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      }
    );

    const filtered = response.data.items
      .filter((item) =>
        item.category1 === '패션잡화' &&
       item.category2.includes('신발')
      )
      .slice(0, limit)
      .map((item) => ({
        id: item.productId,
        title: item.title.replace(/<[^>]*>/g, ''),  // HTML 태그 제거
        price: item.lprice,
        image: item.image,
        link: item.link,
        mallName: item.mallName,
        brand: item.brand,
        category2: item.category2,
        category3: item.category3,
      }));

    res.json({
      total: filtered.length,
      items: filtered,
      hasMore: filtered.length === limit,  // 50개를 다 가져왔으면 더 있을 수 있음
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: '네이버 API 호출 실패' });
  }
});

module.exports = router;