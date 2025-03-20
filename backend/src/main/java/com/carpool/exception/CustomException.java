package com.carpool.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CustomException extends Exception {
    private final CustomExceptionResult exceptionResult;
}
