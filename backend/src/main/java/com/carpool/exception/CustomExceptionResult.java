package com.carpool.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CustomExceptionResult {
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "請求數據有誤!");

    // TODO: 增加新的Exception

    private final HttpStatus status;
    private final String message;
}
