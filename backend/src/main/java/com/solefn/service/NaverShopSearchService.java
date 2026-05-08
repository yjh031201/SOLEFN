package com.solefn.service;

import com.solefn.dto.ColorVariant;
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

    // 브랜드별 상품 코드 패턴 (우선순위 순서대로 시도)
    private static final Pattern[] MODEL_CODE_PATTERNS = {
        // Nike / Adidas / New Balance (다중 알파벳): 2~4 대문자 + 3~5 숫자
        // 뒤의 색상코드(-111, -001 등) 의도적으로 제외
        Pattern.compile("[A-Z]{2,4}[-_]?\\d{3,5}"),
        // ASICS: 숫자 4개 + 알파벳 1개 + 숫자 3개 (예: 1011B004, 1011B548)
        Pattern.compile("\\d{4}[A-Z]\\d{3}"),
        // Puma: 숫자 6개 연속 (예: 374915 from 374915-01)
        Pattern.compile("\\d{6}"),
        // Converse / New Balance 단일 알파벳 긴 코드: 알파벳 1개 + 숫자 4~5개 (예: M9160)
        Pattern.compile("[A-Z]\\d{4,5}"),
        // New Balance 단일 알파벳 짧은 코드: 알파벳 1개 + 숫자 3개 (예: U990)
        Pattern.compile("[A-Z]\\d{3}"),
        // Vans: VN 접두사 + 영숫자 6자 (예: VN0A38G1 from VN0A38G1NWD)
        Pattern.compile("VN[0-9A-Z]{6}"),
    };

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

    private static final Map<String, String> COLOR_MAP = Map.ofEntries(
            Map.entry("화이트", "화이트"),
            Map.entry("white", "화이트"),
            Map.entry("흰색", "화이트"),
            Map.entry("블랙", "블랙"),
            Map.entry("black", "블랙"),
            Map.entry("검정", "블랙"),
            Map.entry("레드", "레드"),
            Map.entry("red", "레드"),
            Map.entry("빨강", "레드"),
            Map.entry("블루", "블루"),
            Map.entry("blue", "블루"),
            Map.entry("파랑", "블루"),
            Map.entry("그린", "그린"),
            Map.entry("green", "그린"),
            Map.entry("초록", "그린"),
            Map.entry("옐로우", "옐로우"),
            Map.entry("yellow", "옐로우"),
            Map.entry("노랑", "옐로우"),
            Map.entry("브라운", "브라운"),
            Map.entry("brown", "브라운"),
            Map.entry("핑크", "핑크"),
            Map.entry("pink", "핑크"),
            Map.entry("그레이", "그레이"),
            Map.entry("grey", "그레이"),
            Map.entry("gray", "그레이"),
            Map.entry("회색", "그레이"),
            Map.entry("네이비", "네이비"),
            Map.entry("navy", "네이비"),
            Map.entry("베이지", "베이지"),
            Map.entry("beige", "베이지"),
            Map.entry("오렌지", "오렌지"),
            Map.entry("orange", "오렌지"),
            Map.entry("퍼플", "퍼플"),
            Map.entry("purple", "퍼플"),
            Map.entry("보라", "퍼플"),
            Map.entry("실버", "실버"),
            Map.entry("silver", "실버"),
            Map.entry("골드", "골드"),
            Map.entry("gold", "골드")
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

        // 브랜드 + 모델코드 기준으로 1차 그룹핑
        Map<String, List<NaverItem>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(this::makeGroupKey));

        // 각 그룹을 GroupedShoeItem으로 변환 (내부에서 색상별 서브그룹핑)
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
        String cleaned = title.replaceAll("<[^>]*>", "").toUpperCase();
        for (Pattern pattern : MODEL_CODE_PATTERNS) {
            Matcher m = pattern.matcher(cleaned);
            if (m.find()) return m.group();
        }
        return null;
    }

    private String extractColor(String title) {
        String cleaned = title.replaceAll("<[^>]*>", "").toLowerCase();
        for (Map.Entry<String, String> entry : COLOR_MAP.entrySet()) {
            if (cleaned.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "기타";
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
        return "SINGLE|" + item.productId();
    }

    private GroupedShoeItem toGroupedItem(List<NaverItem> items) {
        // 색상별 서브그룹핑
        Map<String, List<NaverItem>> byColor = items.stream()
                .collect(Collectors.groupingBy(i -> extractColor(i.title())));

        // 색상별 ColorVariant 생성, 최저가 오름차순 정렬
        List<ColorVariant> variants = byColor.entrySet().stream()
                .map(e -> toColorVariant(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(v -> parsePriceSafe(v.lowestPrice())))
                .toList();

        // 전체 최저가 기준 대표 아이템 (= 가장 싼 variant의 대표)
        ColorVariant cheapest = variants.get(0);

        // 전체 매장 목록 (모든 색상 통합, 최저가 오름차순)
        List<ShoeItem> allStores = items.stream()
                .map(this::toShoeItem)
                .sorted(Comparator.comparingLong(s -> parsePriceSafe(s.price())))
                .toList();

        NaverItem rep = items.stream()
                .min(Comparator.comparingLong(i -> parsePriceSafe(i.lprice())))
                .orElse(items.get(0));

        String cleanTitle = Objects.requireNonNullElse(rep.title(), "").replaceAll("<[^>]*>", "");
        String normalizedBrand = normalizeBrand(rep.brand(), rep.title());

        return new GroupedShoeItem(
                cheapest.id(),
                cleanTitle,
                cheapest.lowestPrice(),
                cheapest.image(),
                cheapest.link(),
                cheapest.mallName(),
                normalizedBrand,
                rep.category2(),
                rep.category3(),
                allStores.size(),
                allStores,
                variants
        );
    }

    private ColorVariant toColorVariant(String color, List<NaverItem> items) {
        NaverItem rep = items.stream()
                .min(Comparator.comparingLong(i -> parsePriceSafe(i.lprice())))
                .orElse(items.get(0));

        List<ShoeItem> stores = items.stream()
                .map(this::toShoeItem)
                .sorted(Comparator.comparingLong(s -> parsePriceSafe(s.price())))
                .toList();

        return new ColorVariant(
                rep.productId(),
                color,
                rep.lprice(),
                rep.image(),
                rep.link(),
                rep.mallName(),
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
