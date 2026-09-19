type IconProps = { size?: number; strokeWidth?: number };

function Base({ children, size = 18, strokeWidth = 1.8 }: IconProps & { children: React.ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

export const HomeIcon = (props: IconProps) => <Base {...props}><path d="m3 10 9-7 9 7"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></Base>;
export const TargetIcon = (props: IconProps) => <Base {...props}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="m15.2 8.8 3.2-3.2"/><path d="M18.5 5.5h-3v3"/></Base>;
export const MicIcon = (props: IconProps) => <Base {...props}><rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8.5 21h7"/></Base>;
export const ChartIcon = (props: IconProps) => <Base {...props}><path d="M4 19V5"/><path d="M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/><path d="M18 6h2v2"/></Base>;
export const LibraryIcon = (props: IconProps) => <Base {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/><path d="M8 7h8M8 10h6"/></Base>;
export const SettingsIcon = (props: IconProps) => <Base {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.02 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.02-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.02H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06A1.7 1.7 0 0 0 11.64 6a1.7 1.7 0 0 0 1.02-1.56V4h2.4v.44A1.7 1.7 0 0 0 16.08 6a1.7 1.7 0 0 0 1.88.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.02h.44v2.4h-.44A1.7 1.7 0 0 0 19.4 15Z"/></Base>;
export const ArrowRightIcon = (props: IconProps) => <Base {...props}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Base>;
export const ArrowLeftIcon = (props: IconProps) => <Base {...props}><path d="M19 12H6"/><path d="m11 18-6-6 6-6"/></Base>;
export const CheckIcon = (props: IconProps) => <Base {...props}><path d="m5 12 4 4L19 6"/></Base>;
export const FlameIcon = (props: IconProps) => <Base {...props}><path d="M12.5 21c4.1-.3 7-3.15 7-7.1 0-3.4-2.1-6.2-5.7-8.9.16 2.5-1.03 3.95-2.35 4.88C11.75 5.7 9.82 3.7 8.3 3c.28 3.38-1.9 4.88-2.6 7.45C4.65 15.1 7.45 20.6 12.5 21Z"/><path d="M10.6 15.2c0 1.55.94 2.8 2.25 2.8 1.6 0 2.4-1.32 2.4-2.85 0-1.13-.6-2.02-1.5-2.86-.03 1.1-.5 1.64-1.1 2.03-.15-1.1-.64-1.75-1.15-2.1-.17 1.12-.9 1.64-.9 2.98Z"/></Base>;
export const ClockIcon = (props: IconProps) => <Base {...props}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></Base>;
export const BookIcon = (props: IconProps) => <Base {...props}><path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2V5Z"/><path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2V5Z"/></Base>;
export const SparkIcon = (props: IconProps) => <Base {...props}><path d="m12 3-1.2 5.3L6 10l4.8 1.7L12 17l1.2-5.3L18 10l-4.8-1.7L12 3Z"/><path d="m19 16-.55 2.45L16 19l2.45.55L19 22l.55-2.45L22 19l-2.45-.55L19 16Z"/></Base>;
export const ChevronRightIcon = (props: IconProps) => <Base {...props}><path d="m9 5 7 7-7 7"/></Base>;
export const RefreshIcon = (props: IconProps) => <Base {...props}><path d="M20 11a8 8 0 0 0-14.7-3L3 11"/><path d="M3 5v6h6"/><path d="M4 13a8 8 0 0 0 14.7 3L21 13"/><path d="M21 19v-6h-6"/></Base>;
export const AlertIcon = (props: IconProps) => <Base {...props}><path d="M10.3 4.1 2.6 17.5A1.7 1.7 0 0 0 4.1 20h15.8a1.7 1.7 0 0 0 1.5-2.5L13.7 4.1a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/></Base>;
export const VolumeIcon = (props: IconProps) => <Base {...props}><path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9.5a4 4 0 0 1 0 5"/><path d="M17.5 7a7.5 7.5 0 0 1 0 10"/></Base>;
export const GearIcon = SettingsIcon;
