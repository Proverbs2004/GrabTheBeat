import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { FaAngleLeft, FaArrowRight } from 'react-icons/fa';
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg';
import './MusicCard.css';

function MusicCard({ musicList, selectedMusic, handleMusicSelect }) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // Initialize with 0 or the appropriate value
    const canPlayMusic = useRef(false);

    const [hidden, setHidden] = useState(false);
    
    const audioElementRef = useRef(new Audio(selectedMusic.music_url));


    const handleClick = () => {
        audioElementRef.current.volume=0.4;
        audioElementRef.current.play();
        setHidden(true);
    };
    const divStyle = {
        justifyContent: 'center',  
        fontSize: 'xxx-large',
        width: 450,
        height: 380,
        position: 'absolute',
        backgroundColor: 'black',
        opacity: 0.8,
        zIndex: 3,
        display: hidden ? 'none' : 'flex',
        alignItems: 'center',
      };

    useEffect(() => {

        audioElementRef.current.pause();
        audioElementRef.current.src = selectedMusic.music_url;
        
        if(hidden){
            audioElementRef.current.volume=0.4;
            audioElementRef.current.play();
        }

        return () => {
            audioElementRef.current.pause();
        };

    }, [selectedMusic]);

    
    function CustomPrevArrow ({ onClick }){
        let idx=musicList.length-1;
        if(currentSlideIndex!==0)idx=currentSlideIndex-1;

        return(
            <div className="slick-arrow custom-prev-arrow" onClick={() => {
                handleMusicSelect(musicList[idx]);
                onClick();}}>
                <CgChevronDoubleLeft />
            </div>
        )
    };



    function CustomNextArrow ({ onClick }){
        let idx=0;
        if(currentSlideIndex!==musicList.length-1)idx=currentSlideIndex+1;

        return(
            <div className="slick-arrow custom-next-arrow" onClick={() => {
                handleMusicSelect(musicList[idx]);
                onClick();}}>
                <CgChevronDoubleRight />
            </div>
        )
    };





    try{
        console.log(selectedMusic.id);

    }   catch{

    }
    return (
        <>
        <div className="sliderContainer">
        <div style={divStyle} onClick={handleClick}>CLICK?</div>

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
                            <h2>{music.title}</h2>
                            <p>Artist: {music.artist}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
        </>
    )
}

export default MusicCard;
