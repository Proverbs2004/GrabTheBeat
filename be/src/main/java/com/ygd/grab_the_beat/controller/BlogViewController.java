package com.ygd.grab_the_beat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Controller
public class BlogViewController {

    @GetMapping("/articles")
    public String getArticles(Model model) {
        return "articleList";
    }

}