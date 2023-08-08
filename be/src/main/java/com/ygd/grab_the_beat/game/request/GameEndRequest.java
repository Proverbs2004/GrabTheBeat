package com.ygd.grab_the_beat.game.request;

import lombok.Getter;

@Getter
public class GameEndRequest {


    String musicTitle;
    int perfectCount;
    int goodCount;
    int missCount;
    int maxCombo;
}
