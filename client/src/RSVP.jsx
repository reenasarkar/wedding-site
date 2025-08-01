import React, { useState } from 'react';
import './App.css';
import logo from './wedding-logo.png';

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    events: {
      welcomeDinner: false,
      ceremony: false,
      reception: false
    },
    dietaryRestrictions: '',
    additionalNotes: ''
  });

  const [isNameEntered, setIsNameEntered] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      name: value
    }));
    setIsNameEntered(value.trim().length > 0);
  };

  const handleEventChange = (eventName) => {
    setFormData(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [eventName]: !prev.events[eventName]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('RSVP submitted successfully:', result);
        setIsSubmitted(true);
      } else {
        const error = await response.json();
        console.error('Error submitting RSVP:', error);
        alert('Error submitting RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Error submitting RSVP. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      attending: '',
      events: {
        welcomeDinner: false,
        ceremony: false,
        reception: false
      },
      dietaryRestrictions: '',
      additionalNotes: ''
    });
    setIsNameEntered(false);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="rsvp">
        <div className="rsvp-main">
          <img src={logo} className="page-app-logo" alt="logo" />
          <div className="rsvp-success">
            <h1>Thank You!</h1>
            <p>Your RSVP has been submitted successfully.</p>
            <p>We look forward to celebrating with you!</p>
            <button onClick={resetForm} className="rsvp-button">
              Submit Another RSVP
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp">
      <div className="rsvp-main">
        <img src={logo} className="page-app-logo" alt="logo" />
        <p className="rsvp-subtitle">Please respond by February 1st, 2026</p>
        
        <form onSubmit={handleSubmit} className="rsvp-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="form-input"
            />
          </div>

          {!isNameEntered && (<div className='rsvp-enter-name'>Please enter your first and last name first to continue 🥳</div>)}

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input"
              disabled={!isNameEntered}
            />
          </div>

          <div className="form-group">
            <p className='form-question'>Will you be attending? *</p>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={formData.attending === 'yes'}
                  onChange={handleInputChange}
                  required
                  disabled={!isNameEntered}
                />
                <span>Yes, I will attend</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={formData.attending === 'no'}
                  onChange={handleInputChange}
                  required
                  disabled={!isNameEntered}
                />
                <span>No, I cannot attend</span>
              </label>
            </div>
          </div>

          {formData.attending === 'yes' && (
            <>
              <div className="form-group">
                <p className='form-question'>Which events will you attend? *</p>
                <div className="events-checklist">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id='welcomeDinner'
                      checked={formData.events.welcomeDinner}
                      onChange={() => handleEventChange('welcomeDinner')}
                    />
                    <span className="event-info">
                      <strong>Welcome Dinner</strong>
                      <span className="event-details">Sat May 23, 2026 • 6 - 11 pm</span>
                    </span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id='ceremony'
                      checked={formData.events.ceremony}
                      onChange={() => handleEventChange('ceremony')}
                    />
                    <span className="event-info">
                      <strong>Ceremony</strong>
                      <span className="event-details">Sun May 24, 2026 • 2 - 4 pm</span>
                    </span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id='reception'
                      checked={formData.events.reception}
                      onChange={() => handleEventChange('reception')}
                    />
                    <span className="event-info">
                      <strong>Reception</strong>
                      <span className="event-details">Sun May 24, 2026 • 6 pm - ∞</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dietaryRestrictions">Dietary Restrictions</label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="Please let us know of any dietary restrictions or allergies..."
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to share..."
              className="form-textarea"
              rows="3"
              disabled={!isNameEntered}
            />
          </div>

          <button type="submit" className="rsvp-button" disabled={!isNameEntered}>
            Submit RSVP
          </button>
        </form>
      </div>
    </div>
  );
}

