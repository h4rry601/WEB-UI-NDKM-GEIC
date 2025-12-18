interface ReportsIconProps {
  size?: number
  color?: string
}

function ReportsIcon({ size = 24, color = '#000' }: ReportsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M3 9H21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 21V9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 21V13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

export default ReportsIcon

