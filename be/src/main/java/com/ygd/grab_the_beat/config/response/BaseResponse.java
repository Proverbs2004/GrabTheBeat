package com.ygd.grab_the_beat.config.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonPropertyOrder({"isSuccess", "message", "result", "errMsg"})
public class BaseResponse<T> {
    @JsonProperty("isSuccess")
    private boolean isSuccess; // 성공 여부
    private String message; // 메시지

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T result; // 결과

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T errMsg; // 상세 에러 메시지

    public BaseResponse() {
        this.isSuccess = BaseStatus.SUCCESS.isSuccess();
        this.message = BaseStatus.SUCCESS.getMessage();
    }

    public BaseResponse(T result) {
        this.isSuccess = BaseStatus.SUCCESS.isSuccess();
        this.message = BaseStatus.SUCCESS.getMessage();
        this.result = result;
    }

    public BaseResponse(BaseStatus status) {
        this.isSuccess = status.isSuccess();
        this.message = status.getMessage();
    }

    public BaseResponse(BaseStatus status, T errMsg) {
        this.isSuccess = status.isSuccess();
        this.message = status.getMessage();
        this.errMsg = errMsg;
    }
}
