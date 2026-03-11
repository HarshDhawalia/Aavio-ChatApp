package com.chat.aaviochatapp.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String mobile;

    private String password;
    private String status = "OFFLINE";
    private LocalDateTime createdAt = LocalDateTime.now();
}