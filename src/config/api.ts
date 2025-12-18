export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  

  EMPLOYEES: '/employees',
  EMPLOYEE_BY_ID: (id: string) => `/employees/${id}`,
  EMPLOYEE_BATCH: '/employees/batch',
  UPLOAD_IMAGE: '/upload/image',

  REPORT_STRANGERS: '/reports/strangers',
  REPORT_ATTENDANCE: '/reports/attendance',

  WORKPLACES: '/config/workplaces',
  SERVERS: '/config/servers',
  CAMERAS: '/config/cameras',
}
