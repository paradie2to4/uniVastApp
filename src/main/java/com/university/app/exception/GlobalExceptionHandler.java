package com.university.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;
=======
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

>>>>>>> 47f4fab (Updated with new features)
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

<<<<<<< HEAD
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(ResourceNotFoundException ex) {
        ErrorResponse errorDetails = new ErrorResponse(new Date(), HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex) {
        ErrorResponse errorDetails = new ErrorResponse(new Date(), HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse errorDetails = new ValidationErrorResponse(
            new Date(), 
            HttpStatus.BAD_REQUEST.value(), 
            "Validation Error", 
            "Invalid input data", 
            errors
        );
        
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
=======
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Object> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex, WebRequest request) {
        
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
        body.put("error", "Unsupported Media Type");
        body.put("message", "The content type is not supported. Please use application/json");
        body.put("path", request.getDescription(false));

        return new ResponseEntity<>(body, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", "Invalid request body");
        body.put("path", request.getDescription(false));

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllUncaughtException(
            Exception ex, WebRequest request) {
        
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false));

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
>>>>>>> 47f4fab (Updated with new features)
    }
}
