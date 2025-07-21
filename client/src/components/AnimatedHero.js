import React, { useEffect } from 'react';
import './AnimatedHero.css';

export default function AnimatedHero() {
  useEffect(() => {
    const words = document.querySelectorAll('.word');
    words.forEach((word, i) => {
      word.addEventListener('mouseenter', () => {
        word.style.transform = 'scale(1.1) translateY(-5px)';
      });
      word.addEventListener('mouseleave', () => {
        word.style.transform = 'scale(1) translateY(0)';
      });
    });

    document.addEventListener('click', () => {
      words.forEach((word, index) => {
        word.style.animation = 'none';
        setTimeout(() => {
          word.style.animation = `wordReveal 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards`;
          word.style.animationDelay = `${0.2 + index * 0.2}s`;
        }, 50);
      });
    });

    // Cleanup not strictly needed here
  }, []);

  return (
    <div className="tagline-container">
      <div className="pulse-ring"></div>
      <div className="security-icons">
        <div className="icon">🔒</div>
        <div className="icon">🛡️</div>
        <div className="icon">💎</div>
        <div className="icon">⚡</div>
      </div>
      <h1 className="main-text">
        <span className="word">Secure</span>
        <span className="word"> Your</span>
        <span className="word"> Finances,</span><br />
        <span className="word">Secure</span>
        <span className="word">Your</span>
        <span className="word">Future</span>
      </h1>
      <p className="subtitle">
        <span className="tagline-word">Building</span>
        <span className="tagline-word">wealth</span>
        <span className="tagline-word">through</span>
        <span className="tagline-word">smart</span>
        <span className="tagline-word">financial</span>
        <span className="tagline-word">decisions</span>
        <span className="underline-effect"></span>
      </p>
      <div className="particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>
    </div>
  )
}
