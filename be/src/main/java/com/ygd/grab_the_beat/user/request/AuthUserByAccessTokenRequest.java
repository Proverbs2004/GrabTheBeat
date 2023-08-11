package com.ygd.grab_the_beat.user.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthUserByAccessToken {

    private String accessToken;

}
