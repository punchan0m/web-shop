import { apiClient } from '@/services/api-client'
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/features/product/types'

export async function getProducts(): Promise<Product[]> {
  const res = await apiClient.get<Product[]>('/products')
  return res.data
}

export async function getProductById(id: string): Promise<Product> {
  const res = await apiClient.get<Product>(`/products/${id}`)
  return res.data
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const res = await apiClient.post<Product>('/products', data)
  return res.data
}

export async function createProductWithUpload(params: {
  name: string
  description?: string
  categoryIds: string[]
  files: File[]
}): Promise<Product> {
  const formData = new FormData()
  formData.append('name', params.name)

  if (params.description) {
    formData.append('description', params.description)
  }

  params.categoryIds.forEach((categoryId) => {
    formData.append('categoryIds', categoryId)
  })

  params.files.forEach((file) => {
    formData.append('files', file)
  })

  const res = await apiClient.post<Product>('/products/upload', formData)
  return res.data
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<Product> {
  const res = await apiClient.patch<Product>(`/products/${id}`, data)
  return res.data
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}
