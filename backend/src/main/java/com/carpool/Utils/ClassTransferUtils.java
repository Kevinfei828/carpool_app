package com.carpool.Utils;

import com.carpool.entity.DTO.EventJoinDTO;
import com.carpool.entity.Event;
import com.carpool.entity.User;
import com.carpool.entity.DTO.UserBasicInfoDTO;

public class ClassTransferUtils {
    public static UserBasicInfoDTO createUserDTOFromUser(User user) {
        UserBasicInfoDTO userDTO = new UserBasicInfoDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setEmailAddress(user.getEmailAddress());
        return userDTO;
    }

//    public static EventJoinDTO createEventDTOFromEvent(Event e, Integer attendantNumber) {
//        EventJoinDTO eventJoinDTO = new EventJoinDTO();
//        eventJoinDTO.setEventId(e.getId());
//        eventJoinDTO.setUserId(e.getInitiator().getId());
//        eventJoinDTO.setAttendantNumber(attendantNumber);   // 發起人自己要乘坐的數量
//        eventJoinDTO.setGetOnTime(e.getStartTime());
//        eventJoinDTO.setGetOnLocationId(e.getStartLocation().getId());
//        eventJoinDTO.setGetOffLocationId(e.getEndLocation().getId());
//        return eventJoinDTO;
//    }
}
