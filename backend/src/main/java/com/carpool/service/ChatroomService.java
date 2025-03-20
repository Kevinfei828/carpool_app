package com.carpool.service;

import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.DirectChatroomCreateDTO;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.Message;
import com.carpool.entity.UserChatroom;

import java.util.List;

public interface ChatroomService {

    // Chatroom operations
    Long createDirectChatroom(DirectChatroomCreateDTO chatroomDTO);
    Long createEventChatroom(Chatroom chatroom, Long userId, Long eventId);

    List<UserBasicInfoDTO>  getChatroomUsersInfo(Long eventId);

    Chatroom getChatroomInfo(Long eventId);

    Long getChatroomIdByEventId(Long eventId);

    List<Chatroom> getAllChatrooms();

    void updateChatroom(Chatroom chatroom);

    void deleteChatroom(Long id);

    void closeChatroom(Long chatroomId);

    // UserChatroom operations
    void addUserToEventChatroom(Long userId, Long chatroomId);

    List<UserChatroom> getUsersInChatroom(Long chatroomId);

    void removeUserFromEventChatroom(Long userId, Long chatroomId);

    // Message operations
    Long addMessageToChatroom(Message message);

    List<Message> getMessagesInChatroom(Long eventId);

    void pushChatroomMessageToQueue(Long chatroomId, Message message);

    List<Long> getAllChatrooms(Long userId);
}
