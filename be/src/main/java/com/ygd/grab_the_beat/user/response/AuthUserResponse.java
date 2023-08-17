package com.ygd.grab_the_beat.user.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthUserResponse {

    private String email;
    private String nickname;

}
