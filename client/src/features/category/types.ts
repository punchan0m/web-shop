export type CategoryImage = {
  id?: string
  url: string
}

export type Category = {
  id: string
  name: string
  description?: string
  images?: CategoryImage[]
}

export type CreateCategoryInput = {
  name: string
  description?: string
  images?: Array<{ url: string }>
}

export type UpdateCategoryInput = {
  name?: string
  description?: string
}
