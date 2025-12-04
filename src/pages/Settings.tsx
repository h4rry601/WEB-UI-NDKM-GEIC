import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import './Settings.css'

function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSidebarHoverChange = (open: boolean) => {
    setIsSidebarOpen(open)
  }

  return (
    <div className={`settings-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar activePage="settings" isOpen={isSidebarOpen} onHoverChange={handleSidebarHoverChange} />
      <div className="settings-main">
        <div className="settings-content">
          <header className="settings-header">
            <div>
              <p className="settings-breadcrumb">Hệ thống &rsaquo; Cài đặt</p>
              <h1>Cài đặt hệ thống</h1>
            </div>
          </header>

          <section className="settings-card">
            <div className="settings-coming-soon">
              <h2>Chức năng này đang phát triển</h2>
              <p>Trang cài đặt đang được phát triển và sẽ sớm có mặt trong phiên bản tiếp theo.</p>
              <p className="coming-soon-subtitle">Vui lòng quay lại sau!</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings


