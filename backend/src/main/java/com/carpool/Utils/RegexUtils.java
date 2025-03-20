package com.carpool.Utils;

import java.util.regex.Pattern;

public class RegexUtils {
    private final static String phoneRegex = "^(09\\d{8}|\\+8869\\d{8})$";  // java用"\\"代表"\", "\d"為數字0-9
    public static boolean isPhoneValid(String phone) {
        return Pattern.matches(phoneRegex, phone);
    }
}
