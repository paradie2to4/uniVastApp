package com.university.app.exception;

import java.util.Date;
import java.util.Map;

public class ValidationErrorResponse extends ErrorResponse {
    private Map<String, String> errors;

    public ValidationErrorResponse(Date timestamp, int status, String error, String message, Map<String, String> errors) {
        super(timestamp, status, error, message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }
}
