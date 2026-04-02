import { apiClient } from '@/services/api-client'
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/category/types'

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<Category[]>('/products-categories')
  return res.data
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<Category> {
  const res = await apiClient.post<Category>('/products-categories', data)
  return res.data
}

export async function createCategoryWithUpload(params: {
  name: string
  description?: string
  files: File[]
}): Promise<Category> {
  const formData = new FormData()
  formData.append('name', params.name)

  if (params.description) {
    formData.append('description', params.description)
  }

  params.files.forEach((file) => {
    formData.append('files', file)
  })

  const res = await apiClient.post<Category>('/products-categories/upload', formData)
  return res.data
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> {
  const res = await apiClient.patch<Category>(`/products-categories/${id}`, data)
  return res.data
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/products-categories/${id}`)
}
