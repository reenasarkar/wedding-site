import React from 'react';
import logo from './wedding-logo.png'

export default function Schedule() {
  return (
    <div className='schedule'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <h1>Event Schedule</h1>
      <p className="schedule-coming-soon">Coming Soon!</p>
      <p className="schedule-description">I am working on this with the event planner and will send out an email blast when this info is ready, so you can know more details 😜</p>
    </div>
  )
}

