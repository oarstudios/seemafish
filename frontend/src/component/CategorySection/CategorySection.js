import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CategorySection.css"; // Ensure this file is linked

import seaFish from "../../assets/sea_fish.png";
import prawns from "../../assets/prawns.png";
import freshWaterFish from "../../assets/fresh_water_fish.png";
import chicken from "../../assets/chicken.png";
import mutton from "../../assets/mutton.png";
import crab from "../../assets/crab.jpg";

const categories = [
  { name: "Sea fish", image: seaFish },
  { name: "Prawns", image: prawns },
  { name: "Fresh water fish", image: freshWaterFish },
  { name: "Chicken", image: chicken },
  { name: "Mutton", image: mutton },

  { name: "Crab", image: crab },
];

export default function CategorySection() {
  return (
    <div className="category-section">
      <h2>Shop by Category</h2>
      <p>Market fresh meat!</p>


<div className="category-container">
  {categories.map((category, index) => (
    <Link 
      key={index} 
      to={`/category/${category.name}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="category-item">
        <img src={category.image} alt={category.name} />
        <span>{category.name}</span>
      </div>
    </Link>
  ))}
</div>

    </div>
  );
}
