package com.ygd.grab_the_beat.dto;

import lombok.Getter;
import lombok.Setter;

// Refresh Token을 통해서 Access Token을 요청하기 위한 DTO 객체
@Getter
@Setter
public class CreateAccessTokenRequest {

    private String refreshToken;

}
