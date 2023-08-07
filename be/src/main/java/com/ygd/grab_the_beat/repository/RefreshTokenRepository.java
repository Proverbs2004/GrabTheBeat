package com.ygd.grab_the_beat.repository;

import com.ygd.grab_the_beat.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Refresh Token 관련 Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    // userId를 기준으로 User 검색
    Optional<RefreshToken> findByUserId(Long userId);
    // refreshToken을 기준으로 User 검색
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

}
