import React, { useState, useEffect, useRef } from 'react';
import logo from './wedding-logo.png';
import zukoTummy from './zuko-tummy.png';
import zukoBall from './zuko-ball.png';
import zukoHappy from './zuko-is-searching.png';
import './Gifts.css';

const VENMO_LINK = 'https://venmo.com/u/Reena-Sarkar';
const STRIPE_LINK_HONEYMOON = 'https://buy.stripe.com/cNibJ3eAF6lfg7B7qN0kE01';
const STRIPE_LINK_ADVENTURE = 'https://buy.stripe.com/00w8wR0JP4d7cVp4eB0kE02';
const STRIPE_LINK_DONATE = 'https://buy.stripe.com/bJecN750S4Z08Dh1n0kE03';

const fundOptions = [
  { value: 'honeymoon', label: 'Honeymoon & Life Fund', zukoImg: zukoTummy, emojis: '🇯🇵 🇮🇳 🇮🇸 🇫🇷 🇹🇼', stripeLink: STRIPE_LINK_HONEYMOON,
    description: "Help us build our life together and kick off our honeymoon! From setting up our home to exploring somewhere new on our first trip as a married couple — your gift goes toward making it all happen." },
  { value: 'adventure', label: 'Outdoor Adventure Fund', zukoImg: zukoBall, emojis: '🏌️ ⛷️ 🥾 ⛰️ 🚴', stripeLink: STRIPE_LINK_ADVENTURE,
    description: "Reena and Varun love doing outdoor activities together — whether it's skiing, hiking, or golfing. Help us gear up for our next adventure!" },
  { value: 'donate_in_name', label: 'Donate in Our Name', zukoImg: zukoHappy, emojis: '❤️ 💕 🐾 🌎 ❤️', stripeLink: STRIPE_LINK_DONATE,
    description: "Make an impact that lasts beyond our wedding day. In lieu of a traditional gift, choose a cause close to our hearts and we'll make sure your generosity reaches the right place." },
];

const donationCauses = [
  { value: 'aspca', label: 'ASPCA — Animal rescue and welfare (very Zuko-coded)' },
  { value: 'nature-conservancy', label: 'The Nature Conservancy — Land and wildlife conservation' },
  { value: 'team-for-kids', label: 'Team for Kids — Youth fitness programs for underserved kids' },
];

