package com.carpool.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Integer code;
    private String msg;
    private Object data;
    // create, delete, update
    public static Result success() {
        return new Result(0, "success", null);
    }
    // read
    public static Result success(Object data) {
        return new Result(0, "success", data);
    }
    public static Result error(String msg) {
        return new Result(1, msg, null);
    }
}