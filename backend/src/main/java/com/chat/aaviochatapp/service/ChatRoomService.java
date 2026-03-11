package com.chat.aaviochatapp.service;

import com.chat.aaviochatapp.model.ChatRoom;
import com.chat.aaviochatapp.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatRoomService {
    @Autowired private ChatRoomRepository chatRoomRepository;

    public ChatRoom createRoom(ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> getUserRooms(String userId) {
        return chatRoomRepository.findByMemberIdsContaining(userId);
    }

    public ChatRoom getRoomById(String roomId) {
        return chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}