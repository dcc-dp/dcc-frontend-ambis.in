interface SvgIconProps {
  className: string;
  d: string;
}

export function SvgIcon({ className, d }: SvgIconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}
