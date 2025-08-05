import React from 'react';
import mountains from './moonlight-1.png'
import logo from './wedding-logo.png'

export default function Travel() {
  return (
    <div className='travel'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <div className="travel-main">        
        <img src={mountains} className="oo-image" alt="One&Only Moonlight Basin" />

        <h1>Travel & Stay</h1>
        <p className="travel-description">
          Nestled in the Montana Rockies, One & Only Moonlight Basin is a stunning mountain retreat where luxury meets nature.
        </p>

        <div className="hotel-link-section">
          <a 
            href="https://www.oneandonlyresorts.com/moonlight-basin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hotel-link-button"
          >
            Learn about OO Moonlight Basin →
          </a>
        </div>

        <div className="map-section">
          <h1>Hotel & Events Location</h1>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2805.389499073393!2d-111.43532678800521!3d45.3207566428771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53500b81687f52db%3A0x5511b2476a3dd575!2sOne%26Only%20Sky%20Lodge!5e0!3m2!1sen!2sus!4v1754057067077!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="One & Only Sky Lodge Location"
            ></iframe>
          </div>
          <p className="map-description">
            All events & hotel rooms are located at the <strong>One & Only Moonlight Basin</strong>.
          </p>
          <p className="map-description">
            Jack Creek Rd<br />
            Big Sky, MT 59716
          </p>
        </div>

        <div className="directions-section">
          <div className="directions-content">
            <div className="directions-map">
              <a 
                href="https://maps.app.goo.gl/zCsyDygpEGmwqgPM8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="directions-link"
              >
                Get Directions on Google Maps →
              </a>
            </div>
            
            <div className="transportation-info">
              <div className="transport-options">
                <div className="transport-option">
                  <h4>Uber and Lyft </h4>
                  <p>Lots of rideshare options are readily available in the area. You can easily book rides to and from the venue.</p>
                </div>
                
                <div className="transport-option">
                  <h4>Shuttle Service</h4>
                  <p>We're working on arranging shuttle service for our guests. TBD. Lets see</p>
                </div>
                
                <div className="transport-option">
                  <h4>Rental Car</h4>
                  <p>I'd not suggest this, unless you're planning on staying a longer amount of time or visiting yellowstone or something.</p>
                </div>
              </div>
            </div>

            
          </div>
        </div>
        
        <div className="zuko-belly-up-section">
          <img src={require('./zuko-belly-up.png')} className="zuko-belly-up" alt="Zuko belly up" />
        </div>
      </div>
    </div>
  )
}

