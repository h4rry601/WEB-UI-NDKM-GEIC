import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
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

  const getStatusLabel = (status: AttendanceReport['status']) => {
    if (status === 'present') return 'Đúng giờ'
    if (status === 'late') return 'Đi muộn'
    return 'Vắng mặt'
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const escapeCsv = (value: string) => {
    const stringValue = value ?? ''
    const needsQuotes = /[",\n\r]/.test(stringValue)
    const escaped = stringValue.replace(/"/g, '""')
    return needsQuotes ? `"${escaped}"` : escaped
  }

  const handleExportCsv = () => {
    const dateLabel = selectedDate || 'all'
    if (activeTab === 'attendance') {
      if (!attendanceData.length) return
      const headers = ['Mã NV', 'Họ tên', 'Ngày', 'Thời gian vào', 'Thời gian ra', 'Trạng thái']
      const rows = attendanceData.map((item) => [
        item.employeeId,
        item.employeeName,
        item.date,
        item.timeIn || '',
        item.timeOut || '',
        getStatusLabel(item.status)
      ])
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => escapeCsv(String(cell))).join(','))
        .join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `attendance_${dateLabel}.csv`)
    } else {
      if (!strangerData.length) return
      const headers = ['Thời gian', 'Vị trí Camera', 'Đường dẫn ảnh']
      const rows = strangerData.map((item) => [
        item.time,
        item.cameraLocation || '',
        item.imageUrl
      ])
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => escapeCsv(String(cell))).join(','))
        .join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      downloadBlob(blob, `strangers_${dateLabel}.csv`)
    }
  }

  const handleExportExcel = () => {
    const dateLabel = selectedDate || 'all'
    if (activeTab === 'attendance') {
      if (!attendanceData.length) return
      const sheetData = attendanceData.map((item) => ({
        'Mã NV': item.employeeId,
        'Họ tên': item.employeeName,
        'Ngày': item.date,
        'Thời gian vào': item.timeIn || '',
        'Thời gian ra': item.timeOut || '',
        'Trạng thái': getStatusLabel(item.status)
      }))
      const worksheet = XLSX.utils.json_to_sheet(sheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      downloadBlob(blob, `attendance_${dateLabel}.xlsx`)
    } else {
      if (!strangerData.length) return
      const sheetData = strangerData.map((item) => ({
        'Thời gian': item.time,
        'Vị trí Camera': item.cameraLocation || '',
        'Đường dẫn ảnh': item.imageUrl
      }))
      const worksheet = XLSX.utils.json_to_sheet(sheetData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Strangers')
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      downloadBlob(blob, `strangers_${dateLabel}.xlsx`)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'attendance') {
        const response = await reportService.getAttendance(selectedDate)
        const data = Array.isArray(response) ? response : (response.data || [])
        setAttendanceData(data)
      } else {
        const response = await reportService.getStrangers(selectedDate)
        const data = Array.isArray(response) ? response : (response.data || [])
        setStrangerData(data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
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

          <div className="reports-right">
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
            <div className="export-buttons">
              <button className="export-btn" onClick={handleExportCsv}>
                Xuất CSV
              </button>
              <button className="export-btn export-primary" onClick={handleExportExcel}>
                Xuất Excel
              </button>
            </div>
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
