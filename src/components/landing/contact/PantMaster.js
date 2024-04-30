import React from 'react';

import Image from '../../../assets/imgs/BeardWifPants-Master.png';

export default function PantMaster() {
  return (
    <div className='left-component contact-pantmaster'>
        <img className='contact-pantmaster-img' src={Image} alt="BeardWifPants-Master.png" />
        <p className='contact-pantmaster-title'>BeardWifPants</p>
        <p className='contact-pantmaster-desc'>Interoperable NFT drop</p>
    </div>
  );
}
