package com.solefn.controller;

import com.solefn.dto.SearchResponse;
import com.solefn.service.NaverShopSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private static final Logger log = LoggerFactory.getLogger(SearchController.class);

    private final NaverShopSearchService searchService;

    public SearchController(NaverShopSearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "offset", defaultValue = "0") int offset
    ) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "검색어를 입력해주세요"));
        }

        try {
            SearchResponse result = searchService.search(query, offset);
            return ResponseEntity.ok(result);
        } catch (HttpStatusCodeException e) {
            log.error("네이버 API 응답 실패: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(500).body(Map.of(
                    "error", "네이버 API 호출 실패",
                    "status", e.getStatusCode().value(),
                    "naverBody", e.getResponseBodyAsString()
            ));
        } catch (Exception e) {
            log.error("검색 처리 중 오류", e);
            return ResponseEntity.status(500).body(Map.of(
                    "error", "네이버 API 호출 실패",
                    "detail", String.valueOf(e.getMessage())
            ));
        }
    }
}
