package com.solefn.service;

import com.solefn.dto.NaverSearchApiResponse;
import com.solefn.dto.NaverSearchApiResponse.NaverItem;
import com.solefn.dto.SearchResponse;
import com.solefn.dto.ShoeItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
public class NaverShopSearchService {

    private static final String NAVER_SHOP_API_URL = "https://openapi.naver.com/v1/search/shop.json";
    private static final int LIMIT = 50;

    private final RestTemplate restTemplate;
    private final String clientId;
    private final String clientSecret;

    public NaverShopSearchService(
            RestTemplate restTemplate,
            @Value("${naver.client-id}") String clientId,
            @Value("${naver.client-secret}") String clientSecret
    ) {
        this.restTemplate = restTemplate;
        this.clientId = clientId == null ? "" : clientId.trim();
        this.clientSecret = clientSecret == null ? "" : clientSecret.trim();
    }

    public SearchResponse search(String query, int offset) {
        // 네이버 API는 start 파라미터 사용 (1부터 시작)
        int networkStart = (offset / LIMIT) + 1;

        URI uri = UriComponentsBuilder.fromHttpUrl(NAVER_SHOP_API_URL)
                .queryParam("query", query + " 신발")
                .queryParam("display", Math.min(100, LIMIT * 2))
                .queryParam("start", networkStart)
                .queryParam("sort", "sim")
                .encode()
                .build()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        ResponseEntity<NaverSearchApiResponse> response = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                NaverSearchApiResponse.class
        );

        NaverSearchApiResponse body = response.getBody();
        List<NaverItem> rawItems = (body == null || body.items() == null)
                ? Collections.emptyList()
                : body.items();

        List<ShoeItem> filtered = rawItems.stream()
                .filter(item -> "패션잡화".equals(item.category1())
                        && item.category2() != null
                        && item.category2().contains("신발"))
                .limit(LIMIT)
                .map(this::toShoeItem)
                .toList();

        return new SearchResponse(
                filtered.size(),
                filtered,
                filtered.size() == LIMIT  // 50개를 다 가져왔으면 더 있을 수 있음
        );
    }

    private ShoeItem toShoeItem(NaverItem item) {
        return new ShoeItem(
                item.productId(),
                Objects.requireNonNullElse(item.title(), "").replaceAll("<[^>]*>", ""),  // HTML 태그 제거
                item.lprice(),
                item.image(),
                item.link(),
                item.mallName(),
                item.brand(),
                item.category2(),
                item.category3()
        );
    }
}
