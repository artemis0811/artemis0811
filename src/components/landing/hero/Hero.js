import React from 'react';

import HeroImage from './HeroImage';
import HeroContent from './HeroContent';

import "./Hero.css"

export default function Hero() {
  return (
    <div className='hero-component'>
        <HeroImage />
        <HeroContent />
    </div>
  );
}
