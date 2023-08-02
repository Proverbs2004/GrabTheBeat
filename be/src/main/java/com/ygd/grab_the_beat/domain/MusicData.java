//package com.ygd.grab_the_beat.domain;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//import java.util.List;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Document(collection = "music_note")
//public class MusicData {
//
//    @Id
//    private String id;
//
//    private int nbCircles;
//    private int nbSliders;
//    private List<TimingPoint> timingPoints;
//    private List<BreakTime> breakTimes;
//    private List<HitObject> hitObjects;
//
//    private String audioFilename;
//    private String title;
//    private String artist;
//    private String circleSize;
//    private String overallDifficulty;
//    private int bpmMin;
//    private int bpmMax;
//    private int maxCombo;
//    private int totalTime;
//
//    @Data
//    private static class TimingPoint {
//        private int offset;
//        private double beatLength;
//        private double velocity;
//        private int bpm;
//    }
//
//    @Data
//    private static class BreakTime {
//        private int startTime;
//        private int endTime;
//    }
//
//    @Data
//    private static class HitObject {
//        private int startTime;
//        private boolean newCombo;
//        private List<Integer> position;
//        private String objectName;
//        private Object additions;
//
//    }
//}