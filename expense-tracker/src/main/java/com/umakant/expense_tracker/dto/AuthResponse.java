
package com.umakant.expense_tracker.dto;

public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private String message;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(
            Long id,
            String name,
            String email,
            String message
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public AuthResponse(
            Long id,
            String name,
            String email,
            String message,
            String token
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}
