package com.ygd.grab_the_beat.user.response;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Getter
@Setter
public class AuthUserByAccessTokenResponse {

    private Long userId;

}
