import { useRef, useState } from 'react'
import JSZip from 'jszip'
import * as XLSX from 'xlsx'
import { Employee } from '../pages/Dashboard'
import './BulkUploadForm.css'

interface BulkEmployeeData {
  employeeId: string
  fullName: string
  gender: string
  account: string
  department: string
  position: string
  workplace: string
  images: {
    front?: string
    left?: string 
    right?: string
    up?: string
    down?: string
  }
  isValid: boolean
  errors: string[]
  possibleColumns?: {
    employeeId?: string[]
    fullName?: string[]
    gender?: string[]
    account?: string[]
  }
}

interface BulkUploadFormProps {
  onUpload: (employees: Omit<Employee, 'id'>[]) => void
  onCancel?: () => void
}


const imageTypeMatchers: Record<keyof BulkEmployeeData['images'], string[]> = {
  front: ['front', 'thang', 'truoc', 'straight'],
  left: ['left', 'trai'],
  right: ['right', 'phai'],
  up: ['up', 'tren', 'len'],
  down: ['down', 'duoi', 'xuong']
}


const detectImageType = (filename: string): { type: keyof BulkEmployeeData['images']; priority: number } | null => {
  const lower = filename.toLowerCase()
  const hasExpressionKeywords = /expression|emotion|bieu_cam|co_bieu_cam/.test(lower)
  const noExpressionKeywords = /no_expression|khong_bieu_cam|neutral|khong/.test(lower)
  const hasNumber1 = /\b1\b|first|dau|mot/.test(lower)
  const hasNumber2 = /\b2\b|second|hai|hai/.test(lower)
  
  for (const [type, keywords] of Object.entries(imageTypeMatchers)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      if (type === 'front' || type === 'left' || type === 'right') {
        if (hasExpressionKeywords || hasNumber1) {
          return { type: type as keyof BulkEmployeeData['images'], priority: 1 }
        }
        if (noExpressionKeywords || hasNumber2) {
          return { type: type as keyof BulkEmployeeData['images'], priority: 2 }
        }
        return { type: type as keyof BulkEmployeeData['images'], priority: 1 }
      }
      return { type: type as keyof BulkEmployeeData['images'], priority: 1 }
    }
  }
  return null
}

