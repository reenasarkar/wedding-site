import React from 'react';
import logo from './wedding-logo.png';

export default function RVHeader() {
  return (
    <>
      <header className="rv-header">
        <img src={logo} className="page-app-logo" alt="logo" />
        {/* <div className='header-divider'/> */}
      </header>
    </>
  )
}