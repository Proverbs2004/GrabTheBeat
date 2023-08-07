package com.ygd.grab_the_beat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// Access Token을 응답하기 위한 DTO 객체
@AllArgsConstructor
@Getter
public class CreateAccessTokenResponse {

    private String accessToken;

}
