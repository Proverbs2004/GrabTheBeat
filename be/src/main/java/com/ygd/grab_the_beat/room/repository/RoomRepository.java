package com.ygd.grab_the_beat.room.repository;

import com.ygd.grab_the_beat.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

    Room findByRoomId(int roomId);

    Room getByCode(String code);

    @Query("SELECT r.playerCount FROM Room r WHERE r.code = :code")
    int getPlayerCountByCode(String code);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.playerCount = r.playerCount + 1 WHERE r.code = :code")
    int incrementPlayerCountByCode(String code);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.playerCount = r.playerCount - 1 WHERE r.code = :code")
    int decrementPlayerCountByCode(String code);

    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.alive = false WHERE r.code = :code")
    void updateAliveToFalseByCode(String code);
}
