const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: '검색어를 입력해주세요' });
  }

  try {
    const response = await axios.get(
      'https://openapi.naver.com/v1/search/shop.json',
      {
        params: {
          query: `${query} 신발`,
          display: 100,  // ✅ 많이 가져와서 필터링 후 20개 추림
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
      .slice(0, 20)  // 최대 20개만
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
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: '네이버 API 호출 실패' });
  }
});

module.exports = router;