import React from 'react';
import { BrandMark } from './BrandMark';

export function FarmHero() {
  return (
    <section
      aria-labelledby="brand-heading"
      className="relative flex flex-col overflow-hidden bg-background-login lg:min-h-screen"
    >
      {/* data grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-primary/[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative flex flex-col gap-8 px-6 pt-10 sm:px-10 lg:pt-14">
        <div className="pr-rise flex items-start gap-3">
          <BrandMark className="mt-0.5 size-9 shrink-0 text-primary" />
          <div>
            <h1
              id="brand-heading"
              className="font-serif text-[1.6rem] leading-none tracking-tight text-primary"
            >
              FarmGuard
            </h1>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
              Farm MRL &amp; AMU Monitoring Portal
            </p>
          </div>
        </div>

        <p
          className="pr-rise max-w-md font-serif text-2xl leading-[1.25] text-pretty text-primary sm:text-[1.9rem] lg:max-w-lg"
          style={{ animationDelay: '80ms' }}
        >
          Every dose logged. Every limit checked.
        </p>
      </div>

      {/* farm scene */}
      <div className="relative mt-8 w-full grow lg:mt-10">
        <div className="relative mt-auto aspect-[978/653] w-full lg:absolute lg:inset-x-0 lg:bottom-0">
          <img
            src="/images/farm-scene.png"
            alt="Illustration of a monitored livestock holding: pasture hills, a barn with silo, fencing and grazing cattle and goats"
            className="object-cover w-full h-full"
          />

          {/* scanning sweep */}
          <div
            aria-hidden="true"
            className="pr-scan absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          />

        </div>
      </div>
    </section>
  );
}