export default function Gifts() {
  const [name, setName] = useState('');
  const [associatedNames, setAssociatedNames] = useState([]);
  const [newAssocName, setNewAssocName] = useState('');
  const [selectedFund, setSelectedFund] = useState('');
  const [donationOption, setDonationOption] = useState('');
  const [donationRecord, setDonationRecord] = useState(null);
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
          loadDonationRecord(result.guest.name);
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
      setAssociatedNames([]);
      setNewAssocName('');
      setSelectedFund('');
      setDonationRecord(null);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      return;
    }

    if (guestValidation.isValid) {
      setAssociatedNames([]);
      setNewAssocName('');
      setSelectedFund('');
      setDonationRecord(null);
    }

    setGuestValidation((prev) => ({ ...prev, isChecking: true, message: '' }));

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      checkGuest(value);
    }, 2000);
  };

  const loadDonationRecord = async (guestName) => {
    try {
      const response = await fetch(`/api/gift-donation/${encodeURIComponent(guestName)}`);
      if (response.ok) {
        const result = await response.json();
        if (result.donation) {
          setDonationRecord(result.donation);
          setAssociatedNames(result.donation.associated_names || []);
          if (result.donation.donation_option) {
            setDonationOption(result.donation.donation_option);
          }
        }
      }
    } catch (error) {
      console.error('Error loading donation record:', error);
    }
  };

  const saveNames = async (names) => {
    try {
      await fetch('/api/gift-donation/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, associatedNames: names }),
      });
    } catch (error) {
      console.error('Error saving names:', error);
    }
  };

  const addAssociatedName = () => {
    const trimmed = newAssocName.trim();
    if (trimmed && !associatedNames.includes(trimmed)) {
      const updated = [...associatedNames, trimmed];
      setAssociatedNames(updated);
      saveNames(updated);
    }
    setNewAssocName('');
  };

  const removeAssociatedName = (nameToRemove) => {
    const updated = associatedNames.filter((n) => n !== nameToRemove);
    setAssociatedNames(updated);
    saveNames(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAssociatedName();
    }
  };

  const handlePayment = async (href) => {
    try {
      await fetch('/api/gift-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: name,
          fund: selectedFund,
          associatedNames,
          donationOption: selectedFund === 'donate_in_name' ? donationOption : null,
        }),
      });
      // Update local record so the checkmark shows immediately
      setDonationRecord((prev) => ({
        ...(prev || {}),
        [selectedFund === 'donate_in_name' ? 'donate_in_name' : selectedFund]: true,
      }));
    } catch (error) {
      console.error('Error saving donation:', error);
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const undoDonation = async (fund) => {
    try {
      await fetch('/api/gift-donation/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: name, fund }),
      });
      const key = fund === 'donate_in_name' ? 'donate_in_name' : fund;
      setDonationRecord((prev) => ({ ...prev, [key]: false }));
    } catch (error) {
      console.error('Error undoing donation:', error);
    }
  };

  const isVerified = guestValidation.isValid;
  const activeFund = fundOptions.find((f) => f.value === selectedFund);

  const donatedFunds = donationRecord
    ? fundOptions.filter((f) => {
        const key = f.value === 'donate_in_name' ? 'donate_in_name' : f.value;
        return donationRecord[key];
      })
    : [];

  return (
    <div className="gifts">
      <img src={logo} className="page-app-logo" alt="logo" />

      <div className="gifts-main">
        <h1>Gifts</h1>
        <p className="gifts-intro">
          Your presence at our wedding is the greatest gift of all. If you'd like to contribute to our next chapter together, here are a few ways to do it.
        </p>
        <div className="gifts-name-check">
          <label htmlFor="gifts-name">Enter your name to get started</label>
          <input
            type="text"
            id="gifts-name"
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
          <div className="gifts-associate-names">
            <p className="gifts-associate-label">Want to include others on your gift?</p>
            <div className="gifts-associate-input-row">
              <input
                type="text"
                value={newAssocName}
                onChange={(e) => setNewAssocName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a name"
                className="form-input"
              />
              <button type="button" onClick={addAssociatedName} className="gifts-add-button">
                Add
              </button>
            </div>
            {associatedNames.length > 0 && (
              <div className="gifts-name-tags">
                {associatedNames.map((n) => (
                  <span key={n} className="gifts-name-tag">
                    {n}
                    <button type="button" onClick={() => removeAssociatedName(n)} className="gifts-tag-remove">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="gifts-fund-select-label">Pick a gift to send our way!</p>

          <div className="gifts-fund-options">
            {fundOptions.map((f) => {
              const isSelected = selectedFund === f.value;
              const key = f.value === 'donate_in_name' ? 'donate_in_name' : f.value;
              const alreadyDonated = donationRecord && donationRecord[key];
              return (
                <button
                  key={f.value}
                  type="button"
                  className={`gifts-fund-option ${isSelected ? 'gifts-fund-option-selected' : ''} ${alreadyDonated ? 'gifts-fund-option-donated' : ''}`}
                  onClick={() => !alreadyDonated && setSelectedFund(isSelected ? '' : f.value)}
                >
                  <div className="gifts-fund-option-header">
                    <div className="gifts-fund-zuko-icon">
                      <img src={f.zukoImg} alt="Zuko" className="gifts-fund-zuko-img" />
                      <span className="gifts-fund-zuko-emojis">{f.emojis}</span>
                    </div>
                    <span className="gifts-fund-option-title">{f.label}</span>
                    {alreadyDonated && (
                      <span className="gifts-fund-option-badge">Gifted</span>
                    )}
                  </div>
                  {!alreadyDonated && <p className="gifts-fund-option-desc">{f.description}</p>}
                  {alreadyDonated && (
                    <button
                      type="button"
                      className="gifts-undo-button"
                      onClick={(e) => { e.stopPropagation(); undoDonation(f.value); }}
                    >
                      ↩ Undo
                    </button>
                  )}
                </button>
              );
            })}
          </div>

          {activeFund && (
            <div className="gifts-fund-detail">
              {selectedFund === 'donate_in_name' && (
                <div className="donation-options">
                  <p className="donation-options-label">Choose a cause:</p>
                  {donationCauses.map((option) => (
                    <label key={option.value} className="donation-option-label">
                      <input
                        type="radio"
                        name="donationOption"
                        value={option.value}
                        checked={donationOption === option.value}
                        onChange={(e) => setDonationOption(e.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="gifts-payment-buttons">
                <button
                  type="button"
                  className="gift-button gift-button-venmo"
                  onClick={() => handlePayment(VENMO_LINK)}
                >
                  Venmo (No fees)
                </button>
                <button
                  type="button"
                  className="gift-button gift-button-stripe"
                  onClick={() => handlePayment(activeFund.stripeLink)}
                >
                  Credit Card (Stripe)
                </button>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}
