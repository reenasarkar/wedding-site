import React, { useState, useEffect, useRef } from 'react';
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
    additionalNotes: '',
    plusOneName: '',
    plusOneEmail: ''
  });

  const [isNameEntered, setIsNameEntered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [guestValidation, setGuestValidation] = useState({
    isValid: false,
    isChecking: false,
    suggestions: [],
    message: '',
    guest: null
  });

  // Use ref to store timeout ID for proper debouncing
  const debounceTimeoutRef = useRef(null);

  // State to track if existing RSVP was loaded
  const [existingRSVP, setExistingRSVP] = useState(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const loadExistingRSVP = async (guestName) => {
    try {
      const response = await fetch(`/api/rsvp/${encodeURIComponent(guestName)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.found) {
          setExistingRSVP(result.rsvp);
          // Populate form with existing data
          setFormData({
            name: result.rsvp.name,
            email: result.rsvp.email,
            attending: result.rsvp.attending ? 'yes' : 'no',
            events: {
              welcomeDinner: result.rsvp.welcome_dinner,
              ceremony: result.rsvp.ceremony,
              reception: result.rsvp.reception
            },
            dietaryRestrictions: result.rsvp.dietary_restrictions || '',
            additionalNotes: result.rsvp.additional_notes || '',
            plusOneName: result.rsvp.plus_one_name || '',
            plusOneEmail: result.rsvp.plus_one_email || ''
          });
          setIsNameEntered(true);
        } else {
          setExistingRSVP(null);
        }
      }
    } catch (error) {
      console.error('Error loading existing RSVP:', error);
      setExistingRSVP(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear existing RSVP message when user starts modifying input
    if (existingRSVP) {
      setExistingRSVP(null);
    }
  };

  const checkGuest = async (name) => {
    if (!name.trim()) {
      setGuestValidation({
        isValid: false,
        isChecking: false,
        suggestions: [],
        message: '',
        guest: null
      });
      return;
    }

    try {
      const response = await fetch('/api/check-guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.is_invited) {
          setGuestValidation({
            isValid: true,
            isChecking: false,
            suggestions: [],
            message: `Hey ${result.guest.name}! Zuko found you!`,
            guest: result.guest
          });
          // Load existing RSVP if guest is already on the list
          if (result.guest.name) {
            loadExistingRSVP(result.guest.name);
          }
        } else {
          setGuestValidation({
            isValid: false,
            isChecking: false,
            suggestions: result.suggestions || [],
            message: result.suggestions && result.suggestions.length > 0 
              ? `Hmm, Zuko couldn't find you. Did you mean ${result.suggestions.join(', ')}?`
              : result.message || 'Zuko says you are not on the guest list. Try something else. Or take it up with Reena or Varun.',
            guest: null
          });
        }
      } else {
        setGuestValidation({
          isValid: false,
          isChecking: false,
          suggestions: [],
          message: 'Error checking guest list. Please try again.',
          guest: null
        });
      }
    } catch (error) {
      console.error('Error checking guest:', error);
      setGuestValidation({
        isValid: false,
        isChecking: false,
        suggestions: [],
        message: 'Error checking guest list. Please try again.',
        guest: null
      });
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      name: value
    }));
    
    const hasName = value.trim().length > 0;
    setIsNameEntered(hasName);
    
    // Reset validation when name is cleared
    if (!hasName) {
      setGuestValidation({
        isValid: false,
        isChecking: false,
        suggestions: [],
        message: '',
        guest: null
      });
      // Clear any existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      // Clear existing RSVP message
      setExistingRSVP(null);
      return;
    }

    // Clear existing RSVP message when name is modified
    if (existingRSVP) {
      setExistingRSVP(null);
    }

    // Show loading state immediately
    setGuestValidation(prev => ({ 
      ...prev, 
      isChecking: true,
      message: '' // Clear any previous messages
    }));

    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debouncing
    debounceTimeoutRef.current = setTimeout(() => {
      checkGuest(value);
    }, 2000);
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
      additionalNotes: '',
      plusOneName: '',
      plusOneEmail: ''
    });
    setIsNameEntered(false);
    setIsSubmitted(false);
    setGuestValidation({
      isValid: false,
      isChecking: false,
      suggestions: [],
      message: '',
      guest: null
    });
    setExistingRSVP(null);
  };

  // Check if form should be enabled
  const isFormEnabled = isNameEntered && guestValidation.isValid;

  // Get associated guest info for display
  const associatedGuestInfo = () => {
    if (!guestValidation.isValid || !guestValidation.guest) return null;
    
    const guest = guestValidation.guest;
    
    if (guest.plus_one_allowed) {
      return "You do have a plus one! If you'd like to bring someone, let's get their info.";
    } else if (guest.associated_guest) {
      return `You don't have a plus one, but you are associated with ${guest.associated_guest}. They will need to RSVP separately.`;
    } else {
      return "You don't have a plus one. If you think you should have one, take it up with Reena or Varun";
    }
  };

  // Check if guest has plus one
  const hasPlusOne = () => {
    return guestValidation.isValid && guestValidation.guest && guestValidation.guest.plus_one_allowed;
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
        <p className="rsvp-subtitle">For the record, <b>Reena (and Zuko)</b> made this entire thing, if there are any bugs, please report it to her.</p>

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
            {guestValidation.isChecking && (
              <div className="guest-checking">
                <img src={require('./zuko-is-searching.png')} alt="Zuko searching" className="zuko-searching-image" />
                Zuko is checking the database for ya...
              </div>
            )}
            {guestValidation.message && !guestValidation.isChecking && (
              <div className={`guest-message ${guestValidation.isValid ? 'guest-valid' : guestValidation.suggestions.length > 0 ? 'guest-suggestions' : 'guest-invalid'}`}>
                {guestValidation.isValid && (
                  <img src={require('./zuko-found-you.png')} alt="Zuko found you" className="zuko-found-image" />
                )}
                {!guestValidation.isValid && (
                  <img src={require('./Zuko-cant-find.png')} alt="Zuko can't find you" className="zuko-cant-find-image" />
                )}
                {guestValidation.message}
              </div>
            )}
            {existingRSVP && (
              <div className="existing-rsvp-message">
                This genius also found your previous RSVP! You can modify your responses below.
              </div>
            )}
            {!isNameEntered && (
            <div className='rsvp-enter-name'>Please enter your first and last name first to continue 🥳 I'll make sure Zuko finds you.</div>
          )}
          </div>

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
              disabled={!isFormEnabled}
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
                  disabled={!isFormEnabled}
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
                  disabled={!isFormEnabled}
                />
                <span>No, I cannot attend</span>
              </label>
            </div>
          </div>

          {formData.attending === 'no' && (
            <div className="zuko-upset-message">
              <img src={require('./zuko-upset.png')} alt="Zuko upset" className="zuko-upset-image" />
              ok fine. you can always change your RSVP in the future
            </div>
          )}

          {formData.attending === 'yes' && (
            <div className="zuko-happy-message">
              <img src={require('./zuko-belly-up.png')} alt="Zuko happy" className="zuko-happy-image" />
              Nice 👍👍👍👍👍 Choice 👍👍👍👍👍
            </div>
          )}

          {formData.attending === 'yes' && associatedGuestInfo() && (
            <div className="form-group">
              <p className='form-question'>Plus one?</p>
              <div className="associated-guest-info">
                {associatedGuestInfo()}
              </div>
              
              {hasPlusOne() && (
                <>
                  <div className="form-group">
                    <label htmlFor="plusOneName">Name of your Plus One Person</label>
                    <input
                      type="text"
                      id="plusOneName"
                      name="plusOneName"
                      value={formData.plusOneName}
                      onChange={handleInputChange}
                      placeholder="Enter your plus one's full name"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="plusOneEmail">Email of your Plus One Person</label>
                    <input
                      type="email"
                      id="plusOneEmail"
                      name="plusOneEmail"
                      value={formData.plusOneEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your plus one's email address"
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>
          )}

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
                      disabled={!isFormEnabled}
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
                      disabled={!isFormEnabled}
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
                      disabled={!isFormEnabled}
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
                  disabled={!isFormEnabled}
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
              disabled={!isFormEnabled}
            />
          </div>

          <button type="submit" className="rsvp-button" disabled={!isFormEnabled}>
            Submit RSVP
          </button>
        </form>
      </div>
    </div>
  );
}

