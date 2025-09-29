package com.saam.backend.auth.exceptions;

public class InvalidRoleException extends RuntimeException {

    public InvalidRoleException(String message) {
        super(message);
    }
}
