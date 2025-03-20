package com.carpool.Utils;

import java.security.SecureRandom;
import java.util.Random;

public class RandomUtils {
    public static String generateVerifyCode(int length) {  // 生成6位數驗證碼
        Random random = new Random();
        StringBuilder randomNumber = new StringBuilder();
        for (int i = 0; i < length; i++) {
            randomNumber.append(random.nextInt(10));
        }
        return randomNumber.toString();
    }
    public static String generateRandomName(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder name = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < length; i++) {
            int idx = random.nextInt(characters.length());
            name.append(characters.charAt(idx));
        }
        return name.toString();

    }
}
