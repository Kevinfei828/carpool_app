package com.carpool.service;

import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.DTO.UserPastEventDTO;
import com.carpool.entity.Result;
import com.carpool.entity.DTO.UserUpdateDTO;
import com.carpool.entity.User;

public interface UserService {
    UserBasicInfoDTO updateUser(UserUpdateDTO updatedUser);
    UserBasicInfoDTO getUserBasicInfo(Long userId);
    User getUserNameAndId(Long userId);

    UserPastEventDTO[] getUserPastEvent(Long userId);

}
