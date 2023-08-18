package com.ygd.grab_the_beat.game.repository;

import com.ygd.grab_the_beat.game.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecordRepository extends JpaRepository<Record, Integer> {

}
