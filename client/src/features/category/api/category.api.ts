import { supabase } from '@/lib/supabase'
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/category/types'

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

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, description, images!left(id, url)')
  
  if (error) {
    if (isMissingTableError(error)) {
      return []
    }
    throw error
  }

  return (data || []).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    images: category.images || [],
  })) as Category[]
}

export async function createCategory(
  data: CreateCategoryInput,
): Promise<Category> {
  const { data: result, error } = await supabase
    .from('categories')
    .insert([
      {
        name: data.name,
        description: data.description,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  return result as Category
}

export async function createCategoryWithUpload(params: {
  name: string
  description?: string
  files: File[]
}): Promise<Category> {
  // Create category first
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .insert([
      {
        name: params.name,
        description: params.description,
      },
    ])
    .select()
    .single()
  
  if (categoryError) throw categoryError

  // Upload images to storage
  const images: Array<{ id: string; url: string }> = []
  
  for (const file of params.files) {
    const filePath = buildStorageFilePath('categories', category.id, file)
    
    const { error: uploadError } = await supabase.storage
      .from('web-shop')
      .upload(filePath, file)
    
    if (uploadError) throw uploadError
    
    const { data: publicUrlData } = supabase.storage
      .from('web-shop')
      .getPublicUrl(filePath)

    const { data: imageRow, error: imageError } = await supabase
      .from('images')
      .insert([
        {
          category_id: category.id,
          url: publicUrlData.publicUrl,
        },
      ])
      .select('id, url')
      .single()

    if (imageError) throw imageError

    images.push({
      id: imageRow.id,
      url: imageRow.url,
    })
  }

  return { ...category, images } as Category
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput,
): Promise<Category> {
  const { data: result, error } = await supabase
    .from('categories')
    .update({
      name: data.name,
      description: data.description,
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return result as Category
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
