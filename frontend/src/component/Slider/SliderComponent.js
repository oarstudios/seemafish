import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderComponent.css";

const SliderComponent = () => {
  const [creatives, setCreatives] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://backend.freshimeat.in/creatives`);
      const json = await response.json();

      if (response.ok) {
        console.log(json);
        setCreatives(json?.data);
      } else {
        console.error("Failed to fetch creatives:", json);
      }
    } catch (error) {
      console.error("Error fetching creatives:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const updateImages = () => {
      const isMobile = window.innerWidth <= 480;
      const filteredImages = creatives.filter(item =>
        isMobile ? item.tag === "mobile" : item.tag === "desktop"
      );
      setCurrentImages(filteredImages);
    };

    updateImages(); // Set initial images
    window.addEventListener("resize", updateImages);

    return () => {
      window.removeEventListener("resize", updateImages);
    };
  }, [creatives]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {currentImages.map((image) => (
          <div className="slide" key={image._id}>
            <img
              src={`https://backend.freshimeat.in/uploads/${image.media}`} 
              alt="Creative Banner"
              className="slider-image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
