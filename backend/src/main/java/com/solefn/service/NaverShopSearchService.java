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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
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
        // Nike / Adidas / New Balance (다중 알파벳): 2~4 대문자 + 3~5 숫자 (색상코드 제외)
        Pattern.compile("[A-Z]{2,4}[-_]?\\d{3,5}"),
        // ASICS: 숫자 4개 + 알파벳 1개 + 숫자 3개 (예: 1011B004, 1011B548)
        Pattern.compile("\\d{4}[A-Z]\\d{3}"),
        // Puma: 정확히 6자리 숫자 (앞뒤에 다른 숫자 없어야 함 → 가격·날짜 오매칭 방지)
        Pattern.compile("(?<!\\d)\\d{6}(?!\\d)"),
        // Converse / NB 단일 알파벳 긴 코드: 알파벳 1개 + 숫자 4~5개 (예: M9160)
        Pattern.compile("[A-Z]\\d{4,5}"),
        // New Balance 단일 알파벳 짧은 코드: M/W/U 접두사 한정 + 숫자 3자리
        // (기존 [A-Z]\d{3}에서 NB 전용 접두사로 한정해 오매칭 방지)
        Pattern.compile("(?<![A-Z0-9])[MWU]\\d{3}"),
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
            // 화이트 계열
            Map.entry("화이트", "화이트"),
            Map.entry("white", "화이트"),
            Map.entry("흰색", "화이트"),
            Map.entry("아이보리", "아이보리"),
            Map.entry("ivory", "아이보리"),
            Map.entry("크림", "크림"),
            Map.entry("cream", "크림"),
            Map.entry("에크루", "크림"),
            Map.entry("ecru", "크림"),
            // 블랙 계열
            Map.entry("블랙", "블랙"),
            Map.entry("black", "블랙"),
            Map.entry("검정", "블랙"),
            Map.entry("차콜", "차콜"),
            Map.entry("charcoal", "차콜"),
            // 그레이 계열
            Map.entry("그레이", "그레이"),
            Map.entry("grey", "그레이"),
            Map.entry("gray", "그레이"),
            Map.entry("회색", "그레이"),
            // 레드 계열
            Map.entry("레드", "레드"),
            Map.entry("red", "레드"),
            Map.entry("빨강", "레드"),
            Map.entry("와인", "와인"),
            Map.entry("wine", "와인"),
            Map.entry("버건디", "버건디"),
            Map.entry("burgundy", "버건디"),
            Map.entry("러스트", "러스트"),
            Map.entry("rust", "러스트"),
            // 블루 계열
            Map.entry("블루", "블루"),
            Map.entry("blue", "블루"),
            Map.entry("파랑", "블루"),
            Map.entry("네이비", "네이비"),
            Map.entry("navy", "네이비"),
            Map.entry("코발트", "코발트"),
            Map.entry("cobalt", "코발트"),
            Map.entry("스카이", "스카이블루"),
            Map.entry("sky", "스카이블루"),
            // 그린 계열
            Map.entry("그린", "그린"),
            Map.entry("green", "그린"),
            Map.entry("초록", "그린"),
            Map.entry("카키", "카키"),
            Map.entry("khaki", "카키"),
            Map.entry("kaki", "카키"),
            Map.entry("올리브", "올리브"),
            Map.entry("olive", "올리브"),
            Map.entry("민트", "민트"),
            Map.entry("mint", "민트"),
            Map.entry("라임", "라임"),
            Map.entry("lime", "라임"),
            Map.entry("연두", "라임"),
            // 옐로우 계열
            Map.entry("옐로우", "옐로우"),
            Map.entry("yellow", "옐로우"),
            Map.entry("노랑", "옐로우"),
            Map.entry("레몬", "옐로우"),
            Map.entry("lemon", "옐로우"),
            // 브라운 계열
            Map.entry("브라운", "브라운"),
            Map.entry("brown", "브라운"),
            Map.entry("탄", "탄"),
            Map.entry("tan", "탄"),
            Map.entry("샌드", "샌드"),
            Map.entry("sand", "샌드"),
            Map.entry("베이지", "베이지"),
            Map.entry("beige", "베이지"),
            Map.entry("카멜", "카멜"),
            Map.entry("camel", "카멜"),
            // 핑크 계열
            Map.entry("핑크", "핑크"),
            Map.entry("pink", "핑크"),
            Map.entry("로즈", "핑크"),
            Map.entry("rose", "핑크"),
            // 퍼플 계열
            Map.entry("퍼플", "퍼플"),
            Map.entry("purple", "퍼플"),
            Map.entry("보라", "퍼플"),
            Map.entry("라벤더", "라벤더"),
            Map.entry("lavender", "라벤더"),
            // 오렌지 계열
            Map.entry("오렌지", "오렌지"),
            Map.entry("orange", "오렌지"),
            // 메탈릭 계열
            Map.entry("실버", "실버"),
            Map.entry("silver", "실버"),
            Map.entry("골드", "골드"),
            Map.entry("gold", "골드"),
            // 기타
            Map.entry("멀티", "멀티"),
            Map.entry("multi", "멀티"),
            Map.entry("네온", "네온"),
            Map.entry("neon", "네온"),
            Map.entry("형광", "네온")
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
        int displaySize = Math.min(100, LIMIT * 2);
        // offset=0 → start=1, offset=50 → start=101, offset=100 → start=201
        int networkStart = (offset / LIMIT) * displaySize + 1;

        URI uri = UriComponentsBuilder.fromHttpUrl(NAVER_SHOP_API_URL)
                .queryParam("query", query + " 신발")
                .queryParam("display", displaySize)
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
                        && item.category2().endsWith("신발"))
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
        return null; // 감지 실패
    }

    // 브랜드별 색상 코드 suffix 추출 패턴 (그룹 1 = 색상 코드)
    private static final Pattern[] COLOR_SUFFIX_PATTERNS = {
        // Nike/Adidas: CW2288-111, DH2987 100
        Pattern.compile("[A-Z]{2,4}\\d{3,5}[-\\s](\\d{3})(?!\\d)"),
        // ASICS: 1011B548-100, 1011A987-001
        Pattern.compile("\\d{4}[A-Z]\\d{3}[-\\s](\\d{3})(?!\\d)"),
        // Converse/NB single: M9160-003, W990-GL6 제외하고 순수 숫자 suffix
        Pattern.compile("(?<![A-Z])[A-Z]\\d{4,5}[-\\s](\\d{3})(?!\\d)"),
        // Puma: 374915-01 (2자리 suffix)
        Pattern.compile("(?<!\\d)\\d{6}-(\\d{2})(?!\\d)"),
        // Vans: VN0A38G1NWD → suffix NWD (영문 3자리)
        Pattern.compile("VN[0-9A-Z]{6}([A-Z]{2,3})(?![A-Z0-9])"),
    };

    /**
     * 브랜드별 색상 코드 suffix 추출
     * 예: "CW2288-111" → "111", "1011B548-100" → "100", "VN0A38G1NWD" → "NWD"
     */
    private String extractColorSuffix(String title) {
        String cleaned = title.replaceAll("<[^>]*>", "").toUpperCase();
        for (Pattern p : COLOR_SUFFIX_PATTERNS) {
            Matcher m = p.matcher(cleaned);
            if (m.find()) return m.group(1);
        }
        return null;
    }

    /**
     * 색상 그룹 키 생성
     * - 색상을 감지한 경우: 색상명 (예: "화이트")
     * - 감지 실패 시: "기타_productId" → 다른 색상 상품끼리 잘못 묶이지 않도록 분리
     *   (같은 productId = 동일 네이버 카탈로그 = 실제로 같은 상품 → 하나로 묶임)
     */
    private String makeColorKey(NaverItem item) {
        String color = extractColor(item.title());
        return color != null ? color : "기타_" + item.productId();
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
        // 1차: 색상 키 기준 서브그룹핑
        Map<String, List<NaverItem>> byColor = new HashMap<>(items.stream()
                .collect(Collectors.groupingBy(this::makeColorKey)));

        // 2차: 기타 상품 중 색상 코드 suffix가 감지된 색상 그룹과 일치하면 해당 그룹으로 병합
        // 예) "CW2288-111" 기타 → "CW2288 111 화이트" 화이트 그룹과 suffix(111) 일치 → 화이트로 이동
        Map<String, String> suffixToColorKey = new HashMap<>();
        for (Map.Entry<String, List<NaverItem>> e : byColor.entrySet()) {
            if (!e.getKey().startsWith("기타_")) {
                for (NaverItem item : e.getValue()) {
                    String suffix = extractColorSuffix(item.title());
                    if (suffix != null) suffixToColorKey.putIfAbsent(suffix, e.getKey());
                }
            }
        }

        if (!suffixToColorKey.isEmpty()) {
            List<String> 기타Keys = byColor.keySet().stream()
                    .filter(k -> k.startsWith("기타_"))
                    .toList();

            for (String 기타Key : 기타Keys) {
                List<NaverItem> 기타Items = new ArrayList<>(byColor.get(기타Key));
                List<NaverItem> remaining = new ArrayList<>();

                for (NaverItem item : 기타Items) {
                    String suffix = extractColorSuffix(item.title());
                    if (suffix != null && suffixToColorKey.containsKey(suffix)) {
                        byColor.get(suffixToColorKey.get(suffix)).add(item);
                    } else {
                        remaining.add(item);
                    }
                }

                if (remaining.isEmpty()) {
                    byColor.remove(기타Key);
                } else {
                    byColor.put(기타Key, remaining);
                }
            }
        }

        // 색상별 ColorVariant 생성, 최저가 오름차순 정렬
        List<ColorVariant> variants = byColor.entrySet().stream()
                .map(e -> toColorVariant(e.getKey(), e.getValue()))
                .sorted(Comparator.comparingLong(v -> parsePriceSafe(v.lowestPrice())))
                .toList();

        // 전체 최저가 기준 대표 아이템
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

    private ColorVariant toColorVariant(String colorKey, List<NaverItem> items) {
        NaverItem rep = items.stream()
                .min(Comparator.comparingLong(i -> parsePriceSafe(i.lprice())))
                .orElse(items.get(0));

        // 화면에 표시할 색상명: "기타_123456" → "기타"
        String displayColor = colorKey.startsWith("기타_") ? "기타" : colorKey;

        List<ShoeItem> stores = items.stream()
                .map(this::toShoeItem)
                .sorted(Comparator.comparingLong(s -> parsePriceSafe(s.price())))
                .toList();

        return new ColorVariant(
                rep.productId(),
                displayColor,
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
