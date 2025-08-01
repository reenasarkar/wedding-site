import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Font loading check
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    console.log('Reena says the fonts loaded successfully');
    console.log('Reena also says hello!\nShe is wondering why you are looking at the console!\nIf there is an issue please let her know.');
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
