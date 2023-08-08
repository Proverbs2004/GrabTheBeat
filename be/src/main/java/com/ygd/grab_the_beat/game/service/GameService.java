package com.ygd.grab_the_beat.game.service;

import com.ygd.grab_the_beat.room.entity.Room;
import com.ygd.grab_the_beat.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@RequiredArgsConstructor
@Service
public class GameService {

    private final RoomRepository roomRepository;

    @Transactional
    public void startGame(int roomId) {

        Room room = roomRepository.findByRoomId(roomId);
        room.setPlaying(true);
    }

    @Transactional
    public void endGame(int roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        room.setPlaying(false);
    }
}
