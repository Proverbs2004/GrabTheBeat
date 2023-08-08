package com.ygd.grab_the_beat.room.controller;

import com.ygd.grab_the_beat.room.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity makeRoom() {
        String code = roomService.makeRoom();

        return ResponseEntity.ok(code);
    }

    @PostMapping("/join")
    public ResponseEntity joinRoom(@RequestBody String code) {
        roomService.joinRoom(code);

        return ResponseEntity.ok(code);
    }

    @PutMapping
    public ResponseEntity exitRoom(@RequestBody String code) {
        roomService.exitRoom(code);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}