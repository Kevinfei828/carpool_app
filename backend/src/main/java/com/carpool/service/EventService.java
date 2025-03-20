package com.carpool.service;

import com.carpool.entity.CarpoolEvent;
import com.carpool.entity.DTO.*;
import com.carpool.entity.Event;
import com.carpool.entity.Result;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EventService {
//    List<Event> findIncompleteEvents();
    List<Event> searchEventByCityAndLocation(EventSearchDTO searchEventDTO, String page, String pageSize);
    List<Event> getAllEvents(Long userId);
    Event getEvent(Long userId, Long eventId);

    UserBasicInfoDTO[] getEventUser(Long eventId);

    Result joinEvent(EventJoinDTO joinEventDTO);
    Result leaveEvent(EventLeaveDTO leaveEventDTO);
    Result dismissEvent(EventLeaveDTO dismissEventDTO);
    Result updateEventByJoiner(CarpoolEvent updatedEvent);
    Result updateEventByInitiator(Event updatedEvent);
    EventCreateReturnDTO createEvent(EventCreateDTO createdEvent);
    Result completeEvent(EventCompleteDTO eventCompleteDTO);

}
