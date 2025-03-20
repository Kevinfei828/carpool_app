package com.carpool.service.impl;

import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.DTO.UserPastEventDTO;
import com.carpool.entity.Event;
import com.carpool.entity.Result;
import com.carpool.entity.DTO.UserUpdateDTO;
import com.carpool.entity.User;
import com.carpool.mapper.UserMapper;
import com.carpool.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    @Override
    public UserBasicInfoDTO updateUser(UserUpdateDTO updatedUser) {
        userMapper.updateUserWithId(updatedUser);
        return userMapper.searchUserWithId(updatedUser.getId());
    }

    @Override
    public UserBasicInfoDTO getUserBasicInfo(Long userId) {
        return userMapper.searchUserWithId(userId);
    }
    @Override
    public User getUserNameAndId(Long userId) {
        return userMapper.getUserNameAndId(userId);
    }

    @Override
    public UserPastEventDTO[] getUserPastEvent(Long userId) {
        return userMapper.getUserPastEvent(userId);
    }


}
