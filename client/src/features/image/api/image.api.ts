import { supabase } from '@/lib/supabase'

type UploadImageInput = {
  file: File
  productId?: string
  categoryId?: string
  contentSection?: 'home' | 'about'
}

type ImageEntity = {
  id: string
  url: string
}

function buildStorageFilePath(folder: string, id: string, file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`
  return `${folder}/${id}/${uniqueName}`
}

export async function uploadImage({
  file,
  productId,
  categoryId,
  contentSection,
}: UploadImageInput): Promise<ImageEntity> {
  const folder = productId ? 'products' : categoryId ? 'categories' : 'content'
  const id = productId || categoryId || contentSection || 'general'
  const filePath = buildStorageFilePath(folder, id, file)

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('web-shop')
    .upload(filePath, file)
  
  if (uploadError) throw uploadError

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('web-shop')
    .getPublicUrl(filePath)

  // Create image record
  const { data, error } = await supabase
    .from('images')
    .insert([
      {
        product_id: productId || null,
        category_id: categoryId || null,
        content_section: contentSection || null,
        url: publicUrlData.publicUrl,
      },
    ])
    .select()
    .single()
  
  if (error) throw error
  
  return data as ImageEntity
}

export async function deleteImage(id: string): Promise<void> {
  // Get image to find file path
  const { data: image, error: fetchError } = await supabase
    .from('images')
    .select('url')
    .eq('id', id)
    .single()
  
  if (fetchError) throw fetchError

  // Extract file path from URL
  const urlParts = image.url.split('/storage/v1/object/public/web-shop/')
  if (urlParts.length === 2) {
    const filePath = urlParts[1]
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('web-shop')
      .remove([filePath])
    
    if (deleteError) throw deleteError
  }

  // Delete image record
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
