package com.solefn.service;

import com.solefn.dto.RecentViewRequest;
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

    private static final int MAX_RECENT_ITEMS = 10;

    private final RecentViewRepository recentViewRepository;

    /**
     * 최근 본 상품 추가 (이미 있으면 시간 + 정보 갱신)
     */
    @Transactional
    public void addRecentView(User user, RecentViewRequest request) {
        Optional<RecentView> existing =
                recentViewRepository.findByUserAndProductId(user, request.getProductId());

        if (existing.isPresent()) {
            // 기존 기록: 시간 갱신 + 변동 가능한 정보(가격 등) 같이 갱신
            RecentView rv = existing.get();
            rv.setTitle(request.getTitle());
            rv.setImage(request.getImage());
            rv.setPrice(request.getPrice());
            rv.setMallName(request.getMallName());
            rv.setBrand(request.getBrand());
            rv.setLink(request.getLink());
            rv.setViewedAt(LocalDateTime.now());
        } else {
            // 새로 저장
            RecentView rv = new RecentView();
            rv.setUser(user);
            rv.setProductId(request.getProductId());
            rv.setTitle(request.getTitle());
            rv.setImage(request.getImage());
            rv.setPrice(request.getPrice());
            rv.setMallName(request.getMallName());
            rv.setBrand(request.getBrand());
            rv.setLink(request.getLink());
            rv.setViewedAt(LocalDateTime.now());
            recentViewRepository.save(rv);

            // 20개 초과 시 오래된 것 삭제
            pruneOldEntries(user);
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

    /**
     * MAX_RECENT_ITEMS 초과분 삭제
     */
    private void pruneOldEntries(User user) {
        List<RecentView> all = recentViewRepository.findByUserOrderByViewedAtDesc(
                user,
                PageRequest.of(0, Integer.MAX_VALUE)
        );
        if (all.size() > MAX_RECENT_ITEMS) {
            List<RecentView> toDelete = all.subList(MAX_RECENT_ITEMS, all.size());
            recentViewRepository.deleteAll(toDelete);
        }
    }
}