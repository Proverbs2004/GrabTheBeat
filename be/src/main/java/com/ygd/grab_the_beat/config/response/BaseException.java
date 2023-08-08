package com.ygd.grab_the_beat.config.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class BaseException extends Exception {
    private BaseStatus status;
    private Object errMsg;

    public BaseException(BaseStatus status) {
        this.status = status;
    }

    public BaseException(BaseStatus status, Object errMsg) {
        this.status = status;
        this.errMsg = errMsg;
    }
}
