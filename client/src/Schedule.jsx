import React from 'react';
import logo from './wedding-logo.png'

export default function Schedule() {
  return (
    <div className='schedule'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <h1>Event Schedule</h1>

      <div className="schedule-main">
        <p className="schedule-intro">
          Celebrations will take place from Saturday afternoon through Sunday evening.
          We have a wonderful lineup of events that celebrate the mixture of cultures
          that we come from. If you cannot make all of the events, especially Saturday
          afternoon because of flights, no worries at all! We're just happy to have you here 🥰
        </p>

        {/* Saturday */}
        <div className="schedule-day">
          <h2>Saturday, May 23rd</h2>
          <p className="schedule-day-subtitle">
            Saturday's events are focused on celebrating our Indian, Taiwanese, and cultural heritage.
          </p>

          <div className="schedule-event">
            <span className="schedule-event-time">5:30 – 6:30 PM</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Indian Wedding Blessing Ceremony</h3>
              <p className="schedule-event-description">Officiated by an Indian pandit.</p>
            </div>
          </div>

          <div className="schedule-event">
            <span className="schedule-event-time">7:00 – 11:00 PM</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Cultural & Game Night</h3>
              <p className="schedule-event-description">
                Sangeet-inspired vibes with a mix of games, music, and friendly competition.
                Top players win great prizes 😎
              </p>
            </div>
          </div>

          <div className="schedule-style-guide">
            <h3>Saturday Style Guide</h3>
            <p>
              Saturday is all about celebration, culture, and a little friendly competition.
              We'll be mixing it up ourselves — Reena will be in a qipao and Varun in a sherwani —
              so please feel free to come and join in on the fun!
            </p>
            <p><strong>What to wear? Think formal, think bright:</strong></p>
            <ul>
              <li>Indian formal (sherwanis, achkans, embroidered kurtas)</li>
              <li>Formal wear from your own culture</li>
              <li>Montana formal (yeehaw encouraged)</li>
              <li>American formal (tuxes, gowns, suits that mean business)</li>
            </ul>
            <p>
              The goal is joyful, colorful, and celebratory 🕺🏽
              Feel comfortable to wear clothing of any ethnicity no matter what yours is!
            </p>
          </div>
        </div>

        {/* Sunday */}
        <div className="schedule-day">
          <h2>Sunday, May 24th</h2>
          <p className="schedule-day-subtitle">The big day.</p>

          <div className="schedule-event">
            <span className="schedule-event-time">4:00 – 5:00 PM</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Ceremony</h3>
            </div>
          </div>

          <div className="schedule-event">
            <span className="schedule-event-time">5:30 – 7:00 PM</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Cocktail Hour</h3>
            </div>
          </div>

          <div className="schedule-event">
            <span className="schedule-event-time">7:00 PM – 12:00 AM</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Reception and Celebration</h3>
            </div>
          </div>

          <div className="schedule-event">
            <span className="schedule-event-time">Midnight onwards</span>
            <div className="schedule-event-details">
              <h3 className="schedule-event-name">Dear Josephine Late Night</h3>
            </div>
          </div>

          <div className="schedule-style-guide">
            <h3>Sunday Style Guide</h3>
            <p>Black tie optional.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
