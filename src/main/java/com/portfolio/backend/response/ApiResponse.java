package com.portfolio.backend.response;

public class ApiResponse {
    private String message;
    private Integer statusCode;

    public ApiResponse(String message, Integer statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public Integer getStatusCode() {
        return statusCode;
    }
}