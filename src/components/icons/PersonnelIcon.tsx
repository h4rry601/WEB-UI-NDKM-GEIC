interface PersonnelIconProps {
  size?: number
  color?: string
}

function PersonnelIcon({ size = 24, color = '#000' }: PersonnelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M2 21C2 17 4.5 15 9 15C13.5 15 16 17 16 21" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="18" cy="8" r="3" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M22 21C22 18.5 20.5 17 18 17" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export default PersonnelIcon

