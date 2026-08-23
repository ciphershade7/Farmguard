import React from 'react';
import { FarmHero } from './FarmHero';
import { LoginPanel } from './LoginPanel';
import { TopNav } from './TopNav';

export function LoginPage({ onLogin }) {
  return (
    <main className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_minmax(28rem,0.95fr)] bg-background-login">
      <TopNav />
      <FarmHero />
      <LoginPanel onLogin={onLogin} />
    </main>
  );
}
