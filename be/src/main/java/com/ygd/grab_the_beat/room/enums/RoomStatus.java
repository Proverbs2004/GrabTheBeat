package com.ygd.grab_the_beat.room.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum RoomStatus {

    EMPTY(0),
    AVAILABLE(1),
    FULL(2),
    PLAYING(3);

    private final int value;

}