package com.solefn.controller;

import com.solefn.dto.RecentViewRequest;
import com.solefn.entity.RecentView;
import com.solefn.entity.User;
import com.solefn.service.RecentViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recent-views")
@RequiredArgsConstructor
public class RecentViewController {

    private final RecentViewService recentViewService;

    /**
     * 최근 본 상품 추가
     */
    @PostMapping
    public ResponseEntity<Void> addRecentView(
            @AuthenticationPrincipal User user,
            @RequestBody RecentViewRequest request
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        if (request.getProductId() == null || request.getProductId().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        recentViewService.addRecentView(user, request);
        return ResponseEntity.ok().build();
    }

    /**
     * 최근 본 상품 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<RecentView>> getRecentViews(
            @AuthenticationPrincipal User user
    ) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(recentViewService.getRecentViews(user));
    }
}