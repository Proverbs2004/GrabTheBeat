package com.ygd.grab_the_beat.room.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "room")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @Column(name = "code", length = 6)
    private String code;

    @Column(name = "player_count")
    private int playerCount;

    @Column(name = "alive")
    private boolean alive;

    @Column(name = "playing")
    private boolean playing;

}