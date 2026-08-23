import React, { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Tractor, Cross, ShieldCheck } from 'lucide-react';
import { RegistrationModal } from './RegistrationModal';

const roles = [
  { id: 'farmer', label: 'Farmer', icon: Tractor, defaultUser: 'farmerA', defaultPass: 'password' },
  { id: 'vet', label: 'Veterinarian', icon: Cross, defaultUser: 'vet1', defaultPass: 'password' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, defaultUser: 'admin1', defaultPass: 'password' },
];

export function LoginPanel({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showNotice, setShowNotice] = useState(false);
  const [remember, setRemember] = useState(false);
  
  // Empty credentials initially
  const [holdingId, setHoldingId] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: holdingId, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        setSubmitting(false);
        return;
      }
      
      setSubmitting(false);
      if (onLogin) onLogin(data, remember);
    } catch (err) {
      setAuthError('Network error connecting to server');
      setSubmitting(false);
    }
  }

  const handleQuickLogin = (role) => {
    setHoldingId(role.defaultUser);
    setPassword(role.defaultPass);
  };

  return (
    <section
      aria-labelledby="signin-heading"
      className="relative flex items-center justify-center border-t border-primary/10 bg-card px-6 py-12 sm:px-10 lg:min-h-screen lg:border-t-0 lg:border-l lg:py-16"
    >
      <div
        aria-hidden="true"
        className="paper-grain pointer-events-none absolute inset-0 text-primary/[0.05]"
      />

      <div className="relative w-full max-w-[26rem]">
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-clay uppercase">
          <LockKeyhole className="w-3 h-3" aria-hidden="true" />
          Restricted access
        </p>

        <h2
          id="signin-heading"
          className="mt-3 font-serif text-3xl leading-tight tracking-tight text-primary"
        >
          Sign in to FarmGuard
        </h2>
        
        {/* Quick Login Roles */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleQuickLogin(role)}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-primary/10 bg-secondary/30 p-3 transition-all hover:bg-primary/5 hover:border-primary/30 hover:shadow-sm active:scale-95 group"
            >
              <div className="p-2 rounded-lg bg-background border border-border group-hover:border-primary/20 group-hover:text-primary transition-colors text-primary/60 shadow-sm">
                <role.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-primary/80 group-hover:text-primary">{role.label}</span>
            </button>
          ))}
        </div>
        
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs font-medium leading-6">
            <span className="bg-card px-4 text-primary/50 uppercase tracking-widest">Or sign in manually</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          {authError && (
            <div className="mb-4 rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-sm font-medium text-red-500">{authError}</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="holding-id"
                className="text-[0.8125rem] font-medium text-primary"
              >
                Username
              </label>
              <input
                id="holding-id"
                name="holding-id"
                type="text"
                autoComplete="username"
                required
                value={holdingId}
                onChange={(e) => setHoldingId(e.target.value)}
                placeholder="e.g. farmerA or vet1"
                className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 font-mono text-sm text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-[0.8125rem] font-medium text-primary"
                >
                  Password
                </label>
                <a
                  href="#forgot-password"
                  className="text-[0.8125rem] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="h-11 w-full rounded-md border border-input bg-background pr-11 pl-3 text-sm text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex w-fit cursor-pointer items-center gap-2.5 py-1 text-[0.8125rem] text-muted-foreground transition-colors hover:text-primary">
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded-[3px] border border-input accent-primary"
              />
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium tracking-wide text-primary-foreground transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary/90 hover:shadow-[0_12px_28px_-14px_oklch(0.33_0.058_156_/_0.7)] active:scale-95 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100"
          >
            {submitting && (
              <LoaderCircle
                className="w-4 h-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {submitting ? 'Verifying credentials' : 'Sign In'}
          </button>

          <p className="mt-4 text-center font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">
            Secure access · Role-based records · Encrypted transmission
          </p>
        </form>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-[0.875rem] text-muted-foreground">
            New holding?{' '}
            <button
              onClick={() => setShowNotice(true)}
              type="button"
              className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-clay hover:decoration-clay cursor-pointer"
            >
              Request field-officer registration
            </button>
          </p>
        </div>
      </div>
      <RegistrationModal isOpen={showNotice} onClose={() => setShowNotice(false)} />
    </section>
  );
}
