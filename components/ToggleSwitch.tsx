"use client";

import React from 'react';

const ToggleSwitch: React.FC<{ isOn: boolean; onToggle: () => void }> = ({ isOn, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
        isOn ? 'bg-cyan-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
          isOn ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;