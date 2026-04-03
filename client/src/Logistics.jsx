import React, { useState, useEffect, useRef } from 'react';
import logo from './wedding-logo.png';
import './Logistics.css';

const TRANSPORT_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf-BUV0DDWZZNmHs0yJvlFpbLkD1Jh6sUSHX1tfhUUOHagkcw/viewform';

const mealOptions = [
  { value: 'meat', label: 'Meat', icon: '🥩' },
  { value: 'fish', label: 'Fish', icon: '🐟' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
];

export default function Logistics() {
  const [name, setName] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [savedMeal, setSavedMeal] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [guestValidation, setGuestValidation] = useState({
    isValid: false,
    isChecking: false,
    suggestions: [],
    message: '',
  });
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const checkGuest = async (guestName) => {
    if (!guestName.trim()) return;

    try {
      const response = await fetch('/api/check-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.is_invited) {
          setGuestValidation({
            isValid: true,
            isChecking: false,
            suggestions: [],
            message: `Hey ${result.guest.name}! Zuko found you!`,
          });
          loadMealSelection(result.guest.name);
        } else {
          setGuestValidation({
            isValid: false,
            isChecking: false,
            suggestions: result.suggestions || [],
            message: result.suggestions && result.suggestions.length > 0
              ? `Hmm, Zuko couldn't find you. Did you mean ${result.suggestions.join(', ')}?`
              : result.message || 'Zuko says you are not on the guest list. Try something else. Or take it up with Reena or Varun.',
          });
        }
      } else {
        setGuestValidation({
          isValid: false, isChecking: false, suggestions: [], message: 'Error checking guest list. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error checking guest:', error);
      setGuestValidation({
        isValid: false, isChecking: false, suggestions: [], message: 'Error checking guest list. Please try again.',
      });
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setName(value);

    if (!value.trim()) {
      setGuestValidation({ isValid: false, isChecking: false, suggestions: [], message: '' });
      setSelectedMeal('');
      setSavedMeal('');
      setSaveMessage('');
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      return;
    }

    if (guestValidation.isValid) {
      setSelectedMeal('');
      setSavedMeal('');
      setSaveMessage('');
    }

    setGuestValidation((prev) => ({ ...prev, isChecking: true, message: '' }));

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      checkGuest(value);
    }, 2000);
  };

  const loadMealSelection = async (guestName) => {
    try {
      const response = await fetch(`/api/meal-selection/${encodeURIComponent(guestName)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.selection) {
          setSelectedMeal(result.selection.meal_choice);
          setSavedMeal(result.selection.meal_choice);
        }
      }
    } catch (error) {
      console.error('Error loading meal selection:', error);
    }
  };

  const saveMealSelection = async (choice) => {
    setSaveMessage('saving');
    try {
      const response = await fetch('/api/meal-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, mealChoice: choice }),
      });
      if (response.ok) {
        setSavedMeal(choice);
        setSaveMessage('saved');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving meal selection:', error);
      setSaveMessage('');
    }
  };

  const isVerified = guestValidation.isValid;
  const hasChanged = selectedMeal && selectedMeal !== savedMeal;

  return (
    <div className="logistics">
      <img src={logo} className="page-app-logo" alt="logo" />

      <div className="logistics-main">
        <h1>Logistics</h1>
        <p className="logistics-intro">
          Select your meal choice and make sure your transportation to the venue is sorted.
        </p>

        <div className="logistics-name-check">
          <label htmlFor="logistics-name">Enter your name to get started</label>
          <input
            type="text"
            id="logistics-name"
            value={name}
            onChange={handleNameChange}
            placeholder="First and last name"
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
        </div>

        {isVerified && <>
          <div className="logistics-meal-section">
            <p className="logistics-meal-label">What would you like to eat?</p>
            {savedMeal && !hasChanged && (
              <p className="logistics-meal-saved">You've selected: <strong>{mealOptions.find((m) => m.value === savedMeal)?.label}</strong>. You can change it below.</p>
            )}
            <div className="logistics-meal-options">
              {mealOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`logistics-meal-option ${selectedMeal === option.value ? 'logistics-meal-option-selected' : ''}`}
                  onClick={() => { setSelectedMeal(option.value); saveMealSelection(option.value); }}
                >
                  <span className="logistics-meal-icon">{option.icon}</span>
                  <span className="logistics-meal-title">{option.label}</span>
                </button>
              ))}
            </div>
            {saveMessage === 'saving' && (
              <div className="logistics-toast logistics-toast-saving">
                <span className="logistics-spinner"></span> Saving...
              </div>
            )}
            {saveMessage === 'saved' && (
              <div className="logistics-toast logistics-toast-saved">
                <div className="logistics-toast-text">&#10003; Saved!</div>
                <div className="logistics-toast-bar"><div className="logistics-toast-bar-fill"></div></div>
              </div>
            )}
          </div>

        </>}

        <div className="logistics-transport-section">
          <h2>Transportation</h2>
          <p className="logistics-transport-text">
            If you haven't already, please fill out the transportation form so we can help coordinate your travel to the venue.
          </p>
          <a
            href={TRANSPORT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="logistics-transport-button"
          >
            Fill out Transportation Form &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
