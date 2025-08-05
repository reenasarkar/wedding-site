
import { useState, useEffect } from "react";
import logo from './wedding-logo.png';
import './App.css';

export default function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} className="app-logo" alt="Wedding Logo" />
        <h1 className="home-title">Big Sky, MT</h1>
        <p className="home-date"><b>Memorial Weekend:</b> Saturday, May 23 - Monday, May 25, 2026</p>
        <p>Welcome to our wedding website! We're so excited to have you here.  Please take a look around! </p>
                  <p className="bug-report-text">If you find a bug 🐞🐛 contact <span className="reena-tooltip">Reena</span>. Or if you want to compliment this website please also contact <span className="reena-tooltip">Reena</span></p>
      </header>
    </div>
  )
}