const resolveImageMime = (filename: string): string => {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

const normalizeKey = (key: string) => {
  if (!key) return ''
  return key
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function BulkUploadForm({ onUpload, onCancel }: BulkUploadFormProps) {
  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [zipMessage, setZipMessage] = useState('')
  const [zipFileName, setZipFileName] = useState('')
  const [isZipDragActive, setIsZipDragActive] = useState(false)
  const [employees, setEmployees] = useState<BulkEmployeeData[]>([])
  const [showDetails, setShowDetails] = useState(false)
  const [, setFoundColumns] = useState<string[]>([])
  const zipInputRef = useRef<HTMLInputElement>(null)

  const clearState = () => {
    setZipStatus('idle')
    setZipMessage('')
    setZipFileName('')
    setIsZipDragActive(false)
    setEmployees([])
    setShowDetails(false)
    setFoundColumns([])
    if (zipInputRef.current) {
      zipInputRef.current.value = ''
    }
  }

  const handleZipFileSelection = async (file: File | null) => {
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setZipStatus('error')
      setZipMessage('Vui lòng chọn đúng file .zip')
      setZipFileName('')
      return
    }

    setZipStatus('loading')
    setZipMessage('Đang xử lý dữ liệu, vui lòng đợi...')
    setZipFileName(file.name)

    try {
      const zip = await JSZip.loadAsync(file)
      const entries = Object.values(zip.files)

      let excelFile: JSZip.JSZipObject | null = null
      for (const entry of entries) {
        if (!entry.dir && (entry.name.toLowerCase().endsWith('.xlsx') || entry.name.toLowerCase().endsWith('.xls'))) {
          excelFile = entry
          break
        }
      }

      if (!excelFile) {
        throw new Error('Không tìm thấy file Excel (.xlsx hoặc .xls) trong gói zip')
      }

      const excelBuffer = await excelFile.async('arraybuffer')
      const workbook = XLSX.read(excelBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const columnMappings: Record<string, string[]> = {
        employeeId: [
          'manhansu', 'mns', 'manv', 'employeeid', 'manhanvien', 'id', 
          'manhanvienid', 'manv', 'mns', 'manhansu', 'manhanvien',
          'employeeid', 'id', 'manv', 'mns', 'maso', 'ma', 'code',
          'manhanvien', 'manhansu', 'mns', 'manv'
        ],
        fullName: [
          'hoten', 'hovaten', 'fullname', 'ten', 'name', 
          'hoten', 'hovaten', 'fullname', 'name', 'ten',
          'hovaten', 'hoten', 'fullname', 'name'
        ],
        gender: [
          'gioitinh', 'gender', 'sex', 
          'gioitinh', 'gender', 'sex'
        ],
        department: [
          'phong', 'department', 'phongban', 
          'phongban', 'department', 'phong'
        ],
        position: [
          'chucvu', 'chucdanh', 'position', 'bophan',
          'chucvu', 'chucdanh', 'position', 'bophan'
        ],
        workplace: [
          'sophonglamviec', 'phonglamviec', 'workplace', 'room', 'phong', 
          'sophonglamviec', 'phonglamviec', 'workplace', 'room'
        ],
        account: [
          'email', 'account', 'taikhoan', 'emailcongty', 'emailcongty', 'emailcty', 
          'email', 'account', 'taikhoan', 'emailcongty', 'emailcty'
        ]
      }

      const rawRows = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
        header: 1,
        defval: '',
        raw: false,
        blankrows: false
      })

      if (rawRows.length === 0) {
        throw new Error('File Excel không chứa dữ liệu')
      }

      const cleanedRows = rawRows.map(row =>
        row.map(cell => (cell === undefined || cell === null ? '' : String(cell).trim()))
      )

      const matchesColumn = (value: string, candidates: string[]) => {
        const normalizedValue = normalizeKey(value)
        if (!normalizedValue) return false
        return candidates.some(candidate => {
          if (!candidate) return false
          if (candidate.length < 3) {
            return normalizedValue === candidate
          }
          return (
            normalizedValue === candidate ||
            normalizedValue.includes(candidate) ||
            candidate.includes(normalizedValue)
          )
        })
      }

      const headerRowIndex = cleanedRows.findIndex(row => {
        if (!row.some(cell => cell)) return false
        const hasEmployeeId = row.some(cell => matchesColumn(cell, columnMappings.employeeId))
        const hasFullName = row.some(cell => matchesColumn(cell, columnMappings.fullName))
        const hasAccount = row.some(cell => matchesColumn(cell, columnMappings.account))
        return hasEmployeeId && hasFullName && hasAccount
      })

      if (headerRowIndex === -1) {
        throw new Error('Không tìm thấy dòng tiêu đề hợp lệ trong file Excel. Vui lòng kiểm tra lại định dạng.')
      }

      const sheetRef = worksheet['!ref']
      let excelData: Record<string, any>[] = []
      if (sheetRef) {
        const range = XLSX.utils.decode_range(sheetRef)
        const dataRange = {
          s: { r: headerRowIndex, c: range.s.c },
          e: range.e
        }
        excelData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: '',
          raw: false,
          blankrows: false,
          range: dataRange
        })
      } else {
        excelData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: '',
          raw: false,
          blankrows: false
        })
      }

      if (excelData.length === 0) {
        throw new Error('File Excel không chứa dữ liệu sau dòng tiêu đề')
      }

      let excelColumns: string[] = []
      if (excelData.length > 0) {
        const firstRow = excelData[0]
        excelColumns = Object.keys(firstRow)
        const foundColumns = Object.keys(firstRow).map(key => ({
          original: key,
          normalized: normalizeKey(key)
        }))
        console.log('Các cột tìm thấy trong Excel:', foundColumns)
        console.log('Dữ liệu mẫu (dòng đầu tiên):', firstRow)
        setFoundColumns(excelColumns)
      }

      const processedEmployees: BulkEmployeeData[] = []

      for (const row of excelData) {
        const hasAnyData = Object.values(row).some(val => val && String(val).trim() !== '')
        if (!hasAnyData) {
          continue
        }

        const normalizedRow: Record<string, string> = {}
        const originalToNormalized: Record<string, string> = {}
        
        Object.keys(row).forEach(key => {
          // Xử lý key: trim và loại bỏ ký tự đặc biệt ở đầu/cuối
          const cleanKey = String(key || '').trim()
          const normalized = normalizeKey(cleanKey)
          const value = String(row[key] || '').trim()
          
          // Lưu giá trị với key đã normalize
          if (normalized) {
            normalizedRow[normalized] = value
            // Lưu mapping để debug
            if (!originalToNormalized[normalized]) {
              originalToNormalized[normalized] = cleanKey
            }
          }
        })

        // Map các cột
        const employeeId = findColumnValue(normalizedRow, columnMappings.employeeId)
        const fullName = findColumnValue(normalizedRow, columnMappings.fullName)
        const gender = findColumnValue(normalizedRow, columnMappings.gender)
        const department = findColumnValue(normalizedRow, columnMappings.department)
        const position = findColumnValue(normalizedRow, columnMappings.position)
        const workplace = findColumnValue(normalizedRow, columnMappings.workplace)
        const account = findColumnValue(normalizedRow, columnMappings.account)

        // Debug: Log thông tin mapping cho dòng đầu tiên
        if (processedEmployees.length === 0) {
          console.log('=== DEBUG MAPPING ===')
          console.log('Tất cả các cột trong Excel (original):', Object.keys(row))
          console.log('Tất cả các cột sau khi normalize:', Object.keys(normalizedRow))
          console.log('Mapping original -> normalized:', originalToNormalized)
          console.log('Mapping kết quả:', {
            employeeId: employeeId || '(KHÔNG TÌM THẤY)',
            fullName: fullName || '(KHÔNG TÌM THẤY)',
            gender: gender || '(KHÔNG TÌM THẤY)',
            account: account || '(KHÔNG TÌM THẤY)',
          })
          console.log('Giá trị trong normalizedRow:', normalizedRow)
          console.log('Các candidate cho fullName:', columnMappings.fullName)
          console.log('Các candidate cho gender:', columnMappings.gender)
          console.log('Các candidate cho account:', columnMappings.account)
          
          // Kiểm tra từng candidate
          console.log('Kiểm tra fullName candidates:')
          columnMappings.fullName.forEach(candidate => {
            console.log(`  - "${candidate}": ${normalizedRow[candidate] ? `FOUND: "${normalizedRow[candidate]}"` : 'NOT FOUND'}`)
          })
          console.log('Kiểm tra gender candidates:')
          columnMappings.gender.forEach(candidate => {
            console.log(`  - "${candidate}": ${normalizedRow[candidate] ? `FOUND: "${normalizedRow[candidate]}"` : 'NOT FOUND'}`)
          })
          console.log('Kiểm tra account candidates:')
          columnMappings.account.forEach(candidate => {
            console.log(`  - "${candidate}": ${normalizedRow[candidate] ? `FOUND: "${normalizedRow[candidate]}"` : 'NOT FOUND'}`)
          })
          console.log('====================')
        }

        const errors: string[] = []
        const possibleColumns: BulkEmployeeData['possibleColumns'] = {}
        
        if (!employeeId) {
          errors.push('Thiếu Mã nhân sự')
          // Tìm các cột có thể liên quan
          const possible = Object.keys(normalizedRow)
            .filter(k => (k.includes('mns') || k.includes('manv') || k.includes('id') || k.includes('ma') || k.includes('code')))
            .map(k => originalToNormalized[k] || k)
          if (possible.length > 0) {
            possibleColumns.employeeId = possible
            if (processedEmployees.length === 0) {
              console.warn('Các cột có thể là Mã nhân sự:', possible)
            }
          }
        }
        if (!fullName) {
          errors.push('Thiếu Họ và tên')
          const possible = Object.keys(normalizedRow)
            .filter(k => (k.includes('ten') || k.includes('name')))
            .map(k => originalToNormalized[k] || k)
          if (possible.length > 0) {
            possibleColumns.fullName = possible
            if (processedEmployees.length === 0) {
              console.warn('Các cột có thể là Họ và tên:', possible)
            }
          }
        }
        if (!gender) {
          errors.push('Thiếu Giới tính')
          const possible = Object.keys(normalizedRow)
            .filter(k => (k.includes('gioi') || k.includes('gender') || k.includes('sex')))
            .map(k => originalToNormalized[k] || k)
          if (possible.length > 0) {
            possibleColumns.gender = possible
            if (processedEmployees.length === 0) {
              console.warn('Các cột có thể là Giới tính:', possible)
            }
          }
        }
        if (!account) {
          errors.push('Thiếu Email công ty')
          const possible = Object.keys(normalizedRow)
            .filter(k => (k.includes('email') || k.includes('account') || k.includes('taikhoan')))
            .map(k => originalToNormalized[k] || k)
          if (possible.length > 0) {
            possibleColumns.account = possible
            if (processedEmployees.length === 0) {
              console.warn('Các cột có thể là Email công ty:', possible)
            }
          }
        }

        // Tìm ảnh cho nhân viên này
        const employeeImages: BulkEmployeeData['images'] = {}
        
        // Tạo danh sách các identifier để tìm ảnh (ưu tiên employeeId, sau đó là fullName)
        const searchIdentifiers: string[] = []
        if (employeeId) {
          searchIdentifiers.push(employeeId.toLowerCase())
        }
        if (fullName) {
          // Tạo các biến thể của tên để tìm
          const nameVariants = [
            fullName.toLowerCase(),
            fullName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            fullName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
          ]
          searchIdentifiers.push(...nameVariants.filter((v, i, arr) => arr.indexOf(v) === i))
        }
        
        // Debug: Log thông tin tìm ảnh cho dòng đầu tiên
        if (processedEmployees.length === 0) {
          console.log('=== DEBUG TÌM ẢNH ===')
          console.log('Employee ID:', employeeId || '(KHÔNG CÓ)')
          console.log('Full Name:', fullName || '(KHÔNG CÓ)')
          console.log('Search identifiers:', searchIdentifiers)
          console.log('Tổng số file trong zip:', entries.length)
        }

        for (const entry of entries) {
          if (entry.dir) continue
          
          const entryNameLower = entry.name.toLowerCase()
          let isEmployeeFile = false
          
          // Nếu có employeeId, tìm theo employeeId
          if (employeeId) {
            const employeeIdLower = employeeId.toLowerCase()
            const employeeFolderPattern = new RegExp(`(^|[/\\\\])${employeeIdLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[/\\\\]`, 'i')
            
            isEmployeeFile = employeeFolderPattern.test(entry.name) || 
                            entryNameLower.includes(employeeIdLower) ||
                            entryNameLower.startsWith(employeeIdLower + '_') ||
                            entryNameLower.startsWith(employeeIdLower + '/') ||
                            entryNameLower.includes('/' + employeeIdLower + '/') ||
                            entryNameLower.includes('\\' + employeeIdLower + '\\')
          }
          
          if (!isEmployeeFile && fullName && searchIdentifiers.length > 0) {
            isEmployeeFile = searchIdentifiers.some(identifier => {
              if (!identifier) return false
              return entryNameLower.includes(identifier) ||
                     entryNameLower.includes('/' + identifier + '/') ||
                     entryNameLower.includes('\\' + identifier + '\\') ||
                     entryNameLower.startsWith(identifier + '/') ||
                     entryNameLower.startsWith(identifier + '\\') ||
                     entryNameLower.startsWith(identifier + '_')
            })
          }

          if (isEmployeeFile) {
            const detected = detectImageType(entry.name)
            if (detected) {
              const base64 = await entry.async('base64')
              const mime = resolveImageMime(entry.name)
              const imageData = `data:${mime};base64,${base64}`
              
              const imageKey = detected.type
              if (!employeeImages[imageKey] || detected.priority === 1) {
                employeeImages[imageKey] = imageData
                if (processedEmployees.length === 0) {
                  console.log(`✓ Gán ảnh: ${entry.name} -> ${imageKey}`)
                }
              } 
            } else if (processedEmployees.length === 0) {
              const isImageFile = /\.(jpg|jpeg|png|webp)$/i.test(entry.name)
              if (isImageFile) {
                console.warn(`⚠ File ảnh không được detect loại: ${entry.name}`)
              }
            }
          }
        }
        
        if (processedEmployees.length === 0) {
          console.log('Kết quả tìm ảnh:', {
            totalFound: Object.keys(employeeImages).length,
            images: Object.keys(employeeImages)
          })
          console.log('====================')
        }

        if (!employeeImages.front) {
          errors.push('Thiếu ảnh nhìn thẳng')
        }

        const selectedImages = {
          imageFront: employeeImages.front || '',
          imageLeft: employeeImages.left || '',
          imageRight: employeeImages.right || '',
          imageUp: employeeImages.up || '',
          imageDown: employeeImages.down || ''
        }

        processedEmployees.push({
          employeeId: employeeId || '',
          fullName: fullName || '',
          gender: normalizeGender(gender || ''),
          account: account || '',
          department: department || '',
          position: position || '',
          workplace: workplace || '',
          images: employeeImages,
          isValid: errors.length === 0 && (selectedImages.imageFront !== ''),
          errors,
          possibleColumns: Object.keys(possibleColumns).length > 0 ? possibleColumns : undefined
        })
      }

      setEmployees(processedEmployees)
      const validCount = processedEmployees.filter(emp => emp.isValid).length
      const errorCount = processedEmployees.length - validCount

      setZipStatus('success')
      setZipMessage(
        `Đã xử lý ${processedEmployees.length} nhân viên. ` +
        `${validCount} hợp lệ, ${errorCount} có lỗi.`
      )
    } catch (error) {
      console.error(error)
      const message = error instanceof Error 
        ? error.message 
        : 'Không thể đọc nội dung gói zip. Vui lòng thử lại.'
      setZipStatus('error')
      setZipMessage(message)
      setZipFileName('')
      if (zipInputRef.current) {
        zipInputRef.current.value = ''
      }
    } finally {
      setIsZipDragActive(false)
    }
  }

