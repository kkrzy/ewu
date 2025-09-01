package com.paw.ewu.controller;

import com.paw.ewu.exception.ExceptionEntity;
import com.paw.ewu.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.paw.ewu.model.FirebaseAuthUserDto;

@RestController
@RequestMapping(path="/auth/users")
@RequiredArgsConstructor
public class FirebaseAuthController {
    private final FirebaseAuthService firebaseAuthService;

    @PutMapping("")
    public ResponseEntity<ExceptionEntity> updateUser(@RequestBody FirebaseAuthUserDto userUpdateDto) {
        try {
            String resultUid;
            if (userUpdateDto.getPassword() == null || userUpdateDto.getPassword().isEmpty()) {
                firebaseAuthService.updateUserProfile(
                        userUpdateDto.getUid(),
                        userUpdateDto.getDisplayName(),
                        userUpdateDto.getEmail());
                resultUid = userUpdateDto.getUid();
            } else {
                resultUid = firebaseAuthService.createUserProfile(
                        userUpdateDto.getDisplayName(),
                        userUpdateDto.getEmail(),
                        userUpdateDto.getPassword());
            }
            return ResponseEntity.ok(new ExceptionEntity(true, HttpStatus.OK, resultUid));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ExceptionEntity(false, HttpStatus.BAD_REQUEST, e.getCause().getMessage()));
        }
    }
}
