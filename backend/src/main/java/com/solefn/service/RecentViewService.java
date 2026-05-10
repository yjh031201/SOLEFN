package com.solefn.service;

import com.solefn.entity.RecentView;
import com.solefn.entity.User;
import com.solefn.repository.RecentViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecentViewService {

    private static final int MAX_RECENT_ITEMS = 20;

    private final RecentViewRepository recentViewRepository;

    /**
     * 최근 본 상품 추가 (이미 있으면 시간만 갱신)
     */
    @Transactional
    public void addRecentView(User user, RecentView recentView) {
        Optional<RecentView> existing =
                recentViewRepository.findByUserAndProductId(user, recentView.getProductId());

        if (existing.isPresent()) {
            // 기존 기록 시간만 갱신
            existing.get().setViewedAt(LocalDateTime.now());
        } else {
            // 새로 저장
            recentView.setUser(user);
            recentView.setViewedAt(LocalDateTime.now());
            recentViewRepository.save(recentView);
        }
    }

    /**
     * 사용자의 최근 본 상품 조회 (최신순, 최대 20개)
     */
    public List<RecentView> getRecentViews(User user) {
        return recentViewRepository.findByUserOrderByViewedAtDesc(
                user,
                PageRequest.of(0, MAX_RECENT_ITEMS)
        );
    }
}