package com.ygd.grab_the_beat.config.response;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.List;

@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public BaseResponse noHandlerFoundHandler(NoHandlerFoundException exception) {
        return new BaseResponse(BaseStatus.URI_NOT_EXIST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public BaseResponse methodNotSupportedHandler(HttpRequestMethodNotSupportedException exception) {
        return new BaseResponse(BaseStatus.METHOD_NOT_EXIST);
    }

    @ExceptionHandler(BaseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BaseResponse customErrorHandler(BaseException exception) {
        return new BaseResponse(exception.getStatus(), exception.getErrMsg());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // Request Body Valid error
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BaseResponse requestBodyValidHandler(MethodArgumentNotValidException exception) throws NoSuchFieldException {
        List<ObjectError> errorList = exception.getBindingResult().getAllErrors();
        HashMap<String, String> errMsg = new HashMap<>();
        for (ObjectError error : errorList) {
            errMsg.put(((FieldError) error).getField(), error.getDefaultMessage());
        }

        return new BaseResponse(BaseStatus.REQUEST_BODY_ERROR, errMsg);
    }
}
