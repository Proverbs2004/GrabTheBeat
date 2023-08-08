package com.ygd.grab_the_beat.game.controller;

import com.ygd.grab_the_beat.game.entity.Record;
import com.ygd.grab_the_beat.game.request.GameEndRequest;
import com.ygd.grab_the_beat.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    @PatchMapping("/start/{roomId}")
    public ResponseEntity<Integer> startGame(@PathVariable int roomId) {
        return ResponseEntity.ok().body(gameService.startGame(roomId));
    }

    @PostMapping ("/end/{roomId}")
    public ResponseEntity<Record> endGame(@PathVariable int roomId, @RequestBody GameEndRequest gameEndRequest) {
        return ResponseEntity.ok(gameService.endGame(roomId, gameEndRequest));
    }
}
