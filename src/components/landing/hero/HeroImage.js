import React from 'react';

import Image1 from '../../../assets/imgs/Designer-preview1.png';

export default function HeroImage() {
  return (
    <div className='left-component hero-image'>
      <img className='hero-img' src={Image1} alt='Designer-preview1.png' />
    </div>
  );
}
