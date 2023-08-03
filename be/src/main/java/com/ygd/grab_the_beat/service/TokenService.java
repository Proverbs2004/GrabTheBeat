package com.ygd.grab_the_beat.service;

import com.ygd.grab_the_beat.config.jwt.TokenProvider;
import com.ygd.grab_the_beat.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

// Token 관련 Service
@RequiredArgsConstructor
@Service
public class TokenService {

    // 토큰 생성자
    private final TokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    public String createNewAccessToken(String refreshToken) {
        // 토큰 유효성 검사에 실패하면 에외 발생
        if (!tokenProvider.validToken(refreshToken)) {
            throw new IllegalArgumentException("Unexpected token");
        }

        // refreshToken을 통해서 User 탐색, User의 Id를 획득
        Long userId = refreshTokenService.findByRefreshToken(refreshToken).getUserId();
        // userId를 통해서 User 탐색
        User user = userService.findById(userId);

        // 토큰 생성자로 Access Token을 생성.
        return tokenProvider.generateToken(user, Duration.ofHours(2));
    }

}
