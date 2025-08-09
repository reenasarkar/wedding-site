import React from 'react';
import logo from './wedding-logo.png'
import jhuImage from './JHU-part-2.png'
import varunSleepingImage from './varun-sleeping-great-books.JPG'
import './AboutUs.css'

export default function AboutUs() {
  return (
    <div className='schedule'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <h1>About Us (Work in progress)</h1>
      
      <div className="jhu-image-container">
        <img src={jhuImage} alt="JHU Part 2" className="jhu-image" />
      </div>

      <div className="about-us-text">
        <p>
          Varun and Reena met on a crisp fall day in Sept 2015, on the first day of classes at Johns Hopkins University at their Great Books Class. Their professor spoke French as a primary language and was literally incomprehensible. That first class was a discussion of The Odyssey, the required summer reading. Neither of them had actually read the assigned translation… but luckily, both had read different versions back in high school. (Varun probably sparknoted his.)
        </p>
      </div>

      <div className="sleeping-varun-section">
        <div className="sleeping-varun-image">
          <img src={varunSleepingImage} alt="Varun sleeping in Great Books class" />
        </div>
        <div className="sleeping-varun-text">
          <p>
            Literally no one took this class seriously, here's a photo of Varun falling asleep in the 12-person lecture on Sept 24, 2015, which Reena took, from her phone. Varun got an A+ in the class, which was honestly a silly waste of time since it was a pass/fail semester. But 👍👍👍
          </p>
        </div>
      </div>
      
    </div>
  )
}