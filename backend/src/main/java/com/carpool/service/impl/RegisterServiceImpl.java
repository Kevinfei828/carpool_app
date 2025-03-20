package com.carpool.service.impl;

import com.carpool.MessageQueueConsumer.EventChatroomConsumer;
import com.carpool.Utils.*;
import com.carpool.entity.*;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.carpool.entity.DTO.UserLoginDTO;
import com.carpool.mapper.UserMapper;
import com.carpool.service.ChatroomService;
import com.carpool.service.EventService;
import com.carpool.service.RegisterService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class RegisterServiceImpl implements RegisterService {

    private final StringRedisTemplate stringRedisTemplate;

    private final UserMapper userMapper;

    private final ObjectMapper objectMapper;
    private final EventChatroomConsumer eventChatroomConsumer;
    private final EventService eventService;
    private final ChatroomService chatroomService;

    public RegisterServiceImpl(StringRedisTemplate stringRedisTemplate, UserMapper userMapper,
                               ObjectMapper objectMapper, EventChatroomConsumer eventChatroomConsumer,
                               EventService eventService, ChatroomService chatroomService) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.userMapper = userMapper;
        this.objectMapper = objectMapper;
        this.eventChatroomConsumer = eventChatroomConsumer;
        this.eventService = eventService;
        this.chatroomService = chatroomService;
    }

    @Override
    public Result sendRegisterCode(LoginForm loginForm) {
        String phone = loginForm.getPhone();
        if (phone == null) {
            return Result.error("請填入手機號碼!");
        }
        if (!RegexUtils.isPhoneValid(phone)) {
            return Result.error("手機號碼格式有誤!");
        }
        int verifycodelength = 6;
        String verifyCode = RandomUtils.generateVerifyCode(verifycodelength);
        stringRedisTemplate.opsForValue().set(RedisUtils.LOGIN_PHONE_KEY + phone, verifyCode, 5, TimeUnit.MINUTES);
        return Result.success(verifyCode);
    }

    @Override
    public Result login(LoginForm loginForm) {
        String phone = loginForm.getPhone();
        if (!RegexUtils.isPhoneValid(phone)) {
            return Result.error("手機號碼格式有誤!");
        }
        String cacheCode = stringRedisTemplate.opsForValue().get(RedisUtils.LOGIN_PHONE_KEY + phone);
        if (cacheCode == null) {
            return Result.error("手機號碼未通過驗證!");
        }
        String inputCode = loginForm.getVerifyCode();
        if (!cacheCode.equals(inputCode)) {
            return Result.error("驗證碼錯誤!");
        }
        User user = userMapper.findUserWithPhone(phone);
        if (user == null) {
            int randomUsernameLength = 8;
            String randomName = RandomUtils.generateRandomName(randomUsernameLength);
            userMapper.createUserWithPhone(randomName, phone);
            user = userMapper.findUserWithPhone(phone);
        }
        String token = UUID.randomUUID().toString();
        String loginToken = RedisUtils.LOGIN_USER_KEY + token;
        UserBasicInfoDTO userDTO = ClassTransferUtils.createUserDTOFromUser(user);

        // 將User存進Redis
        try {
            Map<String, Object> userDTOmap = objectMapper.convertValue(userDTO, Map.class);
            Map<String, String> userDTOStringMap = userDTOmap.entrySet().stream()
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> entry.getValue() == null ? "" : entry.getValue().toString()
                    ));
            stringRedisTemplate.opsForHash().putAll(loginToken, userDTOStringMap);
            stringRedisTemplate.expire(loginToken, RedisUtils.TIMEOUT, RedisUtils.TIMEUNIT);
        } catch (Exception e) {
            throw new RuntimeException("序列化 UserDTO 失敗", e);
        }

        // 開始監聽user-specific notification queue
//        eventChatroomConsumer.createUserQueue(user.getId());

        // 每次登入都要監聽event的通知和聊天室queue
        List<Event> eventIds= eventService.getAllEvents(user.getId());
        List<Long> chatroomIds = chatroomService.getAllChatrooms(user.getId());

        for (Event e: eventIds) {
            Long eventId = e.getId();
            String eventNotificationQueueName = RabbitMQUtils.EVENT_NOTIFICATION_PREFIX + "." + eventId;
            eventChatroomConsumer.bindEventQueue(eventNotificationQueueName, eventId);
        }
        for (Long chatroomId: chatroomIds) {
            String chatroomMessageQueueName = RabbitMQUtils.CHATROOM_MESSAGE_PREFIX + "." + chatroomId;
            eventChatroomConsumer.bindChatroomQueue(chatroomMessageQueueName, chatroomId);
        }

        UserLoginDTO userLoginDTO = new UserLoginDTO();
        userLoginDTO.setUserId(user.getId());
        userLoginDTO.setToken(token);

        return Result.success(userLoginDTO);
    }


}
