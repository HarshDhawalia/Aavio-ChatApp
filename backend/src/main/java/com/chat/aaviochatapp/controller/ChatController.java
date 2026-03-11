package com.chat.aaviochatapp.controller;

import com.chat.aaviochatapp.model.ChatRoom;
import com.chat.aaviochatapp.model.Message;
import com.chat.aaviochatapp.service.ChatRoomService;
import com.chat.aaviochatapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired private MessageService messageService;
    @Autowired private ChatRoomService chatRoomService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload Message message) {
        Message saved = messageService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/room." + message.getRoomId(), saved);
    }

    @MessageMapping("/chat.privateMessage")
    public void privateMessage(@Payload Message message) {
        Message saved = messageService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/user." + message.getReceiverId(), saved);
        messagingTemplate.convertAndSend("/topic/user." + message.getSenderId(), saved);
    }

    @GetMapping("/rooms/{roomId}/messages")
    public List<Message> getRoomMessages(@PathVariable String roomId) {
        return messageService.getRoomMessages(roomId);
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public List<Message> getPrivateMessages(@PathVariable String senderId,
                                            @PathVariable String receiverId) {
        return messageService.getPrivateMessages(senderId, receiverId);
    }

    @PostMapping("/rooms")
    public ChatRoom createRoom(@RequestBody ChatRoom chatRoom) {
        return chatRoomService.createRoom(chatRoom);
    }

    @GetMapping("/rooms/user/{userId}")
    public List<ChatRoom> getUserRooms(@PathVariable String userId) {
        return chatRoomService.getUserRooms(userId);
    }
}