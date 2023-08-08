package com.ygd.grab_the_beat.config.exception;

import lombok.Getter;

@Getter
public enum BaseStatus {
    SUCCESS(true, "요청에 성공하셨습니다.");

    private final boolean isSuccess;
    private final String message;

    BaseStatus(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }
}
