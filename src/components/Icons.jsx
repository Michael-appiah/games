import React from 'react';

// Crisp Vector Soccer Ball Icon matching SportyBet
export function SoccerBallIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <polygon
        points="12,7 15.8,9.8 14.3,14.2 9.7,14.2 8.2,9.8"
        fill={color}
      />
      <line x1="12" y1="2" x2="12" y2="7" stroke={color} strokeWidth="1.6" />
      <line x1="21.5" y1="9" x2="15.8" y2="9.8" stroke={color} strokeWidth="1.6" />
      <line x1="17.9" y1="20" x2="14.3" y2="14.2" stroke={color} strokeWidth="1.6" />
      <line x1="6.1" y1="20" x2="9.7" y2="14.2" stroke={color} strokeWidth="1.6" />
      <line x1="2.5" y1="9" x2="8.2" y2="9.8" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

// Green Pulsing Soccer Ball Icon for Live Event
export function LiveSoccerBallIcon({ className = "w-4 h-4" }) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <SoccerBallIcon className={className} color="#00E676" />
    </div>
  );
}

// Chevron Down
export function ChevronDownIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Chevron Up
export function ChevronUpIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}

// Remove All Box with X
export function RemoveAllIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  );
}

// Settings Gear
export function SettingsIcon({ className = "w-4 h-4", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Info Circle
export function InfoCircleIcon({ className = "w-3.5 h-3.5", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

// Close Cross
export function CloseIcon({ className = "w-3.5 h-3.5", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Ticket Receipt Icon
export function TicketIcon({ className = "w-5 h-5", color = "currentColor" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  );
}

// Red Loss Cross Circle
export function LossIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#E53935">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9L9 15M9 9L15 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Green Won Checkmark Circle
export function WinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00C853">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12.5L11 15.5L16 9.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
