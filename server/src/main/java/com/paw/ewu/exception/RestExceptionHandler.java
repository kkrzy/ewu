package com.paw.ewu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({LeaveNotFoundException.class})
    protected ResponseEntity<ExceptionEntity> handleLeaveNotFound(LeaveNotFoundException e) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ExceptionEntity(false, HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(LeaveValidationException.class)
    public ResponseEntity<ExceptionEntity> handleLeaveValidation(LeaveValidationException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ExceptionEntity(false, HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler({Exception.class})
    protected ResponseEntity<ExceptionEntity> handleAllExceptions(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ExceptionEntity(false, HttpStatus.INTERNAL_SERVER_ERROR, "Wystąpił nieoczekiwany błąd"));
    }
}
