package com.carpool.mapper;

import com.carpool.entity.Notification;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NotificationMapper {
    @Insert("""
            INSERT INTO Notification (receiver_id, type, create_time, content, is_read)
            VALUES (#{receiver.id}, #{type}, #{createTime}, #{content}, #{isRead})
            """)
    @Options(useGeneratedKeys = true, keyColumn = "id", keyProperty = "id")
    void insertNotification(Notification notification);

    @Select("""
            SELECT * FROM Notification
            WHERE id = #{id}
            """)
    @Results({
            @Result(property = "receiver.id", column = "receiver_id"),
            @Result(property = "type", column = "type"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "content", column = "content"),
            @Result(property = "isRead", column = "is_read")
    })
    Notification findNotificationById(Long id);

    @Select("""
            SELECT * FROM Notification
            WHERE receiver_id = #{userId}
            """)
    @Results({
            @Result(property = "receiver.id", column = "receiver_id"),
            @Result(property = "type", column = "type"),
            @Result(property = "createTime", column = "create_time"),
            @Result(property = "content", column = "content"),
            @Result(property = "isRead", column = "is_read")
    })
    List<Notification> findNotificationsByUserId(Long userId);

    @Update("""
            UPDATE Notification
            SET is_read = true
            WHERE id = #{id}
            """)
    void updateNotificationAsRead(Long id);

    @Delete("""
            DELETE FROM Notification
            WHERE id = #{id}
            """)
    void deleteNotification(Long id);
}

