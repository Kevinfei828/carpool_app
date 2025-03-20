package com.carpool.service;

import com.carpool.entity.Chatroom;
import com.carpool.entity.Notification;

import java.util.List;

public interface NotificationService {
    Long createNotification(Notification notification);

    Notification getNotificationById(Long id);

    List<Notification> getAllNotificationsByUserId(Long userId);

    void markAsRead(Long notificationId);

    void deleteNotification(Long notificationId);

    void pushEventNotificationToQueue(Long eventId, List<Notification> notifications);

//    void pushChatroomNotificationToQueue(Chatroom chatroom);

    void pushDMNotificationToQueue(Long senderId, Long receiverId);
}
