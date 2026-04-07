import { supabase } from '@/lib/supabase'
import type {
  CreateProductInput,
  Product,
  ProductCategory,
  UpdateProductInput,
} from '@/features/product/types'

function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const maybeError = error as { code?: string; message?: string }
  return (
    maybeError.code === 'PGRST205' ||
    (typeof maybeError.message === 'string' &&
      maybeError.message.includes('Could not find the table'))
  )
}

function buildStorageFilePath(folder: string, id: string, file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`
  return `${folder}/${id}/${uniqueName}`
}

function normalizeProductCategories(raw: Array<{ categories: unknown }> | undefined): ProductCategory[] {
  if (!raw) return []

  const result: ProductCategory[] = []

  for (const row of raw) {
    const value = row.categories as unknown

    if (Array.isArray(value)) {
      for (const item of value) {
        const category = item as { id?: string; name?: string }
        if (category.id && category.name) {
          result.push({ id: category.id, name: category.name })
        }
      }
    } else {
      const category = value as { id?: string; name?: string }
      if (category?.id && category?.name) {
        result.push({ id: category.id, name: category.name })
      }
    }
  }

  return result
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      description,
      created_at,
      updated_at,
      images!left(id, url),
      product_categories!left(categories(id, name))
    `)
  
  if (error) {
    if (isMissingTableError(error)) {
      return []
    }
    throw error
  }
  
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    price: typeof p.price === 'number' ? p.price : undefined,
    description: p.description,
    images: p.images || [],
    categories: normalizeProductCategories(p.product_categories),
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  })) as Product[]
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      description,
      created_at,
      updated_at,
      images!left(id, url),
      product_categories!left(categories(id, name))
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  
  return {
    id: data.id,
    name: data.name,
    price: typeof data.price === 'number' ? data.price : undefined,
    description: data.description,
    images: data.images || [],
    categories: normalizeProductCategories(data.product_categories),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Product
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const { data: result, error } = await supabase
    .from('products')
    .insert([
      {
        name: data.name,
        price: data.price,
        description: data.description,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  
  // Add categories if provided
  if (data.categoryIds && data.categoryIds.length > 0) {
    const categoryLinks = data.categoryIds.map(categoryId => ({
      product_id: result.id,
      category_id: categoryId,
    }))
    
    const { error: linkError } = await supabase
      .from('product_categories')
      .insert(categoryLinks)
    
    if (linkError) throw linkError
  }

  return {
    id: result.id,
    name: result.name,
    price: typeof result.price === 'number' ? result.price : undefined,
    description: result.description,
  } as Product
}

export async function createProductWithUpload(params: {
  name: string
  price?: number
  description?: string
  categoryIds: string[]
  files: File[]
}): Promise<Product> {
  // Create product first
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([
      {
        name: params.name,
        price: params.price,
        description: params.description,
      },
    ])
    .select()
    .single()
  
  if (productError) throw productError

  // Upload images and create image records
  for (const file of params.files) {
    const filePath = buildStorageFilePath('products', product.id, file)
    
    const { error: uploadError } = await supabase.storage
      .from('web-shop')
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    const { data: publicUrlData } = supabase.storage
      .from('web-shop')
      .getPublicUrl(filePath)
    
    const { error: imageError } = await supabase
      .from('images')
      .insert([
        {
          product_id: product.id,
          url: publicUrlData.publicUrl,
        },
      ])
    
    if (imageError) throw imageError
  }

  // Add category links
  if (params.categoryIds.length > 0) {
    const categoryLinks = params.categoryIds.map(categoryId => ({
      product_id: product.id,
      category_id: categoryId,
    }))
    
    const { error: linkError } = await supabase
      .from('product_categories')
      .insert(categoryLinks)
    
    if (linkError) throw linkError
  }

  return {
    id: product.id,
    name: product.name,
    price: typeof product.price === 'number' ? product.price : undefined,
    description: product.description,
  } as Product
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<Product> {
  const { data: result, error } = await supabase
    .from('products')
    .update({
      name: data.name,
      price: data.price,
      description: data.description,
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  return {
    id: result.id,
    name: result.name,
    price: typeof result.price === 'number' ? result.price : undefined,
    description: result.description,
  } as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
