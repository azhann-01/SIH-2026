package com.codexminds.indusync.controller;

import com.codexminds.indusync.entity.Notification;
import com.codexminds.indusync.entity.User;
import com.codexminds.indusync.repository.NotificationRepository;
import com.codexminds.indusync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<?> create(@PathVariable Long userId, @RequestBody String message) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        return ResponseEntity.ok(notificationRepository.save(n));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUser(@PathVariable Long userId) {
        List<Notification> list = notificationRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        n.setRead(true);
        return ResponseEntity.ok(notificationRepository.save(n));
    }
}