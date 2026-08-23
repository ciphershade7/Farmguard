import React from 'react';

export function BrandMark({ className }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 2.5 27 6.2v9.1c0 6.6-4.4 12.3-11 14.2-6.6-1.9-11-7.6-11-14.2V6.2L16 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 22.5v-6.2m0 0c0-3 2.3-5.4 5.2-5.4 0 3-2.3 5.4-5.2 5.4Zm0 0c0-3-2.3-5.4-5.2-5.4 0 3 2.3 5.4 5.2 5.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
