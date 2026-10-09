/* Line icons drawn on a 24px grid, the same set used in the Figma file. Decorative by default. */
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  bed: <path d="M3 19V6M3 13h18v6M3 16h18M7 13v-2.5A1.5 1.5 0 0 1 8.5 9h3a1.5 1.5 0 0 1 1.5 1.5V13" />,
  bath: <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />,
  area: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 11V8h3M16 13v3h-3" /></>,
  lot: <path d="M4 20 9 4h6l5 16zM8 14h8" />,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  heart: <path d="M12 20s-7.5-4.6-9.2-9.4A4.7 4.7 0 0 1 12 7.2a4.7 4.7 0 0 1 9.2 3.4C19.5 15.4 12 20 12 20z" />,
  phone: <path d="M6 3.5h3l1.8 4.6-2.3 1.4a11 11 0 0 0 6 6l1.4-2.3 4.6 1.8v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4 5.5a2 2 0 0 1 2-2z" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  share: <path d="M12 4v11M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  images: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 8" /></>,
  sliders: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>,
  map: <path d="M9 5 4 7v12l5-2 6 2 5-2V5l-5 2-6-2zM9 5v12M15 7v12" />,
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5.5v13l11-6.5z" />,
  back: <path d="m15 6-6 6 6 6" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
