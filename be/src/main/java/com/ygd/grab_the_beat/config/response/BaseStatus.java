package com.ygd.grab_the_beat.config.response;

import lombok.Getter;

@Getter
public enum BaseStatus {
    SUCCESS(true, "요청에 성공하셨습니다."),

    URI_NOT_EXIST(false, "존재하지 않는 URL입니다."),
    METHOD_NOT_EXIST(false, "지원하지 않는 Method입니다."),
    REQUEST_BODY_ERROR(false, "REQUEST BODY에 문제가 있습니다.");

    private final boolean isSuccess;
    private final String message;

    BaseStatus(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
