package com.ygd.grab_the_beat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserRequest {

    private String email;
    private String password;

}
