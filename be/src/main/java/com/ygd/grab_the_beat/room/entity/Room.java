package com.ygd.grab_the_beat.room.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "room")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private int roomId;

    @Column(name = "code", length = 6)
    private String code;

    @Column(name = "player_count")
    private int playerCount;

    @Column(name = "alive")
    private boolean alive;

    @Column(name = "playing")
    private boolean playing;

}