const findColumnValue = (normalizedRow: Record<string, string>, candidates: string[]): string => {
  const normalizedKeys = Object.keys(normalizedRow)

  // Ưu tiên khớp chính xác
  for (const candidate of candidates) {
    const value = normalizedRow[candidate]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim()
    }
  }

  // Fallback: khớp mở rộng (ví dụ "manhansu" khớp "manhansubatbuoc")
  for (const candidate of candidates) {
    if (candidate.length < 3) continue
    const matchedKey = normalizedKeys.find(key => key.includes(candidate) || candidate.includes(key))
    if (matchedKey) {
      const value = normalizedRow[matchedKey]
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim()
      }
    }
  }

  return ''
}

  const normalizeGender = (gender: string): string => {
    const lower = gender.toLowerCase()
    if (lower.includes('nam') || lower.includes('male') || lower === 'm') return 'Nam'
    if (lower.includes('nữ') || lower.includes('nu') || lower.includes('female') || lower === 'f') return 'Nữ'
    return gender
  }

  const handleZipInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    handleZipFileSelection(file)
  }

  const handleZipDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] ?? null
    handleZipFileSelection(file)
  }

  const handleZipDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsZipDragActive(true)
  }

  const handleZipDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsZipDragActive(false)
  }

  const handleZipAreaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zipInputRef.current && event.target === zipInputRef.current) {
      return
    }
    zipInputRef.current?.click()
  }

  const handleUpload = () => {
    const validEmployees = employees.filter(emp => emp.isValid)
    
    if (validEmployees.length === 0) {
      alert('Không có nhân viên hợp lệ để upload. Vui lòng kiểm tra lại dữ liệu.')
      return
    }

    const employeesToUpload: Omit<Employee, 'id'>[] = validEmployees.map(emp => ({
      imageFront: emp.images.front || '',
      imageLeft: emp.images.left || '',
      imageRight: emp.images.right || '',
      imageUp: emp.images.up || '',
      imageDown: emp.images.down || '',
      fullName: emp.fullName,
      gender: emp.gender,
      account: emp.account,
      employeeId: emp.employeeId,
      department: emp.department,
      position: emp.position,
      workplace: emp.workplace
    }))

    onUpload(employeesToUpload)
    clearState()
  }

  const validCount = employees.filter(emp => emp.isValid).length
  const errorCount = employees.length - validCount

  return (
    <div className="bulk-upload-form">
      <h2 className="bulk-upload-title"> Tích hợp dữ liệu </h2>

      <div className="zip-upload-wrapper">
        <div
          className={`zip-upload-area ${isZipDragActive ? 'drag-active' : ''}`}
          onDragOver={handleZipDragOver}
          onDragLeave={handleZipDragLeave}
          onDrop={handleZipDrop}
          onClick={handleZipAreaClick}
        >
          <span className="folder-icon-small" role="img" aria-label="Folder icon" />
          <p className="zip-instruction">Kéo thả hoặc bấm để chọn file .zip</p>
          <p className="zip-helper">
            File .zip chứa: File Excel (.xlsx) + Thư mục ảnh cho mỗi nhân viên
          </p>
          {zipFileName && <p className="zip-file-name">{zipFileName}</p>}
          <input
            ref={zipInputRef}
            type="file"
            className="file-input"
            accept=".zip"
            onChange={handleZipInputChange}
          />
        </div>

        {zipMessage && (
          <p className={`zip-message zip-${zipStatus}`}>
            {zipStatus === 'loading' ? 'Đang xử lý dữ liệu...' : zipMessage}
          </p>
        )}
      </div>

      {employees.length > 0 && (
        <div className="upload-summary">
          <div className="summary-header">
            <h3 className="summary-title">Thống kê dữ liệu</h3>
            <button
              className="toggle-details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Ẩn chi tiết ▲' : 'Xem chi tiết ▼'}
            </button>
          </div>

          <div className="summary-stats">
            <div className="stat-item stat-total">
              <span className="stat-label">Tổng số nhân viên</span>
              <span className="stat-value">{employees.length}</span>
            </div>
            <div className="stat-item stat-valid">
              <span className="stat-label">Hợp lệ</span>
              <span className="stat-value">{validCount}</span>
            </div>
            <div className="stat-item stat-error">
              <span className="stat-label">Có lỗi</span>
              <span className="stat-value">{errorCount}</span>
            </div>
          </div>

          {showDetails && (
            <div className="employees-list">
              <h4 className="list-title">Danh sách nhân viên</h4>
              <div className="employees-grid">
                {employees.map((emp, index) => (
                  <div
                    key={index}
                    className={`employee-card ${emp.isValid ? 'valid' : 'error'}`}
                  >
                    <div className="employee-card-header">
                      <span className="employee-status">
                        {emp.isValid ? '✓' : '✗'}
                      </span>
                      <span className="employee-name">{emp.fullName || 'N/A'}</span>
                    </div>
                    <div className="employee-info">
                      <p className="employee-id">Mã: {emp.employeeId || 'N/A'}</p>
                      <p className="employee-email">Email: {emp.account || 'N/A'}</p>
                    </div>
                    {emp.errors.length > 0 && (
                      <div className="employee-errors">
                        <p className="errors-title">Lỗi:</p>
                        <ul className="errors-list">
                          {emp.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="employee-images-count">
                      Ảnh: {Object.keys(emp.images).filter(k => emp.images[k as keyof typeof emp.images]).length}/5
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="form-actions">
        <button className="btn-cancel" onClick={() => { clearState(); onCancel?.() }}>
          Hủy
        </button>
        <button
          className="btn-upload"
          onClick={handleUpload}
          disabled={validCount === 0 || zipStatus !== 'success'}
        >
          Lưu trên hệ thống ({validCount})
        </button>
      </div>
    </div>
  )
}

export default BulkUploadForm

