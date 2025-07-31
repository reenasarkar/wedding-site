import React from 'react';
import mountains from './moonlight-1.png'
import RVHeader from './RV-Header';

export default function Travel() {
  return (
    <div className='travel'>
      <RVHeader />

      <div className="travel-main">
        <img src={mountains} className="oo-image" alt="One&Only Moonlight Basin" />

        <h1>Travel & Stay</h1>
        <p className="travel-description">
          Nestled in the Montana Rockies, One & Only Moonlight Basin is a stunning mountain retreat where luxury meets nature.
          Think cozy lodges, sweeping alpine views, gourmet dining, and endless outdoor adventures—from hiking to fly-fishing.
          It's the perfect place for a romantic, high-elevation celebration with family and friends.
        </p>
      </div>
    </div>
  )
}

