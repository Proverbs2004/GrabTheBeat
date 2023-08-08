package com.ygd.grab_the_beat.config.response;

import lombok.Getter;

@Getter
public enum BaseStatus {
    SUCCESS(true, "요청에 성공했습니다."),

    URI_NOT_EXIST(false, "존재하지 않는 URL입니다."),
    METHOD_NOT_EXIST(false, "지원하지 않는 Method입니다."),
    REQUEST_BODY_ERROR(false, "REQUEST BODY에 문제가 있습니다."),

    ROOM_IS_EMPTY(false, "생성된 방이 아닙니다."),
    ROOM_IS_FULL(false, "방이 가득 찼습니다."),
    ROOM_IS_PLAYING(false, "게임이 플레이 중입니다.");

    private final boolean isSuccess;
    private final String message;

    BaseStatus(boolean isSuccess, String message) {
        this.isSuccess = isSuccess;
        this.message = message;
    }

}
