package com.chat.aaviochatapp.repository;

import com.chat.aaviochatapp.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findByMemberIdsContaining(String userId);
    Optional<ChatRoom> findByNameAndIsPrivate(String name, boolean isPrivate);
}