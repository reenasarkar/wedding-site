
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
      </header>
    </div>
  )
}