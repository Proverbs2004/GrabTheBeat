package com.ygd.grab_the_beat.game.entity;

import com.ygd.grab_the_beat.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    @Column(name = "perfect_count")
    private Integer perfectCount;

    @Column(name = "good_count")
    private Integer goodCount;

    @Column(name = "miss_count")
    private Integer missCount;

    @Column(name = "max_combo")
    private Integer maxCombo;

    @Column(name = "score")
    private Integer score;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;
}
