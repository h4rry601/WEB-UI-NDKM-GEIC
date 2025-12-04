import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PersonnelIcon from './PersonnelIcon'
import SettingsIcon from './SettingsIcon'
import LogoutIcon from './LogoutIcon'
import UserIcon from './UserIcon'
import ConfirmDialog from './ConfirmDialog'
import gsafeLogo from '../assets/images/logo Gsafe.png'
import './Sidebar.css'

interface SidebarProps {
  activePage?: string
  isOpen?: boolean
  onHoverChange?: (open: boolean) => void
}

function Sidebar({ activePage = 'dashboard', isOpen = true, onHoverChange }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    logout()
    navigate('/login')
    setShowLogoutConfirm(false)
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const menuItems = [
    { id: 'personnel', label: 'Nhân sự', icon: PersonnelIcon, path: '/dashboard' },
    { id: 'settings', label: 'Cài đặt', icon: SettingsIcon, path: '/settings' }
  ]

  const currentPath = location.pathname
  const isActive = (itemId: string) => {
    if (itemId === 'personnel' && currentPath === '/dashboard') return true
    if (itemId === 'settings' && currentPath === '/settings') return true
    return activePage === itemId
  }

  const handleMouseEnter = () => onHoverChange?.(true)
  const handleMouseLeave = () => onHoverChange?.(false)

  return (
    <div
      className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        {isOpen && (
          <div className="sidebar-header-content">
            <img src={gsafeLogo} alt="GSafe logo" className="sidebar-logo" />
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const active = isActive(item.id)
          return (
            <button
              key={item.id}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent size={20} color={active ? '#2B99D4' : '#666'} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="user-profile">
            <div className="user-avatar">
              <UserIcon size={24} color="#2B99D4" />
            </div>
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-email">admin@company.com</div>
            </div>
          </div>
        )}
        {isOpen && (
          <button className="logout-button" onClick={handleLogoutClick}>
            <LogoutIcon size={20} color="#666" />
            <span>Đăng xuất</span>
          </button>
        )}
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất tài khoản?"
        confirmLabel="Đăng xuất"
        cancelLabel="Hủy"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  )
}

export default Sidebar

