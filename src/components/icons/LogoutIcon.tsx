interface LogoutIconProps {
  size?: number
  color?: string
}

function LogoutIcon({ size = 24, color = '#000' }: LogoutIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hình chữ nhật với góc bo tròn bên trái, mở ra bên phải */}
      <path
        d="M5 4C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H11"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Mũi tên dày hướng sang phải */}
      <path
        d="M16 12L13 9M16 12L13 15M16 12H9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LogoutIcon

