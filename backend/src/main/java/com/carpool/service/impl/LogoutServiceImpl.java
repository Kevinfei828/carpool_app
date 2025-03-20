package com.carpool.service.impl;

import com.carpool.Utils.UserThread;
import com.carpool.entity.Result;
import com.carpool.service.LogoutService;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class LogoutServiceImpl implements LogoutService {
    // logout時，清空redis和threadlocal儲存的token
    // 如user未重新登錄刷新token有效期，則redis會在expire時自動呼叫logout
    // user也可能手動logout

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    // MessageListenerAdapter 需要監聽的方法名稱默認是 handleMessage，且參數要符合規定
    public void handleMessage(String expiredKey) {
        logout(expiredKey);
    }

    public Result logout(String loginToken) {
//        UserThread.removeUser();
        stringRedisTemplate.delete(loginToken);  // key就算
        // 不存在也不會報錯，只會return 0
        return Result.success();
    }
}
