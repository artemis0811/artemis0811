import React from 'react';
import HeroContentHeader from './HeroContentHeader';
import HeroContemtTitle from './HeroContentTitle';
import HeroContentAction from './HeroContentAction';

export default function HeroContent() {
  return <div className='right-component hero-content'>
    <HeroContentHeader />
    <HeroContemtTitle />
    <HeroContentAction />
  </div>;
}
