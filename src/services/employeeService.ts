import apiClient from './apiClient'
import { API_ENDPOINTS } from '../config/api'

// Define types based on project requirements
export interface CreateEmployeeRequest {
  fullName: string
  gender: string
  account: string
  employeeId?: string
  department?: string
  position?: string
  workplace?: string
  
  // Images (Base64 strings)
  imageFront?: string
  imageLeft?: string
  imageRight?: string
  imageUp?: string
  imageDown?: string
  
  // System metadata
  server?: string
  camera?: string
}

export interface Employee extends CreateEmployeeRequest {
  id: string
  status?: 'pending' | 'confirmed'
  createdAt?: string
}

export interface UploadImageResponse {
  success: boolean
  data: {
    url: string
    filename: string
  }
}

export const employeeService = {
  // 1. Delete an employee
  delete: async (id: string) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEE_BY_ID(id))
    return response.data
  },

  // 2. Add an employee
  create: async (data: CreateEmployeeRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, data)
    return response.data
  },

  // 3. Add a list of employees (Batch import)
  createBatch: async (data: CreateEmployeeRequest[]) => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEE_BATCH, { employees: data })
    return response.data
  },

  // 4. Add image for an employee
  // This can be used to upload an image and get a URL back, or attach to an employee
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await apiClient.post<UploadImageResponse>(
      API_ENDPOINTS.UPLOAD_IMAGE, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  getAll: async (params?: any) => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES, { params })
    return response.data
  }
}
