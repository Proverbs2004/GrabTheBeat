package com.ygd.grab_the_beat.user.controller;

import com.ygd.grab_the_beat.user.request.AddUserRequest;
import com.ygd.grab_the_beat.user.service.UserService;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@RequiredArgsConstructor
@Controller
public class UserApiController {
    
    private final UserService userService;
    
    @PostMapping("/api/user")
    public String signup(AddUserRequest request) {
        userService.save(request);  // 회원 가입 메서드 호출
        return "redirect:/login";   // 회원 가입이 완료된 이후에 로그인 페이지로 이동
    }

    @GetMapping("/api/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return "redirect:/";
    }
    
}
