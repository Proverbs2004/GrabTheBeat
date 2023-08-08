package com.ygd.grab_the_beat.game.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GameEndResponse {

    int userId;
    String musicTitle;
    int perfectCount;
    int goodCount;
    int missCount;
    int maxCombo;
}
