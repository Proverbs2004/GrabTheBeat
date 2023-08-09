import React, { useState } from 'react';

import Slider from "react-slick";
import { Carousel } from 'react-responsive-carousel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './MusicCard.css'

function MusicCard({ musicList }) {
    const [selectedMusic, setSelectedMusic] = useState(null); // Define selectedMusic state
  
    const handleMusicSelect = (music) => {
      setSelectedMusic(music); // Update the selectedMusic state when a music card is clicked
      let audio = new Audio(music.music_url);
      console.log(audio);
      console.log("여기야여기");
      audio.play().catch( e=>{  
        console.log(e)
        })
    };
  
    const CustomPrevArrow = ({ onClick }) => (
        <div className="slick-arrow custom-prev-arrow" onClick={onClick}>
          <FaArrowLeft />
        </div>
      );
    
      const CustomNextArrow = ({ onClick }) => (
        <div className="slick-arrow custom-next-arrow" onClick={onClick}>
          <FaArrowRight />
        </div>
      );
    

    return (
        <div className="sliderContainer">

<Slider
slidesToShow={1} // Show only 1 music card at a time.
infinite={true} // Disable infinite loop for the carousel.
arrows={true} // Show navigation arrows.
prevArrow={<CustomPrevArrow />}
nextArrow={<CustomNextArrow />}
className="musicCarousel" // Add a class to the Slider component for custom styling.
>
{musicList.map((music) => (
<div key={music.id} onClick={() => handleMusicSelect(music)}>
{/* You can create your own music card component here */}
<div className="musicCard">
<h3>{music.title}</h3>
<p>아티스트: {music.artist}</p>
{selectedMusic && (
<div>
</div>

)}
</div>
</div>
))}

</Slider>
</div>
    )
}

export default MusicCard;