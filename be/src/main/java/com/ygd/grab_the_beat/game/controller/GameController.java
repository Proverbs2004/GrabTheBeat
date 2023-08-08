package com.ygd.grab_the_beat.game.controller;

import com.ygd.grab_the_beat.game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    @PutMapping("/start")
    public void startGame(@RequestParam int roomId) {
        gameService.startGame(roomId);
    }

    @PostMapping ("/end")
    public void endGame(@RequestParam int roomId) {
        gameService.endGame(roomId);
    }
}
