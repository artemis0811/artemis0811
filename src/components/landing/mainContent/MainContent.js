import React from 'react';
import MainContentImage from './MainContentImage';

import './MainContent.css'
import MainContentRoadMap from './MainContentRoadMap';

export default function MainContent() {
  return (
    <div className='main-content-component'>
        <MainContentImage />
        <MainContentRoadMap />
    </div>
  );
}
