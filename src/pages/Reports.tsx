import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { reportService, StrangerReport, AttendanceReport } from '../services/reportService'
import './Reports.css'

type ReportType = 'attendance' | 'strangers'

function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ReportType>('attendance')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  
  const [attendanceData, setAttendanceData] = useState<AttendanceReport[]>([])
  const [strangerData, setStrangerData] = useState<StrangerReport[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSidebarHoverChange = (open: boolean) => {
    setIsSidebarOpen(open)
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'attendance') {
        const response = await reportService.getAttendance(selectedDate)
        // Check if response is array or wrapped in data property
        // Assuming API returns { success: true, data: [...] } or just [...]
        const data = Array.isArray(response) ? response : (response.data || [])
        setAttendanceData(data)
      } else {
        const response = await reportService.getStrangers(selectedDate)
        const data = Array.isArray(response) ? response : (response.data || [])
        setStrangerData(data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      // For demo purposes, keep data empty or set mock data if needed
      if (activeTab === 'attendance') {
          setAttendanceData([])
      } else {
          setStrangerData([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab, selectedDate])

  const renderAttendanceTable = () => (
    <table className="reports-table">
      <thead>
        <tr>
          <th>Mã NV</th>
          <th>Họ tên</th>
          <th>Thời gian vào</th>
          <th>Thời gian ra</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {attendanceData.length > 0 ? (
          attendanceData.map((item, index) => (
            <tr key={index}>
              <td>{item.employeeId}</td>
              <td>{item.employeeName}</td>
              <td>{item.timeIn}</td>
              <td>{item.timeOut || '--:--'}</td>
              <td>
                <span className={`status-badge status-${item.status}`}>
                  {item.status === 'present' ? 'Đúng giờ' : 
                   item.status === 'late' ? 'Đi muộn' : 'Vắng mặt'}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="empty-state">Không có dữ liệu điểm danh cho ngày này</td>
          </tr>
        )}
      </tbody>
    </table>
  )

  const renderStrangersTable = () => (
    <table className="reports-table">
      <thead>
        <tr>
          <th>Hình ảnh</th>
          <th>Thời gian</th>
          <th>Vị trí Camera</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {strangerData.length > 0 ? (
          strangerData.map((item, index) => (
            <tr key={index}>
              <td>
                <img 
                  src={item.imageUrl} 
                  alt="Stranger" 
                  className="stranger-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60?text=No+Img'
                  }}
                />
              </td>
              <td>{item.time}</td>
              <td>{item.cameraLocation || 'Unknown'}</td>
              <td>
                <button className="btn-action">Chi tiết</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="empty-state">Không phát hiện người lạ trong ngày này</td>
          </tr>
        )}
      </tbody>
    </table>
  )

  return (
    <div className={`reports-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar activePage="reports" isOpen={isSidebarOpen} onHoverChange={handleSidebarHoverChange} />
      
      <div className="reports-main">
        <header className="reports-header">
          <p className="reports-breadcrumb">Hệ thống &rsaquo; Báo cáo</p>
          <h1>Báo cáo & Thống kê</h1>
        </header>

        <div className="reports-controls">
          <div className="reports-tabs">
            <button 
              className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Điểm danh nhân viên
            </button>
            <button 
              className={`tab-btn ${activeTab === 'strangers' ? 'active' : ''}`}
              onClick={() => setActiveTab('strangers')}
            >
              Cảnh báo người lạ
            </button>
          </div>

          <div className="date-picker-container">
            <label htmlFor="report-date">Ngày xem:</label>
            <input 
              type="date" 
              id="report-date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="reports-content">
          <div className="table-container">
            {isLoading ? (
              <div className="empty-state">Đang tải dữ liệu...</div>
            ) : (
              activeTab === 'attendance' ? renderAttendanceTable() : renderStrangersTable()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
