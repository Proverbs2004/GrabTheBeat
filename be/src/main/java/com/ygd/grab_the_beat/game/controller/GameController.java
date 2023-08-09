package com.ygd.grab_the_beat.game.controller;

import com.ygd.grab_the_beat.config.response.BaseResponse;
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
    public BaseResponse startGame(@PathVariable int roomId) {
        return new BaseResponse(gameService.startGame(roomId));
    }

    @PostMapping ("/end/{roomId}")
    public BaseResponse endGame(@PathVariable int roomId, @RequestBody GameEndRequest gameEndRequest) {
        return new BaseResponse(gameService.endGame(roomId, gameEndRequest));
    }
}
