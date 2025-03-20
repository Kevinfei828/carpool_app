package com.carpool.service.impl;

import com.carpool.MessageQueueConsumer.EventChatroomConsumer;
import com.carpool.Utils.RabbitMQUtils;
import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.DirectChatroomCreateDTO;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.Message;
import com.carpool.entity.UserChatroom;
import com.carpool.mapper.ChatroomMapper;
import com.carpool.service.ChatroomService;
import com.carpool.service.NotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatroomServiceImpl implements ChatroomService {
    private final ChatroomMapper chatroomMapper;
    private final RabbitTemplate rabbitTemplate;
    private final EventChatroomConsumer eventChatroomConsumer;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public ChatroomServiceImpl(ChatroomMapper chatroomMapper, RabbitTemplate rabbitTemplate,
                               EventChatroomConsumer eventChatroomConsumer, NotificationService notificationService,
                                ObjectMapper objectMapper) {
        this.chatroomMapper = chatroomMapper;
        this.rabbitTemplate = rabbitTemplate;
        this.eventChatroomConsumer = eventChatroomConsumer;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    // Chatroom operations
    public Long createDirectChatroom(DirectChatroomCreateDTO chatroomDTO) {
        Chatroom chatroom = new Chatroom();
        chatroom.setEventChatroom(false);
        chatroom.setName("DM chatroom");
        chatroomMapper.insertChatroom(chatroom);

        LocalDateTime chatroomCreateTime = LocalDateTime.now();
        chatroomMapper.insertUserChatroom(chatroomDTO.getSenderId(), chatroom.getId(), chatroomCreateTime);
        chatroomMapper.insertUserChatroom(chatroomDTO.getReceiverId(), chatroom.getId(), chatroomCreateTime);

        // 開始監聽陌生訊息聊天室
        eventChatroomConsumer.createDMQueue(chatroom.getId());

        // 通知receiver有新陌生訊息
        notificationService.pushDMNotificationToQueue(chatroomDTO.getSenderId(), chatroomDTO.getReceiverId());

        return chatroom.getId();
    }

    public Long createEventChatroom(Chatroom chatroom, Long userId, Long eventId) {
        chatroomMapper.insertChatroom(chatroom);

        LocalDateTime chatroomCreateTime = LocalDateTime.now();
        chatroomMapper.insertUserChatroom(userId, chatroom.getId(), chatroomCreateTime);
        chatroomMapper.insertEventChatroom(chatroom.getId(), eventId);

        return chatroom.getId();
    }

    public List<UserBasicInfoDTO> getChatroomUsersInfo(Long eventId) {
        Long chatroomId = chatroomMapper.getChatroomIdByEventId(eventId);
        return chatroomMapper.getChatroomUsersInfo(chatroomId);
//        Chatroom chatroom = chatroomMapper.selectChatroomById(chatroomId);
//        chatroom.setMessages(chatroomMapper.getMessagesByChatroomId(chatroomId));
//        chatroom.setUserChatrooms(
//            chatroomMapper.getUsersByChatroomId(chatroomId).stream()
//            .map(user -> {UserChatroom userChatroom = new UserChatroom();
//                        userChatroom.setUser(user);
//                        return userChatroom;
//            }).collect(Collectors.toList())
//        );
    }

    public Chatroom getChatroomInfo (Long eventId) {
        return chatroomMapper.getChatroomInfo(eventId);
    }

    public Long getChatroomIdByEventId(Long eventId) {
        return chatroomMapper.getChatroomIdByEventId(eventId);
    }

    public List<Chatroom> getAllChatrooms() {
        return chatroomMapper.selectAllChatrooms();
    }

    public void updateChatroom(Chatroom chatroom) {
        chatroomMapper.updateChatroom(chatroom);
    }

    public void deleteChatroom(Long id) {
        chatroomMapper.deleteChatroom(id);
        chatroomMapper.deleteMessagesByChatroomId(id); // Cascade delete messages
    }

    public void closeChatroom(Long chatroomId) {
        chatroomMapper.closeChatroom(chatroomId);
    }

    // UserChatroom operations
    public void addUserToEventChatroom(Long userId, Long chatroomId) {
        chatroomMapper.insertUserChatroom(userId, chatroomId, LocalDateTime.now());
    }

    public List<UserChatroom> getUsersInChatroom(Long chatroomId) {
        return chatroomMapper.selectUsersByChatroomId(chatroomId);
    }

    public void removeUserFromEventChatroom(Long userId, Long chatroomId) {
        chatroomMapper.deleteUserChatroom(userId, chatroomId);
    }

    // Message operations
    public Long addMessageToChatroom(Message message) {
        chatroomMapper.insertMessage(message);
        return message.getId();
    }

    public List<Message> getMessagesInChatroom(Long eventId) {
        Long chatroomId = chatroomMapper.getChatroomIdByEventId(eventId);
        return chatroomMapper.selectMessagesByChatroomId(chatroomId);
    }

    @Override
    public void pushChatroomMessageToQueue(Long chatroomId, Message message) {
//        System.out.println("pushChatroomMessageToQueue: " + message);
        try {
            String serializedMessage = objectMapper.writeValueAsString(message);
            String chatroomMessageQueueRoutingKeyName = RabbitMQUtils.CHATROOM_MESSAGE_PREFIX + "." + chatroomId;
            rabbitTemplate.convertAndSend(RabbitMQUtils.EXCHANGE_NAME, chatroomMessageQueueRoutingKeyName, serializedMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize message", e);
        }
    }

    public List<Long> getAllChatrooms(Long userId) {
        return chatroomMapper.getAllChatrooms(userId);
    }

}
