package com.carpool.Interceptor;

import com.carpool.Utils.RedisUtils;
import com.carpool.Utils.UserThread;
import com.carpool.entity.DTO.UserBasicInfoDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Slf4j
public class RefreshTokenInterceptor implements HandlerInterceptor {
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

//    @Autowired
//    private ObjectMapper objectMapper;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("Authorization");
        if (token == null) {
            return true;
        }
        String loginToken = RedisUtils.LOGIN_USER_KEY + token;

        Map<Object, Object> userDTOMap = stringRedisTemplate.opsForHash().entries(loginToken);
        if (userDTOMap == null || userDTOMap.isEmpty()) {
            return true;
        }
        UserBasicInfoDTO userDTO = objectMapper.convertValue(userDTOMap, UserBasicInfoDTO.class);
        UserThread.saveUser(userDTO);
        stringRedisTemplate.expire(loginToken, RedisUtils.TIMEOUT, RedisUtils.TIMEUNIT);

        return true;
    }
}
