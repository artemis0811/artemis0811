import React from 'react';

import Image from '../../../assets/imgs/Designer-preview3.png';

export default function GlassImage() {
  return (
    <div className='main-content-image-glass'>
        <img className='main-content-img-glass' src={Image} alt="Designer-preview3.png" /> 
        <p className='main-content-image-glass-text'>read the whitepaper</p>
    </div>
  );
}
