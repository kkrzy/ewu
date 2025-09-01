package com.paw.ewu.controller;

import com.paw.ewu.service.StatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="/dashboard")
public class StatsController {
    @Autowired
    private StatService statService;

    @GetMapping("/stats/{uid}")
    public ResponseEntity<?> getStats(@PathVariable String uid) {
        return ResponseEntity.ok(statService.getStats(uid));
    }
}
