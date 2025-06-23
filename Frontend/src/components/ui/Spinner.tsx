import React from 'react';

interface SpinnerProps {
  size?: number; // tailwind h-w values
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 6, className = '' }) => (
  <svg
    className={`animate-spin h-${size} w-${size} text-code-green ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

export default Spinner;
