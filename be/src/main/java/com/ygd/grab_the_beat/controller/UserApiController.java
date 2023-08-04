//package com.ygd.grab_the_beat.controller;
//
//import com.ygd.grab_the_beat.dto.AddUserRequest;
//import com.ygd.grab_the_beat.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//
//@RequiredArgsConstructor
//@Controller
//public class UserApiController {
//
//    private final UserService userService;
//
//    @PostMapping("/user")
//    public String signup(AddUserRequest request) {
//        userService.save(request);  // 회원 가입 메서드 호출
//        return "redirect:/login";   // 회원 가입이 완료된 이후에 로그인 페이지로 이동
//    }
//
//    @GetMapping("/logout")
//    public String logout(HttpServletRequest request, HttpServletResponse response) {
//        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
//        return "redirect:/login";
//    }
//
//}
