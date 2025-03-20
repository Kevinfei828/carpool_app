package com.carpool.exception;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.carpool.entity.Result;

@Slf4j
@RestControllerAdvice
public class ServiceExceptionHandler {
    @ExceptionHandler({CustomException.class})
    public ResponseEntity<ErrorResponse> handlerException(CustomException e) {
        return this.makeErrorResponseEntity(e.getExceptionResult());
    }

    private ResponseEntity<ErrorResponse> makeErrorResponseEntity(CustomExceptionResult errorResult) {
        return ResponseEntity.status(errorResult.getStatus())
                .body(new ErrorResponse(errorResult.name(), errorResult.getMessage()));
    }

    @Getter
    @RequiredArgsConstructor
    static class ErrorResponse {
        private final String code;
        private final String message;
    }

}
