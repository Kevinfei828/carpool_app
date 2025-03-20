package com.carpool.Utils;

public class RabbitMQUtils {
    public static final String CHATROOM_MESSAGE_PREFIX = "chatroom.message";    // + {chatroomId}
    public static final String CHATROOM_NOTIFICATION_PREFIX = "chatroom.notification";  // + {chatroomId}
    public static final String EVENT_NOTIFICATION_PREFIX = "event.notification";     // + {eventId}
    public static final String DM_MESSAGE_PREFIX = "dm.message";
    public static final String DM_NOTIFICATION_PREFIX = "dm.notification";
    public static final String USER_PREFIX = "user";
    public static final String EXCHANGE_NAME = "carpoolApp.exchange";
}
