package com.carpool.Utils;

import java.util.concurrent.TimeUnit;

public class RedisUtils {
    public static final String LOGIN_PHONE_KEY = "login:phone:";
    public static final String LOGIN_USER_KEY = "login:user:";
    public static final String EVENT_KEY = "event:";
    public static final String CARPOOL_EVENT_KEY = "carpoolEvent:";
    public static final String EVENT_USER_KEY = "event_user:";
    public static final String CURRENT_AVAILABLE_SEAT_KEY = "currentAvailableSeat";
    public static final String EVENT_NAME_KEY = "name";
    public static final String SERIALIZED_EVENT_KEY = "serializedEvent";

    public static final String INITIATOR_KEY = "initiator";
    public static final String STARTTIME_KEY = "startTime";

    public final static long TIMEOUT = 100;
    public final static TimeUnit TIMEUNIT = TimeUnit.MINUTES;

    public final static long REDIS_SCAN_COUNT = 1000;
}
