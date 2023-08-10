import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './MusicCard.css';

function MusicCard({ musicList, selectedMusic, handleMusicSelect }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Initialize with 0 or the appropriate value


    useEffect(() => {
        if (selectedMusic) {
            const audioElement = new Audio(selectedMusic.music_url);
            audioElement.volume=0.1;
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
    try{
        console.log(selectedMusic.id);

    }   catch{

    }
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
                            <p>Artist: {music.artist}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default MusicCard;
