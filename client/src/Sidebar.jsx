import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Menu</h2>
        </div>
        <div className="sidebar-divider"/>
        <nav>
          <ul className='nav-list'>
            {[
              { href: '/home', label: 'Home' },
              { href: '/travel', label: 'Travel & Stay' },
              { href: '/schedule', label: 'Event Schedule' },
              { href: '/rsvp', label: 'RSVP' },
              { href: '/about', label: 'About One & Only' },
            ].map((item) => (
              <li key={item.href} className='nav-item'>
                <a
                  href={item.href}
                  className='nav-link'
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <footer className="sidebar-footer">
          © 2026 Reena Sarkar
        </footer>
      </aside>
    </div>
  );
}