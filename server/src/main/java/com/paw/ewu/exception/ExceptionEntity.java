package com.paw.ewu.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionEntity {
    private boolean success;
    private HttpStatus errorStatus;
    private String message;
}