package com.ygd.grab_the_beat.service;

import com.ygd.grab_the_beat.domain.RefreshToken;
import com.ygd.grab_the_beat.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// Refresh Token 관련 Service
@RequiredArgsConstructor
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    // refreshToken을 기준으로 User 검색
    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected token"));
    }

}
