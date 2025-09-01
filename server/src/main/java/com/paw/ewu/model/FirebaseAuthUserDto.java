package com.paw.ewu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseAuthUserDto {
    private String uid;
    private String displayName;
    private String email;
    private String password;
}