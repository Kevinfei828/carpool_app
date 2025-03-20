package com.carpool.mapper;

import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.DTO.UserPastEventDTO;
import com.carpool.entity.DTO.UserUpdateDTO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import com.carpool.entity.User;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    void createUserWithPhone(String name, String phone);

    @Select("select * from user where phone_number = #{phone}")
    User findUserWithPhone(String phone);

    @Select("select id, name, phone_number AS phoneNumber, email_address AS emailAddress" +
            " from user where id = #{userId}")
    UserBasicInfoDTO searchUserWithId(Long userId);

    @Select("select id, name from user where id = #{userId}")
    User getUserNameAndId(Long userId);

    void updateUserWithId(UserUpdateDTO updatedUser);


    @Select("select * from carpool_event ce inner join Event e on ce.event_id = e.id where ce.attendant_id = #{userId}")
    UserPastEventDTO[] getUserPastEvent(Long userId);


}
