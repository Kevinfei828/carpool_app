package com.carpool.mapper;

import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.Message;
import com.carpool.entity.UserChatroom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;
import java.util.List;


@Mapper
public interface ChatroomMapper {
    // Chatroom CRUD operations
    void insertChatroom(Chatroom chatroom);
    Chatroom selectChatroomById(Long id);
    List<Chatroom> selectAllChatrooms();

    @Select("select id, name, phone_number as phoneNumber, email_address as emailAddress from User u inner join user_chatroom uc " +
            "on u.id = uc.user_id where uc.chatroom_id = #{chatroomId}")
    List<UserBasicInfoDTO> getChatroomUsersInfo(Long chatroomId);

    @Select("select chatroom_id from event_chatroom where event_id = #{eventId}")
    Long getChatroomIdByEventId(Long eventId);

    @Select("select * from chatroom c inner join event_chatroom ec " +
            "on ec.chatroom_id = c.id where ec.event_id = #{eventId} ")
    Chatroom getChatroomInfo(Long eventId);

    void updateChatroom(Chatroom chatroom);
    void deleteChatroom(Long id);

    @Update("update Chatroom set is_closed = true where id = #{chatroomId}")
    void closeChatroom(Long chatroomId);

    // UserChatroom operations
    void insertUserChatroom(Long userId, Long chatroomId, LocalDateTime joinChatroomTime);

    @Update("insert into event_chatroom (event_id, chatroom_id) values (#{eventId}, #{chatroomId})")
    void insertEventChatroom(Long chatroomId, Long eventId);
    List<UserChatroom> selectUsersByChatroomId(Long chatroomId);
    void deleteUserChatroom(Long userId, Long chatroomId);

    // Message operations
    void insertMessage(Message message);
    List<Message> selectMessagesByChatroomId(Long chatroomId);
    void deleteMessagesByChatroomId(Long chatroomId);

    @Select("select chatroom_id from user_chatroom where user_id = #{userId}")
    List<Long> getAllChatrooms(Long userId);
}
