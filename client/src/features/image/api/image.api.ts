import { apiClient } from '@/services/api-client'

type UploadImageInput = {
  file: File
  productId?: string
  categoryId?: string
}

type ImageEntity = {
  id: string
  url: string
}

export async function uploadImage({
  file,
  productId,
  categoryId,
}: UploadImageInput): Promise<ImageEntity> {
  const formData = new FormData()
  formData.append('file', file)

  if (productId) {
    formData.append('productId', productId)
  }

  if (categoryId) {
    formData.append('categoryId', categoryId)
  }

  const res = await apiClient.post<ImageEntity>('/images/upload', formData)
  return res.data
}

export async function deleteImage(id: string): Promise<void> {
  await apiClient.delete(`/images/${id}`)
}
