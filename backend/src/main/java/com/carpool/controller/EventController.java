package com.carpool.controller;

import com.carpool.entity.CarpoolEvent;
import com.carpool.entity.DTO.*;
import com.carpool.entity.Event;
import com.carpool.entity.Result;
import com.carpool.service.EventService;
import com.carpool.service.impl.EventServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/event")
public class EventController {
    private final EventService eventService;
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/search")
    public Result searchEvents(@RequestParam(name = "startCity", required = false) String startCity,
                               @RequestParam(name = "endCity", required = false) String endCity,
                               @RequestParam(name = "startLocation", required = false) String startLocation,
                               @RequestParam(name = "endLocation", required = false) String endLocation,
                               @RequestParam(name = "startTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") LocalDateTime startTime,
                               @RequestParam(name = "page", defaultValue = "1") String page,
                               @RequestParam(name = "pageSize", defaultValue = "10") String pageSize) {
        EventSearchDTO eventSearchDTO = new EventSearchDTO();
        eventSearchDTO.setStartCity(startCity);
        eventSearchDTO.setEndCity(endCity);
        eventSearchDTO.setStartLocation(startLocation);
        eventSearchDTO.setEndLocation(endLocation);
        eventSearchDTO.setStartTime(startTime);

        return Result.success(eventService.searchEventByCityAndLocation(eventSearchDTO, page, pageSize));
    }

    @GetMapping("/list")
    public Result getAllEvents(@RequestParam Long userId, @RequestParam(required = false) Long eventId) {
        if (eventId == null) {
            return Result.success(eventService.getAllEvents(userId));
        }
        return Result.success(eventService.getEvent(userId, eventId));
    }

    @GetMapping("/list/user")
    public Result getEventUser(@RequestParam Long eventId) {
        return Result.success(eventService.getEventUser(eventId));
    }


    @PostMapping("/join")
    public Result joinEvent(@RequestBody EventJoinDTO eventJoinDTO) {
        return eventService.joinEvent(eventJoinDTO);
    }

    @DeleteMapping("/leave")
    public Result leaveEvent(@RequestBody EventLeaveDTO eventLeaveDTO) {
        return eventService.leaveEvent(eventLeaveDTO);
    }

    @PostMapping("/dismiss")
    public Result dismissEvent(@RequestBody EventLeaveDTO eventLeaveDTO) {
        return eventService.dismissEvent(eventLeaveDTO);
    }

    @PutMapping("/update/joiner")
    public Result updateEventByJoiner(@RequestBody CarpoolEvent updatedCarpoolEvent) {
        return Result.success(eventService.updateEventByJoiner(updatedCarpoolEvent));
    }

    @PutMapping("/update/initiator")
    public Result updateEventByInitiator(@RequestBody Event updatedEvent) {
        return Result.success(eventService.updateEventByInitiator(updatedEvent));
    }

    @PostMapping("/create")
    public Result createEvent(@RequestBody EventCreateDTO createdEvent) {
         return Result.success(eventService.createEvent(createdEvent));
    }

    @PutMapping("/complete")
    public Result completeEvent(@RequestBody EventCompleteDTO eventCompleteDTO) {
        return eventService.completeEvent(eventCompleteDTO);
    }


}
