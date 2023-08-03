package com.ygd.grab_the_beat.config;

import com.ygd.grab_the_beat.service.UserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

@RequiredArgsConstructor
@Configuration
public class WebSecurityConfig {

    private final UserDetailService userService;

    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers(toH2Console())
                .antMatchers("/static/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeRequests()
                // antMatchers()에 있는 URL은 모두 접근 허용
                .antMatchers("/login", "/signup", "/user", "/**").permitAll()
                // 그 이외의 URL은 인증되어야 접속 가능
                .anyRequest().authenticated()
                .and()
                .formLogin()                        // 로그인 폼
                .loginPage("/login")                // 로그인 페이지는 "/login"
                .defaultSuccessUrl("/articles")     // 로그인 성공 시에는 "/articles"
                .and()
                .logout()                           // 로그아웃
                .logoutSuccessUrl("/login")         // 로그아웃 성공 시에는 "/login"
                .invalidateHttpSession(true)
                .and()
                .csrf().disable()
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailService userDetailService) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userService)
                .passwordEncoder(bCryptPasswordEncoder)
                .and()
                .build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}