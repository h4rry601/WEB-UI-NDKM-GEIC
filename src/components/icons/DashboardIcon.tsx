interface DashboardIconProps {
  size?: number
  color?: string
}

function DashboardIcon({ size = 24, color = '#000' }: DashboardIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  )
}

export default DashboardIcon

