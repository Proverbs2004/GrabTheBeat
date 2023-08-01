package com.ygd.grab_the_beat.service;

import com.ygd.grab_the_beat.domain.MusicData;
import com.ygd.grab_the_beat.repository.MusicDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class MusicDataService {

    private final MusicDataRepository musicDataRepository;

    public MusicData getMusicDataByTitle(String title) {

        MusicData searchedMusic = musicDataRepository.findByTitle(title);

        try {
            if (musicDataRepository.findByTitle(title) == null) {
                log.info("[service] music data title {} not exists", title);
                return null;
            } else {
                log.info("[service] music data title {} exists", title);
                return searchedMusic;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<MusicData> getAllMusicData() {
        List<MusicData> musics = musicDataRepository.findAll();
        log.info("[service] all music data called");
        return musics;
    }
}
