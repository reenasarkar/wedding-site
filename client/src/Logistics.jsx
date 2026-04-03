import React, { useState, useEffect, useRef } from 'react';
import logo from './wedding-logo.png';
import reenaJamon from './reena-jamon.png';
import varunFish from './varun-fish.png';
import zukoVeg from './zuko-veg.png';
import './Logistics.css';

const TRANSPORT_LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSf-BUV0DDWZZNmHs0yJvlFpbLkD1Jh6sUSHX1tfhUUOHagkcw/viewform';

const mealOptions = [
  { value: 'chicken', label: 'Chicken', image: reenaJamon, description: 'Chicken Thigh & Leg | Root Vegetable Succotash | Thyme Jus' },
  { value: 'fish', label: 'Fish', image: varunFish, description: 'Seabass | Lemongrass Coconut Broth | Shimeji Mushrooms | Korean Rice Cakes' },
  { value: 'vegetarian', label: 'Vegetarian', image: zukoVeg, description: 'Farro Risotto | Curried Carrot | Cashew | Braised Greens' },
];

export default function Logistics() {
  const [verifiedName, setVerifiedName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [mealCards, setMealCards] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null); // { index, status: 'saving' | 'saved' }
  const [guestValidation, setGuestValidation] = useState({
    isValid: false,
    isChecking: false,
    suggestions: [],
    message: '',
  });
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
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
          const foundName = result.guest.name;
          setGuestValidation({
            isValid: true, isChecking: false, suggestions: [], message: `Hey ${foundName}! Zuko found you!`,
          });
          setVerifiedName(foundName);
          setMealCards([{ name: foundName, meal: '', saved: false }]);
          setExpandedIndex(0);
          loadMealSelections(foundName);
        } else {
          setGuestValidation({
            isValid: false, isChecking: false,
            suggestions: result.suggestions || [],
            message: result.suggestions && result.suggestions.length > 0
              ? `Hmm, Zuko couldn't find you. Did you mean ${result.suggestions.join(', ')}?`
              : result.message || 'Zuko says you are not on the guest list. Try something else. Or take it up with Reena or Varun.',
          });
        }
      } else {
        setGuestValidation({ isValid: false, isChecking: false, suggestions: [], message: 'Error checking guest list. Please try again.' });
      }
    } catch (error) {
      console.error('Error checking guest:', error);
      setGuestValidation({ isValid: false, isChecking: false, suggestions: [], message: 'Error checking guest list. Please try again.' });
    }
  };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setNameInput(value);

    if (!value.trim()) {
      setGuestValidation({ isValid: false, isChecking: false, suggestions: [], message: '' });
      setVerifiedName('');
      setMealCards([]);
      setExpandedIndex(0);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      return;
    }

    if (guestValidation.isValid) {
      setVerifiedName('');
      setMealCards([]);
      setExpandedIndex(0);
    }

    setGuestValidation((prev) => ({ ...prev, isChecking: true, message: '' }));

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      checkGuest(value);
    }, 2000);
  };

  const loadMealSelections = async (guestName) => {
    try {
      const response = await fetch(`/api/meal-selection/${encodeURIComponent(guestName)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.selections && result.selections.length > 0) {
          const cards = result.selections.map((s) => ({
            name: s.guest_name,
            meal: s.meal_choice,
            saved: true,
          }));
          setMealCards(cards);
          setExpandedIndex(-1); // all collapsed
        } else if (result.own_meal) {
          // Someone else already submitted a meal for this person
          setMealCards([{ name: guestName, meal: result.own_meal.meal_choice, saved: true, submittedBy: result.own_meal.submitted_by }]);
          setExpandedIndex(-1);
        } else {
          setMealCards([{ name: guestName, meal: '', saved: false }]);
          setExpandedIndex(0);
        }
      }
    } catch (error) {
      console.error('Error loading meal selections:', error);
      setMealCards([{ name: guestName, meal: '', saved: false }]);
      setExpandedIndex(0);
    }
  };

  const saveMeal = async (index, choice) => {
    const card = mealCards[index];
    if (!card.name.trim()) return;

    setSaveStatus({ index, status: 'saving' });
    const updated = [...mealCards];
    updated[index] = { ...card, meal: choice };
    setMealCards(updated);

    try {
      const response = await fetch('/api/meal-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: card.name,
          submittedBy: verifiedName,
          mealChoice: choice,
        }),
      });
      if (response.ok) {
        const saved = [...updated];
        saved[index] = { ...saved[index], saved: true };
        setMealCards(saved);
        setSaveStatus({ index, status: 'saved' });
        setTimeout(() => {
          setSaveStatus(null);
        }, 2500);
      } else {
        setSaveStatus(null);
      }
    } catch (error) {
      console.error('Error saving meal:', error);
      setSaveStatus(null);
    }
  };

  const addPerson = () => {
    setMealCards((prev) => [...prev, { name: '', meal: '', saved: false, verified: false, checking: false, checkMessage: '' }]);
    setExpandedIndex(mealCards.length);
  };

  const cardDebounceRefs = useRef({});

  const updateCardName = (index, newName) => {
    const updated = [...mealCards];
    updated[index] = { ...updated[index], name: newName, verified: false, checkMessage: '' };
    setMealCards(updated);

    if (!newName.trim()) {
      updated[index] = { ...updated[index], checking: false, checkMessage: '' };
      setMealCards([...updated]);
      if (cardDebounceRefs.current[index]) clearTimeout(cardDebounceRefs.current[index]);
      return;
    }

    updated[index] = { ...updated[index], checking: true };
    setMealCards([...updated]);

    if (cardDebounceRefs.current[index]) clearTimeout(cardDebounceRefs.current[index]);
    cardDebounceRefs.current[index] = setTimeout(async () => {
      try {
        const response = await fetch('/api/check-guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName }),
        });
        if (response.ok) {
          const result = await response.json();
          if (result.is_invited) {
            // Check if this person already has a meal selection
            const mealRes = await fetch(`/api/meal-selection/${encodeURIComponent(result.guest.name)}`);
            let existingMeal = null;
            let existingSubmitter = null;
            if (mealRes.ok) {
              const mealData = await mealRes.json();
              const selfSubmitted = mealData.selections?.find((s) => s.guest_name.toLowerCase() === result.guest.name.toLowerCase());
              if (selfSubmitted) {
                existingMeal = selfSubmitted.meal_choice;
                existingSubmitter = selfSubmitted.submitted_by;
              } else if (mealData.own_meal) {
                existingMeal = mealData.own_meal.meal_choice;
                existingSubmitter = mealData.own_meal.submitted_by;
              }
            }
            setMealCards((prev) => {
              const copy = [...prev];
              if (existingMeal) {
                const selectedBy = existingSubmitter.toLowerCase() === result.guest.name.toLowerCase() ? '' : ` (selected by ${existingSubmitter})`;
                copy[index] = { ...copy[index], name: result.guest.name, meal: existingMeal, verified: true, checking: false, checkMessage: `Already selected: ${existingMeal}${selectedBy}. You can change it below.`, hasExisting: true };
              } else {
                copy[index] = { ...copy[index], name: result.guest.name, verified: true, checking: false, checkMessage: `Found: ${result.guest.name}` };
              }
              return copy;
            });
          } else {
            setMealCards((prev) => {
              const copy = [...prev];
              copy[index] = { ...copy[index], verified: false, checking: false, checkMessage: result.suggestions ? `Did you mean ${result.suggestions.join(', ')}?` : 'Not found on guest list or as a plus one.' };
              return copy;
            });
          }
        }
      } catch (error) {
        setMealCards((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], verified: false, checking: false, checkMessage: 'Error checking name.' };
          return copy;
        });
      }
    }, 1500);
  };

  const isVerified = guestValidation.isValid;

  return (
    <div className="logistics">
      <img src={logo} className="page-app-logo" alt="logo" />

      <div className="logistics-main">
        <h1>Meal & Transportation</h1>
        <p className="logistics-intro">
          Select your meal choice and make sure your transportation to the venue is sorted.
        </p>

        <div className="logistics-name-check">
          <label htmlFor="logistics-name">Enter your name to get started</label>
          <input
            type="text"
            id="logistics-name"
            value={nameInput}
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

        {isVerified && mealCards.length > 0 && <>
          {/* Your own meal */}
          <div className="logistics-your-meal">
            <p className="logistics-meal-label">What would you personally like to eat?</p>
            {(() => {
              const card = mealCards[0];
              const isExpanded = expandedIndex === 0;
              const mealInfo = mealOptions.find((m) => m.value === card.meal);

              if (!isExpanded && card.saved) {
                return (
                  <>
                    <div className="logistics-card-collapsed">
                      <span className="logistics-card-collapsed-name">{card.name}</span>
                      <span className="logistics-card-collapsed-meal">{mealInfo?.icon} {mealInfo?.label}</span>
                      <span className="logistics-card-collapsed-check">&#10003;</span>
                      <button type="button" className="logistics-card-edit-button" onClick={() => setExpandedIndex(0)}>Edit</button>
                    </div>
                    {card.submittedBy && (
                      <p className="logistics-selected-by">Selected by {card.submittedBy}</p>
                    )}
                  </>
                );
              }

              return (
                <div className="logistics-card-expanded">
                  {card.saved && <button type="button" className="logistics-card-close" onClick={() => setExpandedIndex(-1)}>&times;</button>}
                  <p className="logistics-card-name-display">{card.name}</p>
                  <div className="logistics-meal-options">
                    {mealOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`logistics-meal-option ${card.meal === option.value ? 'logistics-meal-option-selected' : ''}`}
                        onClick={() => saveMeal(0, option.value)}
                      >
                        {option.image ? <img src={option.image} alt={option.label} className="logistics-meal-option-img" /> : <span className="logistics-meal-icon">{option.icon}</span>}
                        <span className="logistics-meal-title">{option.label}</span>
                        {option.description && <span className="logistics-meal-desc">{option.description}</span>}
                      </button>
                    ))}
                  </div>
                  {saveStatus && saveStatus.index === 0 && saveStatus.status === 'saving' && (
                    <div className="logistics-toast logistics-toast-saving">
                      <span className="logistics-spinner"></span> Saving...
                    </div>
                  )}
                  {saveStatus && saveStatus.index === 0 && saveStatus.status === 'saved' && (
                    <div className="logistics-toast logistics-toast-saved">
                      <div className="logistics-toast-text">&#10003; Saved!</div>
                      <div className="logistics-toast-bar"><div className="logistics-toast-bar-fill"></div></div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Others section */}
          <div className="logistics-others-section">
            <p className="logistics-others-heading">Selecting for someone else?</p>

            <div className="logistics-meal-cards">
              {mealCards.slice(1).map((card, i) => {
                const index = i + 1;
                const isExpanded = expandedIndex === index;
                const mealInfo = mealOptions.find((m) => m.value === card.meal);

                if (!isExpanded && card.saved) {
                  return (
                    <div key={index} className="logistics-card-collapsed">
                      <span className="logistics-card-collapsed-name">{card.name}</span>
                      <span className="logistics-card-collapsed-meal">{mealInfo?.icon} {mealInfo?.label}</span>
                      <span className="logistics-card-collapsed-check">&#10003;</span>
                      <button type="button" className="logistics-card-edit-button" onClick={() => setExpandedIndex(index)}>Edit</button>
                    </div>
                  );
                }

                return (
                  <div key={index} className="logistics-card-expanded">
                    <button type="button" className="logistics-card-close" onClick={() => {
                      if (card.saved) {
                        setExpandedIndex(-1);
                      } else {
                        setMealCards((prev) => prev.filter((_, idx) => idx !== index));
                        setExpandedIndex(-1);
                      }
                    }}>&times;</button>
                    <div className="logistics-input-wrapper">
                      <input
                        type="text"
                        value={card.name}
                        onChange={(e) => updateCardName(index, e.target.value)}
                        placeholder="Enter name"
                        className="form-input logistics-card-name-input"
                      />
                      {card.checking && (
                        <span className="logistics-input-status">
                          <span className="logistics-spinner"></span>
                        </span>
                      )}
                      {!card.checking && card.verified && (
                        <span className="logistics-input-status logistics-input-check">&#10003;</span>
                      )}
                      {!card.checking && card.checkMessage && !card.verified && (
                        <span className="logistics-input-status logistics-input-x">&#10007;</span>
                      )}
                    </div>
                    {!card.checking && card.checkMessage && !card.verified && (
                      <p className="logistics-card-check-msg logistics-card-not-found">{card.checkMessage}</p>
                    )}
                    {!card.checking && card.verified && card.hasExisting && (
                      <p className="logistics-card-check-msg logistics-card-existing">{card.checkMessage}</p>
                    )}
                    <div className={`logistics-meal-options ${!card.verified ? 'logistics-meal-options-disabled' : ''}`}>
                      {mealOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`logistics-meal-option ${card.meal === option.value ? 'logistics-meal-option-selected' : ''}`}
                          onClick={() => card.verified && saveMeal(index, option.value)}
                          disabled={!card.verified}
                        >
                          {option.image ? <img src={option.image} alt={option.label} className="logistics-meal-option-img" /> : <span className="logistics-meal-icon">{option.icon}</span>}
                          <span className="logistics-meal-title">{option.label}</span>
                        {option.description && <span className="logistics-meal-desc">{option.description}</span>}
                        </button>
                      ))}
                    </div>
                    {saveStatus && saveStatus.index === index && saveStatus.status === 'saving' && (
                      <div className="logistics-toast logistics-toast-saving">
                        <span className="logistics-spinner"></span> Saving...
                      </div>
                    )}
                    {saveStatus && saveStatus.index === index && saveStatus.status === 'saved' && (
                      <div className="logistics-toast logistics-toast-saved">
                        <div className="logistics-toast-text">&#10003; Saved!</div>
                        <div className="logistics-toast-bar"><div className="logistics-toast-bar-fill"></div></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button type="button" className="logistics-add-person" onClick={addPerson}>
              + Add another person
            </button>
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
