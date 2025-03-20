package com.carpool.Interceptor;

import com.carpool.Utils.UserThread;
import com.carpool.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (UserThread.getUser() == null && !request.getMethod().equals("OPTIONS")) {
            response.setStatus(401);
            return false;
        }
        // 每個api request都可能為不同的thread
        // 通過login驗證的thread和logout的thread可能不一樣
        // 每個thread通過驗證後都要直接清空threadlocal，否則可能產生logout後還可以用其他沒清threadlocal的thread存取api的問題
        // 如果除登入外的所有頁面都需要token，則可以設一個interceptor就好，此時就不用threadlocal處理登入問題
        UserThread.removeUser();
        return true;
    }
}
