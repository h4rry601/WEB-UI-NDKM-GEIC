import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeTables from '../components/EmployeeTables'
import Sidebar from '../components/Sidebar'
import ConfirmDialog from '../components/ConfirmDialog'
import './Dashboard.css'

export interface Employee {
  id: string
  imageFront: string  
  imageLeft: string   
  imageRight: string 
  imageUp: string     
  imageDown: string
  fullName: string
  gender: string
  account: string
  employeeId: string
  department: string
  position: string
  workplace: string
}

function Dashboard() {
  const location = useLocation()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])
  const [isGuestModalOpen, setGuestModalOpen] = useState(false)
  const [infoDialogMessage, setInfoDialogMessage] = useState<string | null>(null)

  useEffect(() => {
    if (location.state?.fromLogin) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  const handleAdd = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString()
    }
    setEmployees(prev => [...prev, newEmployee])
    setInfoDialogMessage('Đã lưu thông tin nhân viên vào hệ thống.')
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setSelectedEmployee(employee)
  }

  const handleUpdate = (updatedEmployee: Employee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ))
    setEditingEmployee(null)
    setSelectedEmployee(null)
  }

  const handleDelete = (id: string) => {
    setPendingDeleteId(id)
  }

  const handleDeleteMultiple = (ids: string[]) => {
    setPendingDeleteIds(ids)
  }

  const handleConfirmDelete = () => {
    if (pendingDeleteIds.length > 0) {
      // Xóa nhiều nhân viên
      setEmployees(employees.filter(emp => !pendingDeleteIds.includes(emp.id)))
      if (selectedEmployee && pendingDeleteIds.includes(selectedEmployee.id)) {
        setSelectedEmployee(null)
        setEditingEmployee(null)
      }
      setPendingDeleteIds([])
    } else if (pendingDeleteId) {
      // Xóa một nhân viên
      setEmployees(employees.filter(emp => emp.id !== pendingDeleteId))
      if (selectedEmployee?.id === pendingDeleteId) {
        setSelectedEmployee(null)
        setEditingEmployee(null)
      }
      setPendingDeleteId(null)
    }
  }

  const handleCancelDelete = () => {
    setPendingDeleteId(null)
    setPendingDeleteIds([])
  }

  const handleSave = (employee: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      handleUpdate({ ...employee, id: editingEmployee.id })
      setInfoDialogMessage('Đã cập nhật thông tin nhân viên thành công.')
      setEditingEmployee(null)
      setSelectedEmployee(null)
    } else {
      const newEmployee: Employee = {
        ...employee,
        id: Date.now().toString()
      }
      setEmployees(prev => [...prev, newEmployee])
      setInfoDialogMessage('Đã lưu thông tin nhân viên vào hệ thống.')
    }
  }

  const handleCancelEditing = () => {
    setEditingEmployee(null)
    setSelectedEmployee(null)
  }

  const handleGuestAdd = (employee: Omit<Employee, 'id'>) => {
    handleAdd(employee)
    setGuestModalOpen(false)
  }


  const closeGuestModal = () => setGuestModalOpen(false)

  const handleSidebarHoverChange = (open: boolean) => {
    setIsSidebarOpen(open)
  }

  const pendingDeleteEmployee = pendingDeleteId
    ? employees.find(emp => emp.id === pendingDeleteId)
    : null

  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {showSuccessMessage && (
        <div className="success-notification">
          <div className="success-notification-content">
            <span className="success-icon">✓</span>
            <span className="success-message">Đăng nhập thành công</span>
          </div>
        </div>
      )}
      <Sidebar activePage="personnel" isOpen={isSidebarOpen} onHoverChange={handleSidebarHoverChange} />
      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-actions">
            <span className="dashboard-left-label">Hệ thống giám sát nhận diện khuôn mặt</span>
            <button
              className="btn-guest-add"
              onClick={() => setGuestModalOpen(true)}
            >
              Thêm nhân viên mới
            </button>
          </div>
          <div className="dashboard-columns">
            <div className="dashboard-left-section">
              <div className="dashboard-left">
                <EmployeeForm
                  onAdd={handleAdd}
                  onSave={handleSave}
                  selectedEmployee={selectedEmployee}
                  editingEmployee={editingEmployee}
                  onSelectEmployee={setSelectedEmployee}
                  onCancelEditing={handleCancelEditing}
                  formTitle="Thông tin cá nhân"
                />
              </div>
            </div>
            
            <div className="dashboard-right">
              <EmployeeTables
                employees={employees}
                selectedEmployee={selectedEmployee}
                onRowClick={setSelectedEmployee}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDeleteMultiple={handleDeleteMultiple}
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(pendingDeleteId) || pendingDeleteIds.length > 0}
        title={pendingDeleteIds.length > 0 ? "Xóa nhiều nhân viên" : "Xóa nhân viên"}
        message={
          pendingDeleteIds.length > 0
            ? `Bạn có chắc chắn muốn xóa ${pendingDeleteIds.length} nhân viên đã chọn?`
            : pendingDeleteEmployee
            ? `Bạn có chắc chắn muốn xóa ${pendingDeleteEmployee.fullName}?`
            : 'Bạn có chắc chắn muốn xóa nhân viên này?'
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {infoDialogMessage && (
        <ConfirmDialog
          open
          title="Thông báo"
          message={infoDialogMessage}
          confirmLabel="OK"
          showCancelButton={false}
          onConfirm={() => setInfoDialogMessage(null)}
          onCancel={() => setInfoDialogMessage(null)}
        />
      )}

      {isGuestModalOpen && (
        <div className="guest-modal-overlay" role="dialog" aria-modal="true">
          <div className="guest-modal">
            <div className="guest-modal-header">
              <h3>Đăng ký nhân viên mới</h3>
              <button className="guest-modal-close" onClick={closeGuestModal} aria-label="Đóng">
                ×
              </button>
            </div>
            <div className="guest-modal-body">
              <EmployeeForm
                onAdd={handleGuestAdd}
                onSave={handleSave}
                selectedEmployee={null}
                editingEmployee={null}
                onSelectEmployee={() => {}}
                onSubmitSuccess={closeGuestModal}
                onCancelEditing={closeGuestModal}
                formTitle="Thông tin nhân viên mới"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

