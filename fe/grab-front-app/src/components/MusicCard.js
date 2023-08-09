import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './MusicCard.css';

function MusicCard({ musicList }) {
    const [selectedMusic, setSelectedMusic] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Initialize with 0 or the appropriate value

    const handleMusicSelect = (music) => {
        setSelectedMusic(music);
    };

    useEffect(() => {
        if (selectedMusic) {
            const audioElement = new Audio(selectedMusic.music_url);
            audioElement.play();

            return () => {
                audioElement.pause();
            };
        }
    }, [selectedMusic]);

    const CustomPrevArrow = ({ onClick }) => (
        <div className="slick-arrow custom-prev-arrow" onClick={() => {
          handleMusicSelect(musicList[currentSlideIndex - 1]);
          onClick();
      }}>
            <FaArrowLeft />
        </div>
    );

    const CustomNextArrow = ({ onClick }) => (
        <div className="slick-arrow custom-next-arrow" onClick={() => {
            handleMusicSelect(musicList[currentSlideIndex + 1]);
            onClick();
        }}>
            <FaArrowRight />
        </div>
    );

    return (
        <div className="sliderContainer">
            <Slider
                slidesToShow={1}
                infinite={true}
                arrows={true}
                prevArrow={<CustomPrevArrow />}
                nextArrow={<CustomNextArrow />}
                className="musicCarousel"
                beforeChange={(oldIndex, newIndex) => {
                    setCurrentSlideIndex(newIndex);
                }}
            >
                {musicList.map((music) => (
                    <div key={music.id} onClick={() => handleMusicSelect(music)}>
                        <div className="musicCard">
                 
                                <img className="musicCardBackground" alt="noImage" src={music.pic_url} />
                            <h3>{music.title}</h3>
                            <p>아티스트: {music.artist}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default MusicCard;
