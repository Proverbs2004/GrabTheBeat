package com.ygd.grab_the_beat.room.controller;

import com.ygd.grab_the_beat.config.response.BaseException;
import com.ygd.grab_the_beat.config.response.BaseResponse;
import com.ygd.grab_the_beat.room.request.RoomRequest;
import com.ygd.grab_the_beat.room.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public BaseResponse makeRoom() {
        return new BaseResponse(roomService.makeRoom());
    }

    @PostMapping("/join")
    public BaseResponse joinRoom(@RequestBody RoomRequest roomRequest) throws BaseException {
        return new BaseResponse(roomService.joinRoom(roomRequest.getCode()));
    }

    @PutMapping
    public BaseResponse exitRoom(@RequestBody RoomRequest roomRequest) throws BaseException {
        return new BaseResponse(roomService.exitRoom(roomRequest.getCode()));
    }

}