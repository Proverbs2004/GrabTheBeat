package com.ygd.grab_the_beat.game.request;

import lombok.Data;

@Data
public class GameEndRequest {

    Long userId;
    String musicTitle;
    int perfectCount;
    int goodCount;
    int missCount;
    int maxCombo;
    int score;
}
