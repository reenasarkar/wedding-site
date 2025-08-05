import React from 'react';
import logo from './wedding-logo.png'
import { useRVWedding } from './RVWeddingContext';
import './FAQ.css';

export default function FAQ() {
  const { handleNavigation } = useRVWedding();

  return (
    <div className='faq'>
      <img src={logo} className="page-app-logo" alt="logo" />

      <h1>FAQ</h1>
      
        <p className="faq-intro">
        <span className="reena-tooltip">Reena</span> is always updating this FAQ, so if you have more questions, feel free to ask her or <strong>her wedding planner, Amy!</strong> (or you can technically ask Varun but he's probably in the operating room so good luck with that one). 
        <br /><br />
        If you're a Vohra/Gupta relative, feel free to ask Ritu or Rohit, but they will probably just ask <span className="reena-tooltip">Reena</span>. 
        <br /><br />
        Sherry or Somu are always an option but they will probably ask <span className="reena-tooltip">Reena</span>. 
        <br /><br />
        So ya, Amy or <span className="reena-tooltip">Reena</span> are both good bets.
      </p>
      
      <img src={require('./zuko-found-you.png')} className="zuko-party-hat" alt="Zuko with party hat" />
      
      <div className="faq-container">

        <div className="faq-item">
        <h3 className="faq-question">I have so many questions about One & Only, not just the Montana location but also about the numerous other locations, like the one in Montenegro!</h3>
          <div className="faq-answer">
            <div className="sumit-contact-container">
              <img src={require('./sumit-happy-chips.png')} className="sumit-chips-image" alt="Sumit with chips" />
              <div className="sumit-contact-text">
                <p>Ahh, you're an inquisitive fellow! That's a question for Sumit Sarkar. You can contact him at +1 917-602-8284. He prefers iMessage but WhatsApp is also possible.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="faq-item">
          <h3 className="faq-question">When and where is the wedding?</h3>
          <p className="faq-answer">
            Full schedule is on the{' '}
            <span 
              className="faq-link"
              onClick={() => handleNavigation('schedule')}
            >
              Event Schedule
            </span>{' '}
            page. But TLDR our celebration takes place over two days (May 23 & 24, 2026) in Big Sky, Montana, at the One & Only Moonlight Basin:
            <br /><br />
            <strong>Day 1 (5/23):</strong> Welcome Party & Sangeet (formal or Indian festive attire)
            <br />
            <strong>Day 2 (5/24):</strong> Wedding Ceremony (Western-style, formal attire) + Reception (Black Tie)
            <br />
            <strong>Day 3 (5/25):</strong> Breakfast (Relaxed attire) + Checkout
          </p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">Where should I stay?</h3>
          <p className="faq-answer">
            Everyone is staying at the One & Only Moonlight Basin. Details on{' '}
            <span 
              className="faq-link"
              onClick={() => handleNavigation('travel')}
            >
              Travel & Stay
            </span>
          </p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">When should I arrive?</h3>
          <div className="faq-answer">
            <p>Check-in begins at 3 pm on Saturday, May 23!</p>
          </div>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">When should I go?</h3>
          <div className="faq-answer">
            <p>Check out is at 12 pm on Monday, May 25!</p>
          </div>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">What's the weather like in Big Sky in late May?</h3>
          <div className="faq-answer">
            <p>Wow, great question. This is a toughie. Montana in late May is stunning, but the weather can be a little unpredictable, especially in the mountains!</p>
            
            <p>Here's what to expect:</p>
            
            <ul>
              <li><strong>Daytime temps:</strong> Usually in the 55–65°F (13–18°C) range in Big Sky</li>
              <li><strong>Evenings:</strong> Chilly! Temps can drop into the 30s (0°C) after sunset. Pack a jacket!</li>
              <li><strong>Sunset time:</strong> Around 9:00 PM (golden hour photos ✨)</li>
              <li><strong>Rain?</strong> There's a ~30–40% chance of a quick shower over the weekend. Nothing too wild, but bring a layer just in case. Especially those coming from India 🇮🇳, pack your down jackets, I know you're not great at handling the cold</li>
              <li><strong>Snow?!</strong> Rare, but we are in the mountains, so don't be shocked by a flurry overnight (it usually melts fast!)</li>
            </ul>
            
            <a 
              href="https://weatherspark.com/m/2771/5/Average-Weather-in-May-in-Big-Sky-Montana-United-States#:~:text=Daily%20high%20temperatures%20increase%20by,or%20exceeding%2039%C2%B0F."
              target="_blank"
              rel="noopener noreferrer"
              className="faq-weather-button"
            >
              More on the weather if you're unsatisfied with this answer →
            </a>
          </div>

          
        </div>

        <div className="faq-item">
          <h3 className="faq-question">If it rains/snows.... Am I going to be outside for the ceremony?</h3>
          <p className="faq-answer">
            Heck no, we have an indoor backup plan if the weather goes sideways.
          </p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">Are kids invited?</h3>
          <p className="faq-answer">
            Sorry - no kids 😭😭 Unless your name is Anjali Bose, Oyon Guha, Aarav/Adit Gupta, or Shivang Gupta, in which case you are good and are basically a teenager. 
            <br />
            Or if Reena or Varun specifically told you to ignore this kid clause.
          </p>  
        </div>

        <div className="faq-item">
          <h3 className="faq-question">Can I bring a +1?</h3>
          <p className="faq-answer">
            If you head over the{' '}
            <span 
              className="faq-link"
              onClick={() => handleNavigation('rsvp')}
            >
              RSVP page
            </span>{' '}
            and put in your name & stuff, Zuko will let you know over there ☺️
          </p>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">How's the altitude?</h3>
          <div className="faq-answer">
            <p>Big Sky is located at over <strong>7,000 feet</strong> above sea level, which means thinner air, stronger sun, and drier conditions. Most people adjust just fine, but it's good to be prepared!</p>
            
            <p>We're providing oxygen canisters for every single guest. They will be in your room. They're great if you feel a little lightheaded or just want a quick pick-me-up. Otherwise, there's a couple of other things you can do - like drink more water, chill out instead of hike if you come early, <strong>booze a lil less</strong>, etc.</p>
          </div>
        </div>
      </div>

      <div className="faq-item">
        <h3 className="faq-question">What else can I do in Big Sky?</h3>
        <div className="faq-answer">
          <p>Lots of fun outdoor things to do in Big Sky!</p>
          
          <p>My personal rec is to take a day trip to <strong>Yellowstone National Park</strong>. Located just 1 hour and 15 minutes from Big Sky, the park's West Entrance offers an unforgettable experience. As the first national park in the world, it’s absolutely worth a visit if you have time before or after the wedding.</p>

          <ul>
            <li>Geysers (including Old Faithful)</li>
            <li>Hot springs with surreal colors</li>
            <li>Bison, elk, and maybe bears</li>
            <li>Majestic waterfalls and scenic drives</li>
          </ul>

          <p>If you're not into that, of course, there's a ton of other outdoor stuff to do in Big Sky:</p>
          <ul>
            <li><strong>Scenic Hikes:</strong> Explore trails with wildflowers, mountain views, and waterfalls — Ousel Falls is a guest favorite!</li>
            <li><strong>Fly Fishing:</strong> The Gallatin River (featured in A River Runs Through It) is world-famous. Guided trips are easy to book.</li>
            <li><strong>Horseback Riding:</strong> Saddle up for a Western-style trail ride through forests and meadows.</li>
            <li><strong>Golf (weather permitting):</strong> The course at Big Sky Resort has stunning views — bring a warm layer just in case.</li>
          </ul>
        </div>
        </div>

        <div className="faq-item">
          <h3 className="faq-question">I want to contact Varun, how can I do that?</h3>
          <div className="faq-answer">
            <div className="varun-contact-container">
              <img src={require('./varun-mich.png')} className="varun-mich-image" alt="Varun with Mich" />
              <div className="varun-contact-text">
                <p>I love your enthusiasm! Please wait 3-5 business days. He is available at +1 901-497-7996. Also vrnvhr22@gmail.com.</p>
              </div>
              <img src={require('./reena-varun.png')} className="reena-varun-image" alt="Reena and Varun" />
            </div>
          </div>
        </div>

    </div>
  )
}