package com.solefn.service;

import com.solefn.dto.WishlistRequest;
import com.solefn.entity.User;
import com.solefn.entity.Wishlist;
import com.solefn.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    /**
     * 관심상품 추가 (이미 있으면 정보 갱신)
     */
    @Transactional
    public void addWishlist(User user, WishlistRequest request) {
        wishlistRepository.findByUserAndProductId(user, request.getProductId())
            .ifPresentOrElse(w -> {
                w.setTitle(request.getTitle());
                w.setImage(request.getImage());
                w.setPrice(request.getPrice());
                w.setMallName(request.getMallName());
                w.setBrand(request.getBrand());
                w.setLink(request.getLink());
                w.setAddedAt(LocalDateTime.now());
            }, () -> {
                Wishlist w = new Wishlist();
                w.setUser(user);
                w.setProductId(request.getProductId());
                w.setTitle(request.getTitle());
                w.setImage(request.getImage());
                w.setPrice(request.getPrice());
                w.setMallName(request.getMallName());
                w.setBrand(request.getBrand());
                w.setLink(request.getLink());
                w.setAddedAt(LocalDateTime.now());
                wishlistRepository.save(w);
            });
    }

    /**
     * 관심상품 삭제
     */
    @Transactional
    public void removeWishlist(User user, String productId) {
        wishlistRepository.deleteByUserAndProductId(user, productId);
    }

    /**
     * 관심상품 전체 목록 조회 (최신순)
     */
    public List<Wishlist> getWishlists(User user) {
        return wishlistRepository.findByUserOrderByAddedAtDesc(user, PageRequest.of(0, 200));
    }

    /**
     * 관심상품 productId 목록만 반환 (화면 초기 하트 상태 복원용)
     */
    public List<String> getWishlistProductIds(User user) {
        return getWishlists(user).stream()
                .map(Wishlist::getProductId)
                .toList();
    }
}
