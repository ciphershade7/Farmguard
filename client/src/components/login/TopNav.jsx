import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { AboutModal } from './AboutModal';
import { GetStartedModal } from './GetStartedModal';

export function TopNav() {
  const [showAbout, setShowAbout] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [language, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'BN' : 'EN');
  };

  return (
    <>
      <nav
      aria-label="Site"
      className="pr-rise absolute top-6 right-6 z-20 flex items-center gap-2 sm:top-8 sm:right-10"
    >
      <button
        onClick={toggleLanguage}
        className="flex h-10 items-center gap-2 rounded-md px-3.5 text-[0.8125rem] font-medium text-primary/80 transition-colors duration-200 hover:bg-primary/[0.06] hover:text-primary cursor-pointer"
        aria-label="Change Language"
      >
        <Globe className="w-4 h-4" />
        <span>{language}</span>
      </button>
      <button
        onClick={() => setShowAbout(true)}
        className="flex h-10 items-center rounded-md px-3.5 text-[0.8125rem] font-medium text-primary/80 transition-colors duration-200 hover:bg-primary/[0.06] hover:text-primary cursor-pointer"
      >
        About
      </button>
      <button
        onClick={() => setShowGetStarted(true)}
        className="flex h-10 items-center rounded-md bg-primary px-4 text-[0.8125rem] font-medium tracking-wide text-primary-foreground transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary/90 hover:shadow-[0_12px_28px_-14px_oklch(0.33_0.058_156_/_0.7)] active:translate-y-px cursor-pointer"
      >
        Get Started
      </button>
    </nav>
    <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    <GetStartedModal isOpen={showGetStarted} onClose={() => setShowGetStarted(false)} />
    </>
  );
}
