package com.carpool.service.impl;

import com.carpool.MessageQueueConsumer.EventChatroomConsumer;
import com.carpool.Utils.ClassTransferUtils;
import com.carpool.Utils.RandomUtils;
import com.carpool.Utils.RedisUtils;
import com.carpool.entity.*;
import com.carpool.entity.DTO.*;
import com.carpool.mapper.ChatroomMapper;
import com.carpool.mapper.CityandLocationMapper;
import com.carpool.mapper.EventMapper;
import com.carpool.service.ChatroomService;
import com.carpool.service.EventService;
import com.carpool.service.NotificationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.PageHelper;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.carpool.Utils.GeneralUtils;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class EventServiceImpl implements EventService {
    private final EventMapper eventMapper;
    private final ObjectMapper objectMapper;
    private final CityandLocationMapper cityandLocationMapper;
    private final StringRedisTemplate stringRedisTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final EventChatroomConsumer rabbitMQConsumer;
    private final NotificationService notificationService;
    private final ChatroomService chatroomService;
    public EventServiceImpl(EventMapper eventMapper, ObjectMapper objectMapper,
                            CityandLocationMapper cityandLocationMapper, StringRedisTemplate stringRedisTemplate,
                            RabbitTemplate rabbitTemplate, EventChatroomConsumer rabbitMQConsumer,
                            NotificationService notificationService, ChatroomService chatroomService
                            ) {
        this.eventMapper = eventMapper;
        this.objectMapper = objectMapper;
        this.cityandLocationMapper = cityandLocationMapper;
        this.stringRedisTemplate = stringRedisTemplate;
        this.rabbitTemplate = rabbitTemplate;
        this.rabbitMQConsumer = rabbitMQConsumer;
        this.notificationService = notificationService;
        this.chatroomService = chatroomService;
    }

    @Override
    public List<Event> searchEventByCityAndLocation(EventSearchDTO searchEventDTO, String page, String pageSize) {
        String startCity = searchEventDTO.getStartCity();
        String endCity = searchEventDTO.getEndCity();
        String startLocation = searchEventDTO.getStartLocation();
        String endLocation = searchEventDTO.getEndLocation();
        Long startCityId = null, endCityId = null;

        if (startCity != null && !startCity.isEmpty()) {
            startCityId = eventMapper.searchCityIdsByName(startCity);
        }
        if (endCity != null && !endCity.isEmpty()) {
            endCityId = eventMapper.searchCityIdsByName(endCity);
        }
        Long[] startLocationIds = null, endLocationIds = null;
        if (startLocation != null && !startLocation.isEmpty()) {
//            log.info("startLocation: {}", (Object) startLocation);
            List<String> startLocationTokens = GeneralUtils.stringToTokenSplitter(startLocation, "");
//            log.info("startLocationTokens: {}", (Object) startLocationTokens);
            startLocationIds = eventMapper.searchLocationIdsByName(startLocationTokens);
        }
        if (endLocation != null && !endLocation.isEmpty()) {
            List<String> endLocationTokens = GeneralUtils.stringToTokenSplitter(endLocation, "");
            endLocationIds = eventMapper.searchLocationIdsByName(endLocationTokens);
        }

//        log.info("page: {}, pageSize: {}", page, pageSize);

        PageHelper.startPage(Integer.parseInt(page), Integer.parseInt(pageSize));

        // 測量查詢所需時間
        long startTime = System.nanoTime();
        List<Event> res = eventMapper.searchEventByCityAndLocationId(startCityId, endCityId, startLocationIds, endLocationIds, searchEventDTO.getStartTime());
        long endTime = System.nanoTime();
        log.info("searchEventByCityAndLocation: {} ms", (endTime - startTime)/Math.pow(10, 6));
        return res;
    }

    // TODO: 改從redis拿events
    @Override
    public List<Event> getAllEvents(Long userId) {
        return eventMapper.getAllEvents(userId);
    }

    @Override
    public Event getEvent(Long userId, Long eventId) {
        return eventMapper.getEvent(userId, eventId);
    }

    @Override
    public UserBasicInfoDTO[] getEventUser(Long eventId) {
        return eventMapper.getEventUser(eventId);
    }

    @Override
    public Result joinEvent(EventJoinDTO joinEventDTO) {
        Long eventId = joinEventDTO.getEventId();
        Long userId = joinEventDTO.getUserId();
        Integer attendantNumber = joinEventDTO.getAttendantNumber();
        String eventUserKey = RedisUtils.EVENT_USER_KEY + eventId + ":" + userId;
        String eventKey = RedisUtils.EVENT_KEY + eventId;

        if (stringRedisTemplate.hasKey(eventUserKey)) {
            return Result.error("此用戶已在共乘名單中!");
        }

        String availableSeatsStr = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY);
        Integer availableSeats = Integer.parseInt(availableSeatsStr);

        if (availableSeats < attendantNumber) {
            return Result.error("此共乘空位數量不足!");
        }
        Integer updatedAvailableSeats = availableSeats - attendantNumber;
        Long chatroomId = addUserToEvent(joinEventDTO, eventKey, eventUserKey, updatedAvailableSeats);

        return Result.success(chatroomId);
    }
    @Override
    public Result leaveEvent(EventLeaveDTO leaveEventDTO) {
        Long userId = leaveEventDTO.getUserId();
        Long eventId = leaveEventDTO.getEventId();
        String eventUserKey = RedisUtils.EVENT_USER_KEY + eventId + ":" + userId;

        if (!stringRedisTemplate.hasKey(eventUserKey)) {
            return Result.error("此用戶已不在共乘名單中!");
        }
        removeUserFromEvent(leaveEventDTO);
        return Result.success("成功離開共乘!");
    }
    @Override
    public Result dismissEvent(EventLeaveDTO dismissEventDTO) {
        dismissEventHelper(dismissEventDTO);
        return Result.success("成功解散共乘!");
    }
    @Override
    public Result updateEventByJoiner(CarpoolEvent updatedCarpoolEvent) {
        return updateCarpoolEventHelper(updatedCarpoolEvent);
    }
    @Override
    public Result updateEventByInitiator(Event updatedEvent) {
        // 如果updatedEvent的max_seat變少怎麼解決? 先防止此欄位被更改
        return updateEventHelper(updatedEvent);
    }

    @Override
    public Result completeEvent(EventCompleteDTO eventCompleteDTO) {
        completeEventHelper(eventCompleteDTO);
        return Result.success("成功結束共乘!");
    }

    @Override
    @Transactional
    // 同時更新mysql和redis
    public EventCreateReturnDTO createEvent(EventCreateDTO createdEvent) {
        Event event = new Event();
        User initiator = new User();
        Chatroom chatroom = new Chatroom();
        initiator.setId(createdEvent.getInitiatorId());
        event.setInitiator(initiator);
        event.setStartTime(createdEvent.getStartTime());
        event.setSelfDrive(createdEvent.isSelfDrive());

        if (createdEvent.getEventName() == null) {
            int randomEventnameLength = 10;
            String randomEventName = RandomUtils.generateRandomName(randomEventnameLength);
            createdEvent.setEventName(randomEventName);
        }
        event.setEventName(createdEvent.getEventName());

        // 如果city或location為新加入的，則先存到sql
        cityandLocationMapper.createCityIfNotExist(createdEvent.getStartCityName_cn());
        cityandLocationMapper.createCityIfNotExist(createdEvent.getEndCityName_cn());
        Long startCityId = cityandLocationMapper.getCityIdByName(createdEvent.getStartCityName_cn());
        Long endCityId = cityandLocationMapper.getCityIdByName(createdEvent.getEndCityName_cn());
        cityandLocationMapper.createLocationIfNotExist(createdEvent.getStartLocationName_cn(), startCityId);
        cityandLocationMapper.createLocationIfNotExist(createdEvent.getEndLocationName_cn(), endCityId);
        Long startLocationId = cityandLocationMapper.getLocationIdByNameAndCityId(createdEvent.getStartLocationName_cn(), startCityId);
        Long endLocationId = cityandLocationMapper.getLocationIdByNameAndCityId(createdEvent.getEndLocationName_cn(), endCityId);

        Location startLocation = new Location();
        startLocation.setId(startLocationId);
        startLocation.setName_cn(createdEvent.getStartLocationName_cn());
        event.setStartLocation(startLocation);

        City startCity = new City();
        startCity.setId(startCityId);
        startCity.setName_cn(createdEvent.getStartCityName_cn());
        event.setStartCity(startCity);

        Location endLocation = new Location();
        endLocation.setId(endLocationId);
        endLocation.setName_cn(createdEvent.getEndLocationName_cn());
        event.setEndLocation(endLocation);

        City endCity = new City();
        endCity.setId(endCityId);
        endCity.setName_cn(createdEvent.getEndCityName_cn());
        event.setEndCity(endCity);

        event.setMaxAvailableSeat(createdEvent.getMaxAvailableSeat());
        event.setCurrentAvailableSeat(createdEvent.getMaxAvailableSeat()); // Initial value

        // 更新event
        eventMapper.createEvent(event);

        Long eventId = event.getId();
        eventMapper.createCarpoolEvent(createdEvent.getInitiatorId(), eventId, createdEvent.getAttendantNumber(), createdEvent.getStartTime(), startLocationId, endLocationId);

        // 更新chatroom
        chatroom.setName(createdEvent.getEventName() + "的聊天室");
        chatroom.setEventChatroom(true);
        Long chatroomId = chatroomService.createEventChatroom(chatroom, createdEvent.getInitiatorId(), event.getId());

        // 緩存到redis
        cacheEventInRedis(event);

        // 開新的rabbitmq queue (event/chatroom通知 + 訊息)
        rabbitMQConsumer.createEventAndChatroomQueue(eventId, chatroom.getId());

        // 成功則回傳eventId + chatroomId
        EventCreateReturnDTO ret = new EventCreateReturnDTO();
        ret.setEventId(event.getId());
        ret.setChatroomId(chatroomId);
        return ret;
    }

    // helper
    @Transactional
    private Long addUserToEvent(EventJoinDTO joinEventDTO, String eventKey, String eventUserKey, Integer updatedAvailableSeats) {
        try {
            Long eventId = joinEventDTO.getEventId();
            Long userId = joinEventDTO.getUserId();
            // 檢查location有沒有在db，如沒有則創新的location
            Long getOnCityId = cityandLocationMapper.getCityIdByName(joinEventDTO.getGetOnCity());
            Long getOffCityId = cityandLocationMapper.getCityIdByName(joinEventDTO.getGetOffCity());

            cityandLocationMapper.createLocationIfNotExist(joinEventDTO.getGetOnLocation(), getOnCityId);
            cityandLocationMapper.createLocationIfNotExist(joinEventDTO.getGetOffLocation(), getOffCityId);
            Long getOnLocationId = cityandLocationMapper.getLocationIdByNameAndCityId(joinEventDTO.getGetOnLocation(), getOnCityId);
            Long getOffLocationId = cityandLocationMapper.getLocationIdByNameAndCityId(joinEventDTO.getGetOffLocation(), getOffCityId);

            // sql更新CarpoolEvent, Event.current_available_seat, user_chatroom
            eventMapper.createCarpoolEvent(userId, eventId, joinEventDTO.getAttendantNumber(), joinEventDTO.getGetOnTime(), getOnLocationId, getOffLocationId);
            CarpoolEvent updatedCarpoolEvent = eventMapper.searchCarpoolEventById(userId, eventId);
            eventMapper.updateAvailableSeat(updatedAvailableSeats, eventId);
            Long chatroomId = chatroomService.getChatroomIdByEventId(eventId);
            chatroomService.addUserToEventChatroom(userId, chatroomId);


            // redis更新event field, 序列化event, 序列化carpoolevent
            stringRedisTemplate
                    .opsForHash()
                    .put(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY, String.valueOf(updatedAvailableSeats));
            String serializedEvent = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.SERIALIZED_EVENT_KEY);
            Event event = objectMapper.readValue(serializedEvent, Event.class);
            event.setCurrentAvailableSeat(updatedAvailableSeats);
            String updatedSerializedEvent = objectMapper.writeValueAsString(event);
            stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.SERIALIZED_EVENT_KEY, updatedSerializedEvent);
            cacheCarpoolEventInRedis(updatedCarpoolEvent);
            stringRedisTemplate.opsForValue().set(eventUserKey, "1");

            // 存notification到db + 推訊息到notification queue
            // 發給event除自己外的所有人，可能不只1個
            // frontend在join成功後，要幫joiner訂閱chatroom + event notification queue
            List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "有新用戶加入共乘!");
            if (!allNotifications.isEmpty()) {
                notificationService.pushEventNotificationToQueue(eventId, allNotifications);
            }

            // 加入成功，則return chatroomId給前端subscribe
            return chatroomId;

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to update serialized event in Redis", e);
        }
    }

    @Transactional
    private void removeUserFromEvent(EventLeaveDTO leaveEventDTO) {
        try {
            Long eventId = leaveEventDTO.getEventId();
            Long userId = leaveEventDTO.getUserId();
            String eventKey = RedisUtils.EVENT_KEY + eventId;
            String carpoolEventKey = RedisUtils.CARPOOL_EVENT_KEY + userId;
            String eventUserKey = RedisUtils.EVENT_USER_KEY + eventId + ":" + userId;

            // 先去redis拿此user的attendant算更新後的空位
            String availableSeatsStr = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY);
            String carpoolEventStr = (String) stringRedisTemplate.opsForHash().get(eventKey, carpoolEventKey);
            CarpoolEvent carpoolEvent = objectMapper.readValue(carpoolEventStr, CarpoolEvent.class);
            Integer updatedAvailableSeats = Integer.parseInt(availableSeatsStr) + carpoolEvent.getAttendantNumber();
            String updatedAvailableSeatsStr = String.valueOf(updatedAvailableSeats);
            // 更新sql
            eventMapper.updateAvailableSeat(updatedAvailableSeats, eventId);
            eventMapper.leaveEvent(leaveEventDTO);
            Long chatroomId = chatroomService.getChatroomIdByEventId(eventId);
            chatroomService.removeUserFromEventChatroom(userId, chatroomId);

            // 更新redis (刪除對應的carpoolevent, 更新空位field, 更新序列化event, 刪除對應的eventUserKey)
            stringRedisTemplate.opsForHash().delete(eventKey, carpoolEventKey);
            stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY, updatedAvailableSeatsStr);
            String eventStr = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.SERIALIZED_EVENT_KEY);
            Event event = objectMapper.readValue(eventStr, Event.class);
            event.setCurrentAvailableSeat(updatedAvailableSeats);
            String updatedEvent = objectMapper.writeValueAsString(event);
            stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.SERIALIZED_EVENT_KEY, updatedEvent);
            stringRedisTemplate.delete(eventUserKey);  // 刪除value type的key用法

            // 推訊息到notification queue
            List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "有用戶離開共乘!");
            if (!allNotifications.isEmpty()) {
                notificationService.pushEventNotificationToQueue(eventId, allNotifications);
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to update serialized event in Redis", e);
        }
    }


    @Transactional
    private void dismissEventHelper(EventLeaveDTO dismissEventDTO) {
        Long userId = dismissEventDTO.getUserId();
        Long eventId = dismissEventDTO.getEventId();
        String eventKey = RedisUtils.EVENT_KEY + eventId;
        String eventUserKeyPattern = RedisUtils.EVENT_USER_KEY + eventId + ":*";

        // 更新sql (event + chatroom)
        eventMapper.dismissEvent(dismissEventDTO);
        Long chatroomId = chatroomService.getChatroomIdByEventId(eventId);
        chatroomService.closeChatroom(chatroomId);

        // 更新redis (刪除對應event hash table, 刪除event所有的eventUser)
        Set<String> keys = scanKeysByPattern(eventUserKeyPattern);
        keys.add(eventKey);
//        stringRedisTemplate.delete(eventKey);
        stringRedisTemplate.delete(keys);

        // 推訊息到notification queue
        List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "此共乘已被發起人解散!");
        if (!allNotifications.isEmpty()) {
            notificationService.pushEventNotificationToQueue(eventId, allNotifications);
        }
    }

    @Transactional
    private void completeEventHelper(EventCompleteDTO eventCompleteDTO) {
        Long userId = eventCompleteDTO.getUserId();
        Long eventId = eventCompleteDTO.getEventId();
        String eventKey = RedisUtils.EVENT_KEY + eventId;
        String eventUserKeyPattern = RedisUtils.EVENT_USER_KEY + eventId + ":*";

        // 更新sql (event + chatroom)
        eventMapper.completeEvent(eventCompleteDTO);
        Long chatroomId = chatroomService.getChatroomIdByEventId(eventId);
        chatroomService.closeChatroom(chatroomId);

        // 更新redis (刪除對應event hash table, 刪除event所有的eventUser)
        Set<String> keys = scanKeysByPattern(eventUserKeyPattern);
        keys.add(eventKey);
//        stringRedisTemplate.delete(eventKey);
        stringRedisTemplate.delete(keys);

        // 推訊息到notification queue
        List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "此共乘已完成!");
        if (!allNotifications.isEmpty()) {
            notificationService.pushEventNotificationToQueue(eventId, allNotifications);
        }
    }

    @Transactional
    private Result updateCarpoolEventHelper(CarpoolEvent updatedCarpoolEvent) {
        try {
            Long userId = updatedCarpoolEvent.getId().getUserId();
            Long eventId = updatedCarpoolEvent.getId().getEventId();
            String eventKey = RedisUtils.EVENT_KEY + eventId;
            String carpoolEventKey = RedisUtils.CARPOOL_EVENT_KEY + userId;

            // 檢查非法更改
            Integer updatedAttendantNumber = updatedCarpoolEvent.getAttendantNumber();
            if (updatedAttendantNumber != null) {
                String available_seats = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY);
                String carpoolEventStr = (String) stringRedisTemplate.opsForHash().get(eventKey, carpoolEventKey);
                CarpoolEvent carpoolEvent = objectMapper.readValue(carpoolEventStr, CarpoolEvent.class);
                Integer attendantNumber = carpoolEvent.getAttendantNumber();
                Integer updatedAvailableSeat = Integer.parseInt(available_seats) + attendantNumber - updatedAttendantNumber;
                if (updatedAvailableSeat < 0) {
                    return Result.error("人數超過共乘上限!");
                }

                String eventStr = (String) stringRedisTemplate.opsForHash().get(eventKey, RedisUtils.SERIALIZED_EVENT_KEY);
                Event event = objectMapper.readValue(eventStr, Event.class);
                event.setCurrentAvailableSeat(updatedAvailableSeat);
                String updatedEventStr = objectMapper.writeValueAsString(event);

                stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.SERIALIZED_EVENT_KEY, updatedEventStr);
                stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.CURRENT_AVAILABLE_SEAT_KEY, updatedAvailableSeat);
            }

            eventMapper.updateEventByJoiner(updatedCarpoolEvent);
            CarpoolEvent fullUpdatedCarpoolEvent = eventMapper.searchCarpoolEventById(userId, eventId);
            String fullUpdatedCarpoolEventStr = objectMapper.writeValueAsString(fullUpdatedCarpoolEvent);
            stringRedisTemplate.opsForHash().put(eventKey, carpoolEventKey, fullUpdatedCarpoolEventStr);

            // 推訊息到notification queue
            List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "用戶已更新資訊!");
            if (!allNotifications.isEmpty()) {
                notificationService.pushEventNotificationToQueue(eventId, allNotifications);
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to update serialized event in Redis", e);
        }

        return Result.success("成功更改共乘資料!");
    }

    @Transactional
    private Result updateEventHelper(Event updatedEvent) {
        try {
            Long userId = updatedEvent.getInitiator().getId();
            Long eventId = updatedEvent.getId();
            String eventKey = RedisUtils.EVENT_KEY + eventId;

            // 此功能尚未完成
            if (updatedEvent.getMaxAvailableSeat() != null) {
                return Result.error("暫不開放更改最大空位數!");
            }

            // 更新sql
            eventMapper.updateEventByInitiator(updatedEvent);

            // 更新redis
            Event event = eventMapper.searchEventById(eventId);
            stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.STARTTIME_KEY, event.getStartTime().toString());
            String eventStr = objectMapper.writeValueAsString(event);
            stringRedisTemplate.opsForHash().put(eventKey, RedisUtils.SERIALIZED_EVENT_KEY, eventStr);

            // 推訊息到notification queue
            List<Notification> allNotifications = storeEventNotificationToDB(userId, eventId, "發起人已更新共乘資訊!");
            if (!allNotifications.isEmpty()) {
                notificationService.pushEventNotificationToQueue(eventId, allNotifications);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to update serialized event in Redis", e);
        }
        return Result.success("成功更改共乘資料!");
    }


    private void cacheEventInRedis(Event event) {
        try {
            // id為新event id
            Long eventId = event.getId();
            Long userId = event.getInitiator().getId();
            String redisKey = RedisUtils.EVENT_KEY + eventId;
            String eventUserKey = RedisUtils.EVENT_USER_KEY + eventId + ":" + userId;

            // 存會用到的Event欄位方便快速查詢
            Map<String, String> eventMap = new HashMap<>();
            eventMap.put("id", String.valueOf(event.getId()));
            eventMap.put(RedisUtils.INITIATOR_KEY, String.valueOf(event.getInitiator().getId()));
            eventMap.put(RedisUtils.STARTTIME_KEY, event.getStartTime().toString());
            eventMap.put(RedisUtils.EVENT_NAME_KEY, event.getEventName());
//            eventMap.put("isSelfDrive", String.valueOf(event.isSelfDrive()));
//            eventMap.put("startLocation", String.valueOf(event.getStartLocation()));
//            eventMap.put("startCity", String.valueOf(event.getStartCity()));
//            eventMap.put("endLocation", String.valueOf(event.getEndLocation()));
//            eventMap.put("endCity", String.valueOf(event.getEndCity()));
//            eventMap.put("maxAvailableSeat", String.valueOf(event.getMaxAvailableSeat()));
            eventMap.put(RedisUtils.CURRENT_AVAILABLE_SEAT_KEY, String.valueOf(event.getCurrentAvailableSeat()));

            // 使用 ObjectMapper 将整个 Event 序列化为 JSON
            String serializedEvent = objectMapper.writeValueAsString(event);
            eventMap.put(RedisUtils.SERIALIZED_EVENT_KEY, serializedEvent);

            stringRedisTemplate.opsForHash().putAll(redisKey, eventMap);
            stringRedisTemplate.opsForValue().set(eventUserKey, "1");

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize Event object", e);
        }
    }

    private void cacheCarpoolEventInRedis(CarpoolEvent carpoolEvent) {
        try {
            String redisKey = RedisUtils.EVENT_KEY + carpoolEvent.getEvent().getId();
            String carpoolEventField = RedisUtils.CARPOOL_EVENT_KEY + carpoolEvent.getAttendant().getId();
            String serializedCarpoolEvent = objectMapper.writeValueAsString(carpoolEvent);
            stringRedisTemplate.opsForHash().put(redisKey, carpoolEventField, serializedCarpoolEvent);
        } catch (JsonProcessingException  e) {
            throw new RuntimeException("Failed to serialize CarpoolEvent object", e);
        }
    }

    // 不保證把所有符合pattern的keys都找出來
    private Set<String> scanKeysByPattern(String pattern) {
        Set<String> keys = new HashSet<>();
        try(Cursor<String> cursor = stringRedisTemplate.scan(ScanOptions.scanOptions().match(pattern).count(RedisUtils.REDIS_SCAN_COUNT).build())){
            cursor.forEachRemaining(keys::add);
        }
        return keys;
    }

    @Transactional
    private List<Notification> storeEventNotificationToDB(Long userId, Long eventId, String content) {
        List<Long> eventUserIds = eventMapper.searchAllUserIdInEvent(eventId);
        List<Notification> notifications = new ArrayList<>();
        for (Long id: eventUserIds) {
            if (!Objects.equals(userId, id)) {
                Notification notification = new Notification();
                notification.setCreateTime(LocalDateTime.now());
                notification.setContent(content);
                User u = new User();
                u.setId(id);
                notification.setReceiver(u);
                notification.setType(1);
                notification.setRead(false);
                notificationService.createNotification(notification);
                notifications.add(notification);
            }
        }
        return notifications;
    }


}
