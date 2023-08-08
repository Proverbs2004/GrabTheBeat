package com.ygd.grab_the_beat.user.request;

import lombok.Getter;
import lombok.Setter;

// User를 DB에 저장할 것을 요청하기 위한 DTO 객체.
@Getter
@Setter
public class AddUserRequest {

    private String email;
    private String password;

}
