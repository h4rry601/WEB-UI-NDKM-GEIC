interface TimekeepingIconProps {
  size?: number
  color?: string
}

function TimekeepingIcon({ size = 24, color = '#000' }: TimekeepingIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 4V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 4V8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M12 13V16L14 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default TimekeepingIcon

