import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

export interface StrangerReport {
  id: string
  time: string
  imageUrl: string
  cameraLocation?: string
}

export interface AttendanceReport {
  employeeId: string
  employeeName: string
  timeIn: string
  timeOut?: string
  date: string
  status: 'present' | 'late' | 'absent'
}

export const reportService = {
  // 5. Get list of strangers for a specific day
  getStrangers: async (date: string) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT_STRANGERS, {
      params: { date }
    })
    return response.data
  },

  // 6. Get employee attendance list for a specific day
  getAttendance: async (date: string) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT_ATTENDANCE, {
      params: { date }
    })
    return response.data
  }
}
