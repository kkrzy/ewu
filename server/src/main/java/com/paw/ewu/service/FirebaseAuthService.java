package com.paw.ewu.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FirebaseAuthService {
    public String createUserProfile(String newName, String newEmail, String newPassword) {
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(newEmail)
                .setDisplayName(newName)
                .setPassword(newPassword);
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);
            return userRecord.getUid();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user profile", e);
        }
    }
    public void updateUserProfile(String uid, String newName, String newEmail) {
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(uid)
                .setEmail(newEmail)
                .setDisplayName(newName);
        try {
            UserRecord userRecord = FirebaseAuth.getInstance().updateUser(request);
            userRecord.getUid();
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user profile", e);
        }
    }
}