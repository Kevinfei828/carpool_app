package com.carpool.service.impl;

import com.carpool.Utils.RabbitMQUtils;
import com.carpool.Utils.RedisUtils;
import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.Notification;
import com.carpool.mapper.NotificationMapper;
import com.carpool.service.NotificationService;
import com.carpool.service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationMapper notificationMapper;
    private final RabbitTemplate rabbitTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public NotificationServiceImpl(NotificationMapper notificationMapper, RabbitTemplate rabbitTemplate,
                                   StringRedisTemplate stringRedisTemplate, UserService userService,
                                   ObjectMapper objectMapper) {
        this.notificationMapper = notificationMapper;
        this.rabbitTemplate = rabbitTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    @Override
    public Long createNotification(Notification notification) {
        notificationMapper.insertNotification(notification);
        return notification.getId();
    }

    @Override
    public Notification getNotificationById(Long id) {
        return notificationMapper.findNotificationById(id);
    }

    @Override
    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationMapper.findNotificationsByUserId(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        notificationMapper.updateNotificationAsRead(notificationId);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationMapper.deleteNotification(notificationId);
    }

    @Override
    public void pushEventNotificationToQueue(Long eventId, List<Notification> notifications) {
        try {
//            for (Notification n: notifications) {
            String eventNotificationQueueRoutingKeyName = RabbitMQUtils.EVENT_NOTIFICATION_PREFIX + "." + eventId;

            String serializedNotification = objectMapper.writeValueAsString(notifications.get(0));
            rabbitTemplate.convertAndSend(RabbitMQUtils.EXCHANGE_NAME, eventNotificationQueueRoutingKeyName, serializedNotification);
//            }
        }
        catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notification", e);
        }
    }

//    @Override
//    public void pushChatroomNotificationToQueue(Chatroom chatroom) {
//        String message = "您有來自" + chatroom.getName() + "的新訊息!";
//        String chatroomNotificationQueueRoutingKeyName = RabbitMQUtils.CHATROOM_NOTIFICATION_PREFIX + "." + chatroom.getId();
//        rabbitTemplate.convertAndSend(RabbitMQUtils.EXCHANGE_NAME, chatroomNotificationQueueRoutingKeyName, message);
//    }

    @Override
    public void pushDMNotificationToQueue(Long senderId, Long receiverId) {
        UserBasicInfoDTO sender = userService.getUserBasicInfo(senderId);
        String message = "您有來自用戶" + sender.getName() + "的新陌生訊息，請至聊天室頁面查看!";
        String UserQueueRoutingKeyName = RabbitMQUtils.USER_PREFIX + "." + receiverId;
        rabbitTemplate.convertAndSend(RabbitMQUtils.EXCHANGE_NAME, UserQueueRoutingKeyName, message);
    }
}
