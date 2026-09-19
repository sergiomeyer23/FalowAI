type IconProps = { size?: number };
function Base({ children, size = 16 }: IconProps & { children: React.ReactNode }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>; }
export const LockIcon = (props: IconProps) => <Base {...props}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/></Base>;
export const ArrowRightIcon = (props: IconProps) => <Base {...props}><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></Base>;
export const ArrowLeftIcon = (props: IconProps) => <Base {...props}><path d="M19 12H6"/><path d="m11 18-6-6 6-6"/></Base>;
