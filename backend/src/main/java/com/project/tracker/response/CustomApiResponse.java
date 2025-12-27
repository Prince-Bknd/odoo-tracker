package com.project.tracker.response;

import org.springframework.http.HttpStatus;

public class CustomApiResponse<T> {
    private String status;
    private String message;
    private T data;
    private boolean success;
    private HttpStatus httpStatus;
    
    public CustomApiResponse() {}
    
    public CustomApiResponse(String status, String message, T data, boolean success, HttpStatus httpStatus) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
        this.httpStatus = httpStatus;
    }
    
    public static <T> CustomApiResponse<T> success(String message, T data) {
        return new CustomApiResponse<>("OK", message, data, true, HttpStatus.OK);
    }
    
    public static <T> CustomApiResponse<T> created(String message, T data) {
        return new CustomApiResponse<>("CREATED", message, data, true, HttpStatus.CREATED);
    }
    
    public static <T> CustomApiResponse<T> error(String message, HttpStatus status) {
        return new CustomApiResponse<>(status.name(), message, null, false, status);
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public T getData() {
        return data;
    }
    
    public void setData(T data) {
        this.data = data;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
    
    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }
}
