export type ProductImage = {
  id?: string
  url: string
}

export type ProductCategory = {
  id: string
  name: string
}

export type Product = {
  id: string
  name: string
  description?: string
  images?: ProductImage[]
  categories?: ProductCategory[]
  createdAt?: string
  updatedAt?: string
}

export type CreateProductInput = {
  name: string
  description?: string
  categoryIds?: string[]
  images?: Array<{ url: string }>
}

export type UpdateProductInput = Partial<CreateProductInput>
