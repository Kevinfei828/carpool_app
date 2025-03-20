package com.carpool.controller;

import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.MessageDTO;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.Message;
import com.carpool.entity.Result;
import com.carpool.entity.User;
import com.carpool.service.ChatroomService;
import com.carpool.service.NotificationService;
import com.carpool.service.UserService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
//@RequestMapping("message")
public class MessageController {
    // 存message到database + push message和通知到rabbitmq

    private final ChatroomService chatroomService;
    private final NotificationService notificationService;
    private final UserService userService;

    public MessageController(ChatroomService chatroomService, NotificationService notificationService,
                             UserService userService) {
        this.chatroomService = chatroomService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    // Handle messages sent to "/carpoolApp/chatroom/{chatroomId}"
    // MessageDTO須符合client的message body
    @MessageMapping("/chatroom/{chatroomId}")
    public void handleChatMessage(MessageDTO messageDTO, @DestinationVariable Long chatroomId) {
        // 1. Save the message to the database
        Message message = new Message();
        Chatroom chatroom = chatroomService.getChatroomInfo(chatroomId);
        User sender = userService.getUserNameAndId(messageDTO.getSenderId());
        message.setCreateTime(LocalDateTime.now());
        message.setChatroom(chatroom);
        message.setContent(messageDTO.getContent());
        message.setSender(sender);

        chatroomService.addMessageToChatroom(message);

        // 2. Push the message to RabbitMQ
//        notificationService.pushChatroomNotificationToQueue(chatroom);
        chatroomService.pushChatroomMessageToQueue(chatroomId, message);
    }

//    // 測試用
//    @PostMapping("/add")
//    public Result addMessagesToChatroom(@RequestParam Long chatroomId) {
//        return Result.success(chatroomService.getMessagesInChatroom(chatroomId));
//    }



//    @MessageMapping("/DM/{senderId}/{receiverId}")
//    public void handleDM(MessageDTO messageDTO, Long senderId, Long receiverId) {
//        Message message = new Message();
//    }
}
