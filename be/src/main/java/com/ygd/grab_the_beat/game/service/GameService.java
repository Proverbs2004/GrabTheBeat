package com.ygd.grab_the_beat.game.service;

import com.ygd.grab_the_beat.game.entity.Record;
import com.ygd.grab_the_beat.game.repository.RecordRepository;
import com.ygd.grab_the_beat.game.request.GameEndRequest;
import com.ygd.grab_the_beat.game.response.GameEndResponse;
import com.ygd.grab_the_beat.room.entity.Room;
import com.ygd.grab_the_beat.room.repository.RoomRepository;
import com.ygd.grab_the_beat.user.entity.User;
import com.ygd.grab_the_beat.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class GameService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final RecordRepository recordRepository;

    @Transactional
    public int startGame(int roomId) {

        Room room = roomRepository.findByRoomId(roomId);
        room.setPlaying(true);
        return room.getRoomId();
    }

    @Transactional
    public Record endGame(int roomId, GameEndRequest gameEndRequest) {
        Room room = roomRepository.findByRoomId(roomId);
        room.setPlaying(false);

        User user = userRepository.findByUserId(gameEndRequest.getUserId());

        Record record = Record.builder()
                .user(user)
                .musicTitle(gameEndRequest.getMusicTitle())
                .perfectCount(gameEndRequest.getPerfectCount())
                .goodCount(gameEndRequest.getGoodCount())
                .missCount(gameEndRequest.getMissCount())
                .maxCombo(gameEndRequest.getMaxCombo())
                .score(gameEndRequest.getScore())
                .build();

        return recordRepository.save(record);

    }
}
