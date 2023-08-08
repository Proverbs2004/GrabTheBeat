package com.ygd.grab_the_beat.room.service;

import com.ygd.grab_the_beat.config.response.BaseException;
import com.ygd.grab_the_beat.config.response.BaseStatus;
import com.ygd.grab_the_beat.room.entity.Room;
import com.ygd.grab_the_beat.room.enums.RoomStatus;
import com.ygd.grab_the_beat.room.repository.RoomRepository;
import com.ygd.grab_the_beat.util.RandomCodeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final int MAX_PARTICIPANTS = 4;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    private RoomStatus getRoomStatus(String code) {
        Room room = roomRepository.getByCode(code);

        if (room == null || !room.isAlive()) {
            return RoomStatus.EMPTY;
        }
        if (room.isPlaying()) {
            return RoomStatus.PLAYING;
        }
        if (room.getPlayerCount() >= MAX_PARTICIPANTS) {
            return RoomStatus.FULL;
        }
        return RoomStatus.AVAILABLE;
    }

    @Transactional
    public String makeRoom() {
        // 랜덤 방 코드 생성
        String code = RandomCodeUtil.makeRandomCode();
        while(getRoomStatus(code) != RoomStatus.EMPTY) {
            code = RandomCodeUtil.makeRandomCode();
        }

        // 방 저장
        Room room = Room.builder()
                .code(code)
                .playerCount(1)
                .alive(true)
                .playing(false)
                .build();
        roomRepository.save(room);

        return code;
    }

    @Transactional
    public int joinRoom(String code) throws BaseException {
        RoomStatus roomStatus = getRoomStatus(code);

        if (roomStatus == RoomStatus.EMPTY) {
            // 아직 없는 방에 들어가려 함 -> 거절
            throw new BaseException(BaseStatus.ROOM_IS_EMPTY);
        }
        if (roomStatus == RoomStatus.FULL) {
            // 사람이 가득 찼을 때 -> 거절
            throw new BaseException(BaseStatus.ROOM_IS_FULL);
        }
        if (roomStatus == RoomStatus.PLAYING) {
            // 방이 게임 중일 때 -> 거절
            throw new BaseException(BaseStatus.ROOM_IS_PLAYING);
        }

        roomRepository.incrementPlayerCountByCode(code);

        return roomRepository.getPlayerCountByCode(code);
    }

    public int exitRoom(String code) throws BaseException {
        RoomStatus roomStatus = getRoomStatus(code);

        if (roomStatus == RoomStatus.EMPTY) {
            // 존재하지도 않는 방을 나가려 함 -> 거절
            throw new BaseException(BaseStatus.ROOM_IS_EMPTY);
        }

        roomRepository.decrementPlayerCountByCode(code);
        int playerCount = roomRepository.getPlayerCountByCode(code);

        if (playerCount <= 0) {
            roomRepository.updateAliveToFalseByCode(code);
        }

        return roomRepository.getPlayerCountByCode(code);
    }
}
