package com.carpool.controller;

import com.carpool.entity.Chatroom;
import com.carpool.entity.DTO.DirectChatroomCreateDTO;
import com.carpool.entity.Result;
import com.carpool.service.ChatroomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatroom")
public class ChatroomController {
    private final ChatroomService chatroomService;

    public ChatroomController(ChatroomService chatroomService) {
        this.chatroomService = chatroomService;
    }

    // 發陌生訊息時call此API
    @PostMapping("/create")
    public Result createDirectChatroom(@RequestBody DirectChatroomCreateDTO chatroomDTO) {
        Long chatroomId = chatroomService.createDirectChatroom(chatroomDTO);
        return Result.success(chatroomId);
    }

    // user進chatroom要call這三個apis
    // TODO: 能否用redis或其他方法改善效能?
    @GetMapping("/users")
    public Result getChatroomUsersInfo(@RequestParam Long eventId) {
        return Result.success(chatroomService.getChatroomUsersInfo(eventId));
    }

    @GetMapping("")
    public Result getChatroomInfo(@RequestParam Long eventId) {
        return Result.success(chatroomService.getChatroomInfo(eventId));
    }

    // TODO: 能否改成一次抓固定條messages?
    @GetMapping("/message")
    public Result getMessagesInChatroom(@RequestParam Long eventId) {
        return Result.success(chatroomService.getMessagesInChatroom(eventId));
    }

//    @GetMapping
//    public List<Chatroom> getAllChatrooms() {
//        return chatroomService.getAllChatrooms();
//    }

    @PutMapping("/{id}")
    public void updateChatroom(@PathVariable Long id, @RequestBody Chatroom chatroom) {
        chatroom.setId(id);
        chatroomService.updateChatroom(chatroom);
    }

    @DeleteMapping("/{id}")
    public void deleteChatroom(@PathVariable Long id) {
        chatroomService.deleteChatroom(id);
    }


    @GetMapping("/all")
    public Result getAllChatroomsId(@RequestParam Long userId) {
        return Result.success(chatroomService.getAllChatrooms(userId));
    }
}
