package com.ygd.grab_the_beat.dto;

import com.ygd.grab_the_beat.domain.User;
import lombok.Getter;

/**
 * 직렬화 기능을 가진 User 클래스
 */
@Getter
public class SessionUser {

    private String name;
    private String email;

    public SessionUser(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
    }

}
