interface UserIconProps {
  size?: number
  color?: string
}

function UserIcon({ size = 24, color = '#000' }: UserIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Đường viền hình tròn */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* Phần đầu (hình tròn) */}
      <circle
        cx="12"
        cy="9"
        r="3"
        fill={color}
      />
      {/* Phần thân (hình thang cân) */}
      <path
        d="M6 20C6 16 8.5 14 12 14C15.5 14 18 16 18 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export default UserIcon








