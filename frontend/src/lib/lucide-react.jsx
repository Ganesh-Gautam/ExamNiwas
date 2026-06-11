/* eslint-disable react-refresh/only-export-components */

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

function Icon({ children, size = 24, className, ...props }) {
  return (
    <svg
      {...baseProps}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const createIcon = (paths) => function LucideIcon(props) {
  return <Icon {...props}>{paths}</Icon>;
};

export const ArrowRight = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
);

export const ArrowLeft = createIcon(
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>
);

export const BadgeCheck = createIcon(
  <>
    <path d="m16 3 1.4 2.8 3.1.4-2.2 2.2.5 3.1L16 10.8l-2.8 1.4.5-3.1-2.2-2.2 3.1-.4L16 3Z" />
    <path d="m9 12 2 2 4-4" />
    <path d="M12 21a8 8 0 1 1 0-16" />
  </>
);

export const BookCheck = createIcon(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    <path d="m9 10 2 2 4-4" />
  </>
);

export const BookOpenCheck = createIcon(
  <>
    <path d="M12 7v14" />
    <path d="M3 5.5C3 4.1 4.1 3 5.5 3H12v16H5.5A2.5 2.5 0 0 0 3 21.5Z" />
    <path d="M21 5.5C21 4.1 19.9 3 18.5 3H12v16h6.5a2.5 2.5 0 0 1 2.5 2.5Z" />
    <path d="m8 10 1.5 1.5L12 9" />
  </>
);

export const BookOpenText = createIcon(
  <>
    <path d="M12 7v14" />
    <path d="M3 5.5C3 4.1 4.1 3 5.5 3H12v16H5.5A2.5 2.5 0 0 0 3 21.5Z" />
    <path d="M21 5.5C21 4.1 19.9 3 18.5 3H12v16h6.5a2.5 2.5 0 0 1 2.5 2.5Z" />
    <path d="M7.5 8H10" />
    <path d="M7.5 11H10" />
  </>
);

export const ClipboardCheck = createIcon(
  <>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </>
);

export const ClipboardList = createIcon(
  <>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M8 11h8" />
    <path d="M8 15h8" />
  </>
);

export const Eye = createIcon(
  <>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const EyeOff = createIcon(
  <>
    <path d="M3 3 21 21" />
    <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
    <path d="M9.5 5.2A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-5 5.8" />
    <path d="M6.7 6.7C3.8 8.5 2 12 2 12a17.8 17.8 0 0 0 10 7 10.6 10.6 0 0 0 2.5-.3" />
  </>
);

export const FileSpreadsheet = createIcon(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M10 13v4" />
    <path d="M14 13v4" />
  </>
);

export const GraduationCap = createIcon(
  <>
    <path d="m2 10 10-5 10 5-10 5-10-5Z" />
    <path d="M6 12v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
  </>
);

export const ImagePlus = createIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m8 13 2.5-2.5L16 16" />
    <path d="M14 8h.01" />
    <path d="M19 2v6" />
    <path d="M16 5h6" />
  </>
);

export const LockKeyhole = createIcon(
  <>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    <circle cx="12" cy="16" r="1" />
  </>
);

export const LogOut = createIcon(
  <>
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
    <path d="M13 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8" />
  </>
);

export const Mail = createIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>
);

export const PenSquare = createIcon(
  <>
    <path d="M11 4H5a2 2 0 0 0-2 2v13a1 1 0 0 0 1 1h13a2 2 0 0 0 2-2v-6" />
    <path d="M18.5 2.5a2.1 2.1 0 1 1 3 3L12 15l-4 1 1-4Z" />
  </>
);

export const ShieldCheck = createIcon(
  <>
    <path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6Z" />
    <path d="m9 12 2 2 4-4" />
  </>
);

export const Upload = createIcon(
  <>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
  </>
);

export const UserRound = createIcon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
  </>
);

export const Users = createIcon(
  <>
    <path d="M16 21a5 5 0 0 0-10 0" />
    <circle cx="11" cy="7" r="4" />
    <path d="M22 21a5 5 0 0 0-7-4.6" />
    <path d="M16 3.1a4 4 0 0 1 0 7.8" />
  </>
);

export const CalendarDays = createIcon(
  <>
    <path d="M17 6.5V2" />
    <path d="M7 6.5V2" />
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 10H8" />
  </>
);

export const Clock3 = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M12 6v6" />
    <path d="M12 6v6l2 4" />
  </>
);

export const PlusCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </>
);

export const TimerReset = createIcon(
  <>
    <path d="M10 2h4" />
    <path d="M12 14v-4" />
    <path d="M4 13a8 8 0 1 1 8 8H4" />
    <path d="M4 13l3-3" />
    <path d="M12 6v4l2 2" />
  </>
);

export const CircleHelp = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </>
);

export const ListChecks = createIcon(
  <>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m9 12 2 2 4-4" />
    <path d="M16 2v4" />
    <path d="M21 2h-4" />
    <path d="M16 6h4" />
  </>
);

export const Plus = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>
);

export const Trash2 = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </>
);

export const Edit3 = createIcon(
  <>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
  </>
);

export const Save = createIcon(
  <>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </>
);

export const X = createIcon(
  <>
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </>
);

export const Sun = createIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </>
);

export const Moon = createIcon(
  <>
    <path d="M12 3a6 6 0 0 0 9 7.5A9 9 0 1 1 12 3Z" />
  </>
);

export const BookOpen = createIcon(
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>
);

export const AlertCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
);

export const Edit2 = createIcon(
  <>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
  </>
);
