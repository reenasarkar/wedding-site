import React from 'react';
import logo from './wedding-logo.png'
import './Schedule.css';

export default function Schedule() {
  return (
    <div className='schedule'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <h1>Event Schedule</h1>
      <p className="schedule-intro">
        Our celebration takes place over two days — Saturday is all about celebrating the mix of cultures that make us <em>us</em>, and Sunday is the big traditional wedding day. All events take place right at One &amp; Only Moonlight Basin, so once you're here, there's no need to leave!
      </p>

      {/* Saturday */}
      <div className="schedule-day">
        <h2 className="schedule-day-header">Saturday, May 23</h2>

        <div className="schedule-event">
          <div className="schedule-event-time">5:30 – 6:30 PM</div>
          <div className="schedule-event-details">
            <div className="schedule-event-name">Indian Wedding Blessing Ceremony</div>
            <div className="schedule-event-description">
              A traditional blessing officiated by an Indian pandit. A beautiful way to kick off the weekend.
            </div>
          </div>
        </div>

        <div className="schedule-event">
          <div className="schedule-event-time">7:00 – 11:00 PM</div>
          <div className="schedule-event-details">
            <div className="schedule-event-name">Cultural &amp; Game Night</div>
            <div className="schedule-event-description">
              Sangeet-inspired vibes with a mix of games, music, and friendly competition. Top players win great prizes — so bring your A-game!
            </div>
          </div>
        </div>

        <div className="schedule-style-guide">
          <h3>Saturday Style Guide</h3>
          <p>
            Saturday is all about celebration, culture, and a little friendly competition. We'll be mixing it up ourselves — Reena will be in a qipao and Varun in a sherwani — so please feel free to come and join in on the fun!
          </p>
          <p>Think formal, think bright:</p>
          <ul>
            <li>Indian formal (sherwanis, achkans, embroidered kurtas)</li>
            <li>Formal wear from your own culture</li>
            <li>Montana formal (yeehaw encouraged)</li>
            <li>American formal (tuxes, gowns, suits that mean business)</li>
          </ul>
          <p>The goal is joyful, colorful, and celebratory. Feel comfortable to wear clothing of any ethnicity no matter what yours is!</p>
        </div>
      </div>

      {/* Sunday */}
      <div className="schedule-day">
        <h2 className="schedule-day-header">Sunday, May 24 — The Big Day</h2>

        <div className="schedule-event">
          <div className="schedule-event-time">4:00 – 5:00 PM</div>
          <div className="schedule-event-details">
            <div className="schedule-event-name">Ceremony</div>
          </div>
        </div>

        <div className="schedule-event">
          <div className="schedule-event-time">5:30 – 7:00 PM</div>
          <div className="schedule-event-details">
            <div className="schedule-event-name">Cocktail Hour</div>
          </div>
        </div>

        <div className="schedule-event">
          <div className="schedule-event-time">7:00 PM onward</div>
          <div className="schedule-event-details">
            <div className="schedule-event-name">Reception &amp; Celebration</div>
          </div>
        </div>

        <div className="schedule-style-guide">
          <h3>Sunday Style Guide</h3>
          <p>
            Black tie optional. Feel free to go all out, but absolutely no requirement. Whatever just popped into your mind when you read that — we already love it.
          </p>
        </div>
      </div>

      <p className="schedule-note">
        If you can't make all the events, especially the ones on Saturday afternoon because of flights, no worries at all! We're just happy to have you here.
      </p>
    </div>
  )
}
