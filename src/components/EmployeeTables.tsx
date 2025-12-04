import React, { useState, useEffect } from 'react'
import './EmployeeTables.css'

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

interface EmployeeTablesProps {
    employees: Employee[]
    selectedEmployee: Employee | null
    onRowClick: (employee: Employee) => void
    onEdit: (employee: Employee) => void
    onDelete: (id: string) => void
    onDeleteMultiple: (ids: string[]) => void
}

const EmployeeTables: React.FC<EmployeeTablesProps> = ({
    employees,
    selectedEmployee,
    onRowClick,
    onEdit,
    onDelete,
    onDeleteMultiple
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Ensure unique IDs
    const uniqueEmployees = React.useMemo(() => {
        const seen = new Set<string>()
        return employees.filter(e => {
            if (seen.has(e.id)) return false
            seen.add(e.id)
            return true
        })
    }, [employees])

    const validIds = uniqueEmployees.map(e => e.id)

    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => validIds.includes(id)))
    }, [uniqueEmployees])

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        e.stopPropagation()
        if (e.target.checked) {
            setSelectedIds(prev => (prev.includes(id) ? prev : [...prev, id]))
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id))
        }
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(validIds)
        } else {
            setSelectedIds([])
        }
    }

    const isAllSelected = validIds.length > 0 && selectedIds.length === validIds.length

    return (
        <div className="employee-table-container">
            <div className="table-header-actions">
                <h3 className="table-title">Danh sách nhân viên ({uniqueEmployees.length})</h3>
                <div className="header-buttons">
                    {selectedIds.length === 1 && (
                        <>
                            <button
                                className="btn-header-action btn-edit"
                                onClick={() => {
                                    const emp = uniqueEmployees.find(e => e.id === selectedIds[0])
                                    if (emp) onEdit(emp)
                                }}
                                title="Sửa thông tin nhân viên đã chọn"
                            >
                                ✎ Sửa
                            </button>
                            <button
                                className="btn-header-action btn-delete"
                                onClick={() => {
                                    const emp = uniqueEmployees.find(e => e.id === selectedIds[0])
                                    if (emp && emp.id) onDelete(emp.id)
                                }}
                                title="Xóa nhân viên đã chọn"
                            >
                                🗑 Xóa
                            </button>
                        </>
                    )}
                    {selectedIds.length > 1 && (
                        <button
                            className="btn-header-action btn-delete"
                            onClick={() => onDeleteMultiple(selectedIds)}
                            title="Xóa nhiều nhân viên đã chọn"
                        >
                            🗑 Xóa ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            <div className="table-responsive">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th className="th-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Ảnh</th>
                            <th>Mã NV</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>Tài khoản</th>
                            <th>Phòng ban</th>
                            <th>Chức vụ</th>
                            <th>Nơi làm việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="empty-state">
                                    Chưa có dữ liệu nhân viên. Vui lòng thêm mới hoặc import.
                                </td>
                            </tr>
                        ) : (
                            uniqueEmployees.map((employee) => {
                                const rowKey = employee.id
                                const isChecked = selectedIds.includes(rowKey)

                                const isRowSelected = selectedEmployee?.id === employee.id
                                return (
                                    <tr
                                        key={rowKey}
                                        className={`employee-row ${isRowSelected ? 'selected' : ''}`}
                                        onClick={() => onRowClick(employee)}
                                    >
                                        <td className="td-checkbox" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => handleCheckboxChange(e, rowKey)}
                                            />
                                        </td>
                                        <td className="td-avatar">
                                            <img
                                                src={employee.imageFront || 'https://via.placeholder.com/40'}
                                                alt={employee.fullName}
                                                className="employee-avatar"
                                            />
                                        </td>
                                        <td>{employee.employeeId}</td>
                                        <td className="font-medium">{employee.fullName}</td>
                                        <td>{employee.gender}</td>
                                        <td>{employee.account}</td>
                                        <td>{employee.department}</td>
                                        <td>{employee.position}</td>
                                        <td>{employee.workplace}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EmployeeTables
