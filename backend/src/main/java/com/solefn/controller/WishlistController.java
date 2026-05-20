package com.solefn.controller;

import com.solefn.dto.WishlistRequest;
import com.solefn.entity.User;
import com.solefn.entity.Wishlist;
import com.solefn.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /**
     * 관심상품 추가
     */
    @PostMapping
    public ResponseEntity<Void> addWishlist(
            @AuthenticationPrincipal User user,
            @RequestBody WishlistRequest request
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        if (request.getProductId() == null || request.getProductId().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        wishlistService.addWishlist(user, request);
        return ResponseEntity.ok().build();
    }

    /**
     * 관심상품 삭제
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable String productId
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        wishlistService.removeWishlist(user, productId);
        return ResponseEntity.ok().build();
    }

    /**
     * 관심상품 전체 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlists(
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(wishlistService.getWishlists(user));
    }

    /**
     * 관심상품 productId 목록 조회 (검색결과 하트 초기화용)
     */
    @GetMapping("/ids")
    public ResponseEntity<List<String>> getWishlistIds(
            @AuthenticationPrincipal User user
    ) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(wishlistService.getWishlistProductIds(user));
    }
}
