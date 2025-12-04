import { useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import Papa from 'papaparse'
import { Employee } from '../pages/Dashboard'
import BulkUploadForm from './BulkUploadForm'
import './EmployeeForm.css'

type ImageType = 'imageFront' | 'imageLeft' | 'imageRight' | 'imageUp' | 'imageDown'
type FormData = Omit<Employee, 'id'>
type EmployeeTextField = Exclude<keyof FormData, ImageType>

interface EmployeeFormProps {
  onAdd: (employee: FormData) => void
  onSave: (employee: FormData) => void
  selectedEmployee?: Employee | null
  editingEmployee: Employee | null
  onSelectEmployee?: (employee: Employee | null) => void
  onSubmitSuccess?: () => void
  formTitle?: string
  showZipUploader?: boolean
  onCancelEditing?: () => void
}

const imageLabels: Record<ImageType, string> = {
  imageFront: 'Nhìn thẳng',
  imageLeft: 'Nhìn trái 20°',
  imageRight: 'Nhìn phải 20°',
  imageUp: 'Nhìn lên 20°',
  imageDown: 'Nhìn xuống 20°'
}

const departments = [
  'Phòng Tài chính - kế toán',
  'Phòng Tổ chức hành chính',
  'Phòng Kiểm soát nội bộ',
  'Phòng TTTT',
  'Phòng Bán hàng',
  'Phòng Quản trị Kinh doanh',
  'Trung tâm DVKH',
  'Phòng Dự án',
  'Phòng KT Camera',
  'Phòng KT phòng cháy',
  'Phòng Vận hành',
  'Phòng QLCL',
  'Phòng CNTT',
  'Phòng Mua hàng',
  'Phòng Kế hoạch sản xuất',
  'Nhà máy sản xuất'
]

const workplaces = [
  'Phòng 09.01',
  'Phòng 10.01',
  'Phòng 11.01',
  'Phòng 14.01',
  'Phòng 21.01'
]

const createEmptyFormData = (): FormData => ({
  imageFront: '',
  imageLeft: '',
  imageRight: '',
  imageUp: '',
  imageDown: '',
  fullName: '',
  gender: '',
  account: '',
  employeeId: '',
  department: '',
  position: '',
  workplace: ''
})

const createEmptyImagePreviews = (): Record<ImageType, string> => ({
  imageFront: '',
  imageLeft: '',
  imageRight: '',
  imageUp: '',
  imageDown: ''
})

const csvFieldCandidates: Record<EmployeeTextField, string[]> = {
  fullName: ['fullname', 'hovaten', 'ten'],
  gender: ['gender', 'gioitinh'],
  account: ['account', 'email', 'taikhoan'],
  employeeId: ['employeeid', 'manhanvien', 'manv'],
  department: ['department', 'phongban'],
  position: ['position', 'chucvu'],
  workplace: ['workplace', 'phonglamviec', 'diemlamviec']
}

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const imageMatchers: Record<ImageType, RegExp[]> = {
  imageFront: [/front/, /thang/, /truoc/],
  imageLeft: [/left/, /trai/],
  imageRight: [/right/, /phai/],
  imageUp: [/up/, /tren/],
  imageDown: [/down/, /duoi/]
}

const detectImageType = (filename: string): ImageType | null => {
  const lower = filename.toLowerCase()
  for (const [imageType, patterns] of Object.entries(imageMatchers) as [ImageType, RegExp[]][]) {
    if (patterns.some((pattern) => pattern.test(lower))) {
      return imageType
    }
  }
  return null
}

const resolveImageMime = (filename: string) => {
  if (filename.toLowerCase().endsWith('.png')) {
    return 'image/png'
  }
  if (filename.toLowerCase().endsWith('.webp')) {
    return 'image/webp'
  }
  return 'image/jpeg'
}

function EmployeeForm({
  selectedEmployee: _selectedEmployee,
  editingEmployee,
  onSave,
  onAdd,
  onSelectEmployee,
  onSubmitSuccess,
  formTitle = 'Thông tin cá nhân',
  showZipUploader = true,
  onCancelEditing
}: EmployeeFormProps) {
  const isBulkUploadMode = formTitle === 'Thông tin cá nhân' && !editingEmployee
  if (isBulkUploadMode) {
    const handleBulkUpload = (employees: Omit<Employee, 'id'>[]) => {
      employees.forEach(emp => onAdd(emp))
      onSubmitSuccess?.()
    }

    return (
      <BulkUploadForm
        onUpload={handleBulkUpload}
        onCancel={onCancelEditing}
      />
    )
  }

  const [formData, setFormData] = useState<FormData>(() => createEmptyFormData())
  const [imagePreviews, setImagePreviews] = useState<Record<ImageType, string>>(() =>
    createEmptyImagePreviews()
  )
  const [server, setServer] = useState('')
  const [camera, setCamera] = useState('')
  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [zipMessage, setZipMessage] = useState('')
  const [zipFileName, setZipFileName] = useState('')
  const [isZipDragActive, setIsZipDragActive] = useState(false)
  const zipInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        imageFront: editingEmployee.imageFront || '',
        imageLeft: editingEmployee.imageLeft || '',
        imageRight: editingEmployee.imageRight || '',
        imageUp: editingEmployee.imageUp || '',
        imageDown: editingEmployee.imageDown || '',
        fullName: editingEmployee.fullName,
        gender: editingEmployee.gender,
        account: editingEmployee.account,
        employeeId: editingEmployee.employeeId,
        department: editingEmployee.department,
        position: editingEmployee.position,
        workplace: editingEmployee.workplace
      })
      setImagePreviews({
        imageFront: editingEmployee.imageFront || '',
        imageLeft: editingEmployee.imageLeft || '',
        imageRight: editingEmployee.imageRight || '',
        imageUp: editingEmployee.imageUp || '',
        imageDown: editingEmployee.imageDown || ''
      })
    } else {
      setFormData(createEmptyFormData())
      setImagePreviews(createEmptyImagePreviews())
    }
    setZipStatus('idle')
    setZipMessage('')
    setZipFileName('')
    if (zipInputRef.current) {
      zipInputRef.current.value = ''
    }
  }, [editingEmployee])

  const clearLocalState = () => {
    setFormData(createEmptyFormData())
    setImagePreviews(createEmptyImagePreviews())
    setServer('')
    setCamera('')
    setZipStatus('idle')
    setZipMessage('')
    setZipFileName('')
    setIsZipDragActive(false)
    if (zipInputRef.current) {
      zipInputRef.current.value = ''
    }
  }

  const handleImageChange = (imageType: ImageType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreviews({ ...imagePreviews, [imageType]: result })
        setFormData({ ...formData, [imageType]: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (imageType: ImageType, e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreviews({ ...imagePreviews, [imageType]: result })
        setFormData({ ...formData, [imageType]: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof Omit<Employee, 'id'>, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleZipFileSelection = async (file: File | null) => {
    if (!file) {
      return
    }

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
      const foundImages: Partial<Record<ImageType, string>> = {}
      let csvRow: Record<string, string> | null = null

      const entries = Object.values(zip.files)

      for (const entry of entries) {
        if (entry.dir) continue
        const lowerName = entry.name.toLowerCase()

        if (lowerName.endsWith('.csv') && !csvRow) {
          const csvText = await entry.async('string')
          const parsed = Papa.parse<Record<string, string>>(csvText, {
            header: true,
            skipEmptyLines: true
          })

          if (parsed.errors.length > 0) {
            throw new Error(parsed.errors[0].message || 'Không thể đọc file CSV')
          }

          const validRow = parsed.data.find(
            (row: Record<string, string>) => row && Object.keys(row).some((key) => !!row[key])
          )

          if (!validRow) {
            throw new Error('File CSV không chứa dữ liệu hợp lệ')
          }

          csvRow = validRow
          continue
        }

        const detectedType = detectImageType(lowerName)
        if (detectedType) {
          const base64 = await entry.async('base64')
          const mime = resolveImageMime(lowerName)
          foundImages[detectedType] = `data:${mime};base64,${base64}`
        }
      }

      if (!csvRow) {
        throw new Error('Không tìm thấy file CSV trong gói zip')
      }

      const normalizedRow = Object.entries(csvRow).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (!key) return acc
          const normalizedKey = normalizeKey(key)
          acc[normalizedKey] = value?.toString().trim() ?? ''
          return acc
        },
        {}
      )

      const nextFormData: Partial<FormData> = {}

      for (const [field, candidates] of Object.entries(csvFieldCandidates) as [
        EmployeeTextField,
        string[]
      ][]) {
        const matchedKey = candidates.find((candidate) => normalizedRow[candidate] !== undefined)
        if (matchedKey) {
          nextFormData[field] = normalizedRow[matchedKey]
        }
      }

      setFormData((prev) => ({ ...prev, ...nextFormData }))
      if (Object.keys(foundImages).length > 0) {
        setImagePreviews((prev) => ({ ...prev, ...foundImages }))
        setFormData((prev) => ({
          ...prev,
          ...Object.entries(foundImages).reduce<Partial<FormData>>((acc, [key, value]) => {
            acc[key as ImageType] = value
            return acc
          }, {})
        }))
      }

      setZipStatus('success')
      setZipMessage('Đã lấy dữ liệu từ gói ' + file.name)
    } catch (error) {
      console.error(error)
      const message =
        error instanceof Error ? error.message : 'Không thể đọc nội dung gói zip. Vui lòng thử lại.'
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

  const handleZipAreaClick = (e: React.MouseEvent) => {
    // Chỉ trigger khi click không phải vào input file
    if (e.target !== zipInputRef.current) {
      zipInputRef.current?.click()
    }
  }

  const handleZipInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Ngăn event bubbling để tránh trigger handleZipAreaClick
    e.stopPropagation()
  }

  const handleSaveToSystem = () => {
    if (!formData.fullName || !formData.gender || !formData.account) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (Họ và tên, Giới tính, Account)')
      return
    }

    if (!formData.imageFront) {
      alert('Vui lòng tải lên ít nhất ảnh nhìn thẳng')
      return
    }

    if (editingEmployee) {
      onSave(formData)
    } else {
      onAdd(formData)
    }
    clearLocalState()
    onSubmitSuccess?.()
  }

  const handleCancel = () => {
    clearLocalState()
    onSelectEmployee?.(null)
    onCancelEditing?.()
  }

  const renderImageUpload = (imageType: ImageType) => {
    const preview = imagePreviews[imageType]
    const label = imageLabels[imageType]
    
    return (
      <div
        key={imageType}
        className="image-upload-item"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(imageType, e)}
      >
        <label className="image-upload-label">{label}</label>
        <div className="image-upload-area-small">
          {preview ? (
            <img src={preview} alt={label} className="image-preview-small" />
          ) : (
            <>
              <span className="camera-icon-small" role="img" aria-label="Camera icon" />
              <p className="upload-hint">Kéo thả hoặc chọn file</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(imageType, e)}
            className="file-input"
            aria-label={`Upload ${label}`}
            title={`Upload ${label}`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="employee-form">
      <h2 className="form-title">{formTitle}</h2>

      {showZipUploader && (
        <div className="zip-upload-wrapper">
          <p className="zip-upload-title">Nhập thông tin nhân viên tại đây (5 ảnh + 1 file CSV)</p>
          <div
            className={`zip-upload-area ${isZipDragActive ? 'drag-active' : ''}`}
            onDragOver={handleZipDragOver}
            onDragLeave={handleZipDragLeave}
            onDrop={handleZipDrop}
            onClick={handleZipAreaClick}
          >
            <span className="folder-icon-small" role="img" aria-label="Folder icon" />
            <p className="zip-instruction">Kéo thả hoặc bấm để chọn file .zip</p>
            <p className="zip-helper">Hệ thống sẽ tự động đọc ảnh và thông tin từ file CSV</p>
            {zipFileName && <p className="zip-file-name">{zipFileName}</p>}
            <input
              ref={zipInputRef}
              type="file"
              className="file-input"
              accept=".zip"
              onChange={handleZipInputChange}
              onClick={handleZipInputClick}
            />
          </div>
          {zipMessage && (
            <p className={`zip-message zip-${zipStatus}`}>
              {zipStatus === 'loading' ? 'Đang xử lý dữ liệu...' : zipMessage}
            </p>
          )}
        </div>
      )}

      <div className="images-upload-section">
        <div className="images-grid">
          {(['imageFront', 'imageLeft', 'imageRight', 'imageUp', 'imageDown'] as ImageType[]).map(renderImageUpload)}
        </div>
      </div>

      <div className="form-fields">
        {}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="fullName">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-field">
            <label htmlFor="gender">
              Giới tính <span className="required">*</span>
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              aria-label="Chọn giới tính"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>

        {}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="employeeId">
              Mã nhân viên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="employeeId"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              placeholder="Nhập mã nhân viên"
            />
          </div>

          <div className="form-field">
            <label htmlFor="department">Phòng ban</label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              aria-label="Chọn phòng ban"
            >
              <option value="">Chọn phòng ban</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="position">Chức vụ</label>
            <input
              type="text"
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="Nhập chức vụ"
            />
          </div>

          <div className="form-field">
            <label htmlFor="workplace">Phòng làm việc</label>
            <select
              id="workplace"
              value={formData.workplace}
              onChange={(e) => handleInputChange('workplace', e.target.value)}
              aria-label="Chọn phòng làm việc"
            >
              <option value="">Chọn phòng làm việc</option>
              {workplaces.map((workplace) => (
                <option key={workplace} value={workplace}>
                  {workplace}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="form-field">
          <label htmlFor="server"> Server <span className="required">*</span>
          </label>
          <select
            id="server"
            value={server}
            onChange={(e) => setServer(e.target.value)}
            aria-label="Chọn server"
          >
            <option value="">Chọn server</option>
          </select>
        </div>

        {}
        <div className="form-field">
          <label htmlFor="camera">Camera <span className="required">*</span>
          </label>
          <select
            id="camera"
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            aria-label="Chọn camera"
          >
            <option value="">Chọn camera</option>
          </select>
        </div>
        {}
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleCancel}>
          Hủy
        </button>
        <button 
          className="btn-save-system" 
          onClick={handleSaveToSystem}
        >
          Lưu trên hệ thống
        </button>
      </div>
    </div>
  )
}

export default EmployeeForm
