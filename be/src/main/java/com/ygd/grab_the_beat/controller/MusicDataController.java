package com.ygd.grab_the_beat.controller;


import com.ygd.grab_the_beat.domain.MusicData;
import com.ygd.grab_the_beat.service.MusicDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class MusicDataController {

    private final MusicDataService musicDataService;

    @GetMapping("/musics/{title}")
    public ResponseEntity<MusicData> getMusicDataByTitle(@PathVariable String title) {

        log.info("[controller] /musics/title music data title {} called", title);

        return new ResponseEntity<>(musicDataService.getMusicDataByTitle(title), HttpStatus.OK);
    }

    @GetMapping("/musics")
    public ResponseEntity<List<MusicData>> getAllMusicData() {
        log.info("[controller] /musics all music data called");
        return new ResponseEntity<>(musicDataService.getAllMusicData(), HttpStatus.OK);
    }
}
