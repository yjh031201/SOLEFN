package com.solefn.repository;

import com.solefn.entity.RecentView;
import com.solefn.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecentViewRepository extends JpaRepository<RecentView, Long> {

    // 사용자의 최근 본 상품 (최신순)
    List<RecentView> findByUserOrderByViewedAtDesc(User user, Pageable pageable);

    // 같은 상품 이미 본 적 있는지 (있으면 viewed_at만 갱신)
    Optional<RecentView> findByUserAndProductId(User user, String productId);
}