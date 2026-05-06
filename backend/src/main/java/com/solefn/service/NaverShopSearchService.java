package com.solefn.service;

import com.solefn.dto.GroupedShoeItem;
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
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class NaverShopSearchService {

    private static final Pattern MODEL_CODE_PATTERN =
            Pattern.compile("[A-Z]{2,4}[-_]?\\d{3,5}[-_]?\\d{0,4}");

    private static final Map<String, String> BRAND_MAP = Map.ofEntries(
            Map.entry("나이키", "NIKE"),
            Map.entry("nike", "NIKE"),
            Map.entry("아디다스", "ADIDAS"),
            Map.entry("adidas", "ADIDAS"),
            Map.entry("뉴발란스", "NEWBALANCE"),
            Map.entry("newbalance", "NEWBALANCE"),
            Map.entry("new balance", "NEWBALANCE"),
            Map.entry("아식스", "ASICS"),
            Map.entry("asics", "ASICS"),
            Map.entry("컨버스", "CONVERSE"),
            Map.entry("converse", "CONVERSE"),
            Map.entry("반스", "VANS"),
            Map.entry("vans", "VANS"),
            Map.entry("푸마", "PUMA"),
            Map.entry("puma", "PUMA")
    );

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

        List<NaverItem> filtered = rawItems.stream()
                .filter(item -> "패션잡화".equals(item.category1())
                        && item.category2() != null
                        && item.category2().contains("신발"))
                .toList();

        // 브랜드 + 모델코드 기준으로 그룹핑
        Map<String, List<NaverItem>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(this::makeGroupKey));

        // 각 그룹을 GroupedShoeItem으로 변환 후 최저가 오름차순 정렬
        List<GroupedShoeItem> result = grouped.entrySet().stream()
                .map(entry -> toGroupedItem(entry.getValue()))
                .sorted(Comparator.comparingLong(g -> parsePriceSafe(g.price())))
                .limit(LIMIT)
                .toList();

        return new SearchResponse(
                result.size(),
                result,
                filtered.size() > LIMIT
        );
    }

    private String extractModelCode(String title) {
        String cleaned = title.replaceAll("<[^>]*>", "");
        Matcher m = MODEL_CODE_PATTERN.matcher(cleaned.toUpperCase());
        return m.find() ? m.group() : null;
    }

    private String normalizeBrand(String brand, String title) {
        String source = (brand != null && !brand.isBlank())
                ? brand.toLowerCase()
                : title.toLowerCase();

        for (Map.Entry<String, String> entry : BRAND_MAP.entrySet()) {
            if (source.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return brand != null && !brand.isBlank() ? brand.toUpperCase() : "UNKNOWN";
    }

    private String makeGroupKey(NaverItem item) {
        String brand = normalizeBrand(item.brand(), item.title());
        String modelCode = extractModelCode(item.title());

        if (modelCode != null) {
            return brand + "|" + modelCode;
        }
        // 모델코드를 추출할 수 없는 경우 단독 상품으로 처리
        return "SINGLE|" + item.productId();
    }

    private GroupedShoeItem toGroupedItem(List<NaverItem> items) {
        // 최저가 기준 대표 아이템 선정
        NaverItem rep = items.stream()
                .min(Comparator.comparingLong(i -> parsePriceSafe(i.lprice())))
                .orElse(items.get(0));

        String cleanTitle = Objects.requireNonNullElse(rep.title(), "").replaceAll("<[^>]*>", "");
        String normalizedBrand = normalizeBrand(rep.brand(), rep.title());

        // stores 목록은 최저가 오름차순 정렬
        List<ShoeItem> stores = items.stream()
                .map(this::toShoeItem)
                .sorted(Comparator.comparingLong(s -> parsePriceSafe(s.price())))
                .toList();

        return new GroupedShoeItem(
                rep.productId(),
                cleanTitle,
                rep.lprice(),
                rep.image(),
                rep.link(),
                rep.mallName(),
                normalizedBrand,
                rep.category2(),
                rep.category3(),
                stores.size(),
                stores
        );
    }

    private ShoeItem toShoeItem(NaverItem item) {
        return new ShoeItem(
                item.productId(),
                Objects.requireNonNullElse(item.title(), "").replaceAll("<[^>]*>", ""),
                item.lprice(),
                item.image(),
                item.link(),
                item.mallName(),
                item.brand(),
                item.category2(),
                item.category3()
        );
    }

    private long parsePriceSafe(String price) {
        try {
            return Long.parseLong(price);
        } catch (NumberFormatException e) {
            return Long.MAX_VALUE;
        }
    }
}
