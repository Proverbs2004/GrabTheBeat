package com.ygd.grab_the_beat.config;

import com.ygd.grab_the_beat.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final TokenProvider tokenProvider;
    private final static String HEADER_AUTHORIZATION = "Authorization";
    private final static String TOKEN_PREFIX = "Bearer ";
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // 요청 헤더의 Authorization 키의 값 조회
        String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);
        // 가져온 값에서 접두사 제거
        String token = getAccessToken(authorizationHeader);
        // 가져온 토큰이 유효한지 확인하고, 유효한 때는 인증 정보를 설정
        if (tokenProvider.validToken(token)) {
            Authentication authentication = tokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    private String getAccessToken(String authorizationHeader) {
        // authorizationHeader에서 TOKEN_PREFIX(접두사)로 시작하는 값이 존재하면,
        if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
            // TOKEN_PREFIX를 제외한 뒷 부분을 리턴 (TOKEN_PREFIX의 길이 인덱스부터 마지막 인덱스까지)
            return authorizationHeader.substring(TOKEN_PREFIX.length());
        }

        return null;
    }

}
