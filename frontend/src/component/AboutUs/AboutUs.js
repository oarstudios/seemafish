import React, { useState, useEffect, useMemo } from "react";
import "./AboutUs.css";

import aboutUsDesktop from "../../assets/about.png"; 
import aboutUsTablet from "../../assets/about.png"; 
import aboutUsMobile from "../../assets/aboutusmobile.png"; 

export default function AboutUs() {
  const [imageSrc, setImageSrc] = useState(aboutUsDesktop);

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 480) {
        setImageSrc(aboutUsMobile);
      } else if (window.innerWidth <= 768) {
        setImageSrc(aboutUsTablet);
      } else {
        setImageSrc(aboutUsDesktop);
      }
    };

    updateImage();
    window.addEventListener("resize", updateImage);

    return () => {
      window.removeEventListener("resize", updateImage);
    };
  }, []);

  // ✅ Use useMemo to prevent unnecessary re-renders
  const youtubeShorts = useMemo(() => {
    const videoIds = ["dQDZ3Zb634o", "KBS4UC-5VJY", "LCBra4ovn8Q", "Y9IPUSvEtmE", "JKZBWY4tVzA"];
  
    return videoIds.map((id, index) => (
      <iframe
        key={index}
        className="shorts-iframe"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={`YouTube Shorts ${index + 1}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    ));
  }, []);
  
  

  return (
    <div className="about-us">
      <img src={imageSrc} alt="About Us" className="about-us-img" />

      {/* YouTube Shorts Section */}
      <div className="shorts-container">
        {/* <div className="shorts-title">YouTube Shorts</div> */}
        <div className="shorts-grid">
          {youtubeShorts}
        </div>

        {/* View All Button */}
        <a
          href="https://www.youtube.com/@vlogsonu5470/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-btn"
        >
          View All
        </a>
      </div>
    </div>
  );
}
