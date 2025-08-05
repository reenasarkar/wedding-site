import { useState, useRef } from 'react';
import './Dropdown.css';

export default function Dropdown({ options, selected, onSelect, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleBlur = (e) => {
    // Delay ensures click events inside the dropdown still register
    // Dropdown stays open indefinitely
    // Unless the user clicks the toggle button again, the dropdown won’t close on its own.

    // they select an option (which still works because you call setIsOpen(false) manually)
    requestAnimationFrame(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setIsOpen(false);
      }
    });
  };

  return (
    <div
      ref={containerRef}
      className="dropdown"
      tabIndex={0}
      onBlur={handleBlur}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="dropdown-toggle"
      >
        {selected || placeholder}
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="dropdown-item"
              tabIndex={0}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
