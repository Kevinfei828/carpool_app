package com.carpool.mapper;

import com.carpool.entity.CarpoolEvent;
import com.carpool.entity.DTO.*;
import com.carpool.entity.Event;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Mapper
public interface EventMapper {

    List<Event> searchEventByCityAndLocationId(Long startCityId, Long endCityId, Long[] startLocationIds, Long[] endLocationIds, LocalDateTime startTime);

    Long[] searchLocationIdsByName(List<String> tokens);

    List<Event> getAllEvents(Long userId);
    Event getEvent(Long userId, Long eventId);

    UserBasicInfoDTO[] getEventUser(Long eventId);

    @Select("select id from city where name_cn = #{name}")
    Long searchCityIdsByName(String name);

    @Insert("insert into carpool_event (attendant_id, event_id, attendant_number, get_on_time, get_on_location, get_off_location)" +
            "values (#{userId}, #{eventId}, #{attendantNumber}, #{getOnTime}, #{getOnLocationId}, #{getOffLocationId})")
    void createCarpoolEvent(Long userId, Long eventId, Integer attendantNumber, LocalDateTime getOnTime, Long getOnLocationId, Long getOffLocationId);


    @Delete("delete from carpool_event where attendant_id = #{userId} and event_id = #{eventId}")
    void leaveEvent(EventLeaveDTO leaveEventDTO);

//    @Delete("delete from Event where id = #{eventId}")
//    void dismissEvent(EventLeaveDTO dismissEventDTO);

    @Update("update Event set is_dismissed = true where id = #{eventId}")
    void dismissEvent(EventLeaveDTO dismissEventDTO);

    void updateEventByJoiner(CarpoolEvent updatedEvent);

    Event updateEventByInitiator(Event updatedEvent);

    void createEvent(Event createdEvent);

    // helper
    @Update("update Event set current_available_seat = #{available_seat} where id = #{eventId}")
    void updateAvailableSeat(Integer available_seat, Long eventId);

    @Update("update Event set is_completed = true where id = #{eventId}")
    void markEventAsCompleted(Long eventId);

    CarpoolEvent searchCarpoolEventById(Long userId, Long eventId);

    Event searchEventById(Long eventId);

    @Update("update Event set is_completed = true where id = #{eventId}")
    void completeEvent(EventCompleteDTO eventCompleteDTO);

    @Select("select attendant_id from carpool_event where event_id = #{eventId}")
    List<Long> searchAllUserIdInEvent(Long eventId);

}
