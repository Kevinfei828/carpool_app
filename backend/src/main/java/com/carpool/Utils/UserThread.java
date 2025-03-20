package com.carpool.Utils;
import com.carpool.entity.DTO.UserBasicInfoDTO;

public class UserThread {
    private static final ThreadLocal<UserBasicInfoDTO> tl = new ThreadLocal<UserBasicInfoDTO>();
    public static void saveUser(UserBasicInfoDTO userId) {
        tl.set(userId);
    }
    public static UserBasicInfoDTO getUser() {
        return tl.get();
    }
    public static void removeUser() {
        tl.remove();
    }
}
