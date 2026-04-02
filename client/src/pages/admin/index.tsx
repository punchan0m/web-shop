import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ROUTES } from '@/constants/routes'
import { logoutAdmin } from '@/features/auth/admin-auth'
import { useCategories } from '@/features/category/hooks/use-categories'
import { useCreateCategory } from '@/features/category/hooks/use-create-category'
import { useCreateCategoryWithUpload } from '@/features/category/hooks/use-create-category-with-upload'
import { useDeleteCategory } from '@/features/category/hooks/use-delete-category'
import { useUpdateCategory } from '@/features/category/hooks/use-update-category'
import { useDeleteImage } from '@/features/image/hooks/use-delete-image'
import { useUploadImage } from '@/features/image/hooks/use-upload-image'
import { useProducts } from '@/features/product/hooks/use-products'
import { useCreateProduct } from '@/features/product/hooks/use-create-product'
import { useCreateProductWithUpload } from '@/features/product/hooks/use-create-product-with-upload'
import { useDeleteProduct } from '@/features/product/hooks/use-delete-product'
import { useUpdateProduct } from '@/features/product/hooks/use-update-product'
import { AdminContentPanel } from '@/pages/admin/content-panel'

const NAME_MAX = 30
const DESCRIPTION_MAX = 200
const IMAGE_MAX = 5

type FilePickerProps = {
  id: string
  selectedCount: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function FilePicker({ id, selectedCount, onChange }: FilePickerProps) {
  return (
    <div className="space-y-2">
      <input id={id} type="file" multiple accept="image/*" className="hidden" onChange={onChange} />
      <label
        htmlFor={id}
        className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-brass/50 bg-brass/10 px-4 text-sm font-semibold text-brass transition hover:bg-brass/20"
      >
        Choose images
      </label>
      <p className="text-xs text-ink/60">Selected {selectedCount}/{IMAGE_MAX} image(s)</p>
    </div>
  )
}

const validateText = (name: string, description: string) => {
  const n = name.trim()
  const d = description.trim()

  if (!n) {
    return `Name is required and must not exceed ${NAME_MAX} characters.`
  }

  if (n.length > NAME_MAX) {
    return `Name must be at most ${NAME_MAX} characters.`
  }

  if (d.length > DESCRIPTION_MAX) {
    return `Description must be at most ${DESCRIPTION_MAX} characters.`
  }

  return null
}

export function AdminPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [activeMenu, setActiveMenu] = useState<'content' | 'category' | 'product'>('content')

  const [createCategoryFiles, setCreateCategoryFiles] = useState<File[]>([])
  const [createProductFiles, setCreateProductFiles] = useState<File[]>([])
  const [createProductCategoryQuery, setCreateProductCategoryQuery] = useState('')
  const [createSelectedCategoryIds, setCreateSelectedCategoryIds] = useState<string[]>([])

  const [categorySearch, setCategorySearch] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('')
  const [editingCategoryFiles, setEditingCategoryFiles] = useState<File[]>([])

  const [productSearch, setProductSearch] = useState('')
  const [productFilterCategoryId, setProductFilterCategoryId] = useState('all')
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [editingProductName, setEditingProductName] = useState('')
  const [editingProductDescription, setEditingProductDescription] = useState('')
  const [editingProductFiles, setEditingProductFiles] = useState<File[]>([])
  const [editingProductCategoryQuery, setEditingProductCategoryQuery] = useState('')
  const [editingSelectedCategoryIds, setEditingSelectedCategoryIds] = useState<string[]>([])

  const { data: categories = [] } = useCategories()
  const { data: products = [] } = useProducts()

  const createCategory = useCreateCategory()
  const createCategoryWithUpload = useCreateCategoryWithUpload()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const createProduct = useCreateProduct()
  const createProductWithUpload = useCreateProductWithUpload()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const uploadImage = useUploadImage()
  const deleteImage = useDeleteImage()

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name))
  }, [categories])

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  const filteredCreateCategories = useMemo(() => {
    const query = createProductCategoryQuery.trim().toLowerCase()
    if (!query) {
      return sortedCategories
    }

    return sortedCategories.filter((category) => {
      return `${category.name} ${category.description || ''}`.toLowerCase().includes(query)
    })
  }, [sortedCategories, createProductCategoryQuery])

  const filteredEditCategories = useMemo(() => {
    const query = editingProductCategoryQuery.trim().toLowerCase()

    const visible = sortedCategories.filter((category) => {
      if (!query) {
        return true
      }

      return `${category.name} ${category.description || ''}`.toLowerCase().includes(query)
    })

    return visible.sort((a, b) => {
      const aSelected = editingSelectedCategoryIds.includes(a.id)
      const bSelected = editingSelectedCategoryIds.includes(b.id)

      if (aSelected && !bSelected) {
        return -1
      }
      if (!aSelected && bSelected) {
        return 1
      }
      return a.name.localeCompare(b.name)
    })
  }, [sortedCategories, editingProductCategoryQuery, editingSelectedCategoryIds])

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase()
    if (!query) {
      return sortedCategories
    }

    return sortedCategories.filter((category) => {
      return `${category.name} ${category.description || ''}`.toLowerCase().includes(query)
    })
  }, [sortedCategories, categorySearch])

  const filteredProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase()

    return sortedProducts.filter((product) => {
      const matchesQuery = `${product.name} ${product.description || ''}`.toLowerCase().includes(query)
      if (!matchesQuery) {
        return false
      }

      if (productFilterCategoryId === 'all') {
        return true
      }

      return (product.categories || []).some((category) => category.id === productFilterCategoryId)
    })
  }, [sortedProducts, productSearch, productFilterCategoryId])

  const toggleCategoryId = (id: string, selectedIds: string[], setSelectedIds: (ids: string[]) => void) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
      return
    }
    setSelectedIds([...selectedIds, id])
  }

  const clearCreateCategoryForm = (form: HTMLFormElement) => {
    form.reset()
    setCreateCategoryFiles([])
  }

  const clearCreateProductForm = (form: HTMLFormElement) => {
    form.reset()
    setCreateProductFiles([])
    setCreateProductCategoryQuery('')
    setCreateSelectedCategoryIds([])
  }

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '')
    const description = String(formData.get('description') || '')

    const message = validateText(name, description)
    if (message) {
      window.alert(message)
      return
    }

    if (createCategoryFiles.length > IMAGE_MAX) {
      window.alert(`You can upload up to ${IMAGE_MAX} images per item.`)
      return
    }

    try {
      if (createCategoryFiles.length > 0) {
        await createCategoryWithUpload.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          files: createCategoryFiles,
        })
      } else {
        await createCategory.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
        })
      }
      clearCreateCategoryForm(form)
    } catch {
      setError('Unable to create category. Check input values and try again.')
    }
  }

  const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '')
    const description = String(formData.get('description') || '')

    const message = validateText(name, description)
    if (message) {
      window.alert(message)
      return
    }

    if (createProductFiles.length > IMAGE_MAX) {
      window.alert(`You can upload up to ${IMAGE_MAX} images per item.`)
      return
    }

    try {
      if (createProductFiles.length > 0) {
        await createProductWithUpload.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryIds: createSelectedCategoryIds,
          files: createProductFiles,
        })
      } else {
        await createProduct.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
          categoryIds: createSelectedCategoryIds,
        })
      }
      clearCreateProductForm(form)
    } catch {
      setError('Unable to create product. Check input values and try again.')
    }
  }

  const beginEditCategory = (id: string, name: string, description?: string) => {
    setEditingCategoryId(id)
    setEditingCategoryName(name)
    setEditingCategoryDescription(description || '')
    setEditingCategoryFiles([])
  }

  const beginEditProduct = (id: string, name: string, description?: string, categoryIds?: string[]) => {
    setEditingProductId(id)
    setEditingProductName(name)
    setEditingProductDescription(description || '')
    setEditingProductFiles([])
    setEditingProductCategoryQuery('')
    setEditingSelectedCategoryIds(categoryIds || [])
  }

  const saveEditCategory = async (existingImageCount: number) => {
    if (!editingCategoryId) {
      return
    }

    const message = validateText(editingCategoryName, editingCategoryDescription)
    if (message) {
      window.alert(message)
      return
    }

    if (existingImageCount + editingCategoryFiles.length > IMAGE_MAX) {
      window.alert(`Total images cannot exceed ${IMAGE_MAX}.`)
      return
    }

    try {
      await updateCategory.mutateAsync({
        id: editingCategoryId,
        data: {
          name: editingCategoryName.trim(),
          description: editingCategoryDescription.trim() || undefined,
        },
      })

      if (editingCategoryFiles.length > 0) {
        await Promise.all(
          editingCategoryFiles.map((file) => uploadImage.mutateAsync({ file, categoryId: editingCategoryId })),
        )
      }

      setEditingCategoryId(null)
      setEditingCategoryFiles([])
    } catch {
      setError('Unable to update category.')
    }
  }

  const saveEditProduct = async (existingImageCount: number) => {
    if (!editingProductId) {
      return
    }

    const message = validateText(editingProductName, editingProductDescription)
    if (message) {
      window.alert(message)
      return
    }

    if (existingImageCount + editingProductFiles.length > IMAGE_MAX) {
      window.alert(`Total images cannot exceed ${IMAGE_MAX}.`)
      return
    }

    try {
      await updateProduct.mutateAsync({
        id: editingProductId,
        data: {
          name: editingProductName.trim(),
          description: editingProductDescription.trim() || undefined,
          categoryIds: editingSelectedCategoryIds,
        },
      })

      if (editingProductFiles.length > 0) {
        await Promise.all(
          editingProductFiles.map((file) => uploadImage.mutateAsync({ file, productId: editingProductId })),
        )
      }

      setEditingProductId(null)
      setEditingProductFiles([])
      setEditingProductCategoryQuery('')
      setEditingSelectedCategoryIds([])
    } catch {
      setError('Unable to update product.')
    }
  }

  const handleDeleteImage = async (imageId?: string) => {
    if (!imageId) {
      return
    }

    if (!window.confirm('Delete this image?')) {
      return
    }

    try {
      await deleteImage.mutateAsync(imageId)
    } catch {
      setError('Unable to delete image.')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) {
      return
    }

    try {
      await deleteCategory.mutateAsync(id)
    } catch {
      setError('Unable to delete category.')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) {
      return
    }

    try {
      await deleteProduct.mutateAsync(id)
    } catch {
      setError('Unable to delete product.')
    }
  }

  const handleLogout = () => {
    logoutAdmin()
    navigate(ROUTES.adminLogin)
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-extrabold text-ink">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className={activeMenu === 'content' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'}
          onClick={() => setActiveMenu('content')}
        >
          Content
        </Button>
        <Button
          type="button"
          className={activeMenu === 'category' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'}
          onClick={() => setActiveMenu('category')}
        >
          Product category
        </Button>
        <Button
          type="button"
          className={activeMenu === 'product' ? 'bg-brass text-white' : 'border border-ink/20 bg-white text-ink'}
          onClick={() => setActiveMenu('product')}
        >
          Product
        </Button>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {activeMenu === 'content' ? (
        <AdminContentPanel />
      ) : activeMenu === 'category' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <h2 className="font-display text-2xl font-bold">Create Product Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <Input name="name" placeholder="Category name" maxLength={NAME_MAX} />
              <Textarea name="description" placeholder="Description" maxLength={DESCRIPTION_MAX} className="min-h-24 max-h-44" />
              <FilePicker
                id="create-category-files"
                selectedCount={createCategoryFiles.length}
                onChange={(event) => setCreateCategoryFiles(Array.from(event.target.files || []).slice(0, IMAGE_MAX))}
              />
              <Button type="submit" disabled={createCategory.isPending || createCategoryWithUpload.isPending}>
                {createCategory.isPending || createCategoryWithUpload.isPending ? 'Saving...' : 'Create Category'}
              </Button>
            </form>
          </Card>

          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold">Manage Categories</h2>
              <Input placeholder="Search category by name/description" value={categorySearch} onChange={(event) => setCategorySearch(event.target.value)} />
            </div>

            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div key={category.id} className="rounded-xl border border-ink/15 bg-parchment/35 p-3">
                  {editingCategoryId === category.id ? (
                    <div className="space-y-2">
                      <Input maxLength={NAME_MAX} value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} />
                      <Textarea value={editingCategoryDescription} maxLength={DESCRIPTION_MAX} className="min-h-24 max-h-44" onChange={(event) => setEditingCategoryDescription(event.target.value)} />
                      <FilePicker
                        id={`edit-category-files-${category.id}`}
                        selectedCount={editingCategoryFiles.length}
                        onChange={(event) => setEditingCategoryFiles(Array.from(event.target.files || []).slice(0, IMAGE_MAX))}
                      />

                      <div className="grid gap-2 sm:grid-cols-3">
                        {(category.images || []).map((image) => (
                          <div key={image.id || image.url} className="overflow-hidden rounded-lg border border-ink/10 p-1">
                            <img src={`${import.meta.env.VITE_API_URL}${image.url}`} alt={category.name} className="h-20 w-full rounded object-cover" />
                            <Button type="button" className="mt-1 h-8 w-full bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteImage(image.id)}>
                              Delete image
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => saveEditCategory((category.images || []).length)}>Save</Button>
                        <Button type="button" variant="ghost" onClick={() => setEditingCategoryId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{category.name}</p>
                        <p className="line-clamp-2 break-words text-sm text-ink/60">{category.description || 'No description'}</p>
                        <div className="mt-2 flex gap-2 overflow-x-auto">
                          {(category.images || []).map((image) => (
                            <img key={image.id || image.url} src={`${import.meta.env.VITE_API_URL}${image.url}`} alt={category.name} className="h-14 w-20 rounded object-cover" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => beginEditCategory(category.id, category.name, category.description)}>Edit</Button>
                        <Button type="button" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <h2 className="font-display text-2xl font-bold">Create Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <Input name="name" placeholder="Product name" maxLength={NAME_MAX} />
              <Textarea name="description" placeholder="Description" maxLength={DESCRIPTION_MAX} className="min-h-24 max-h-44" />
              <FilePicker
                id="create-product-files"
                selectedCount={createProductFiles.length}
                onChange={(event) => setCreateProductFiles(Array.from(event.target.files || []).slice(0, IMAGE_MAX))}
              />

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Category combobox (multi-select, optional)</p>
                <Input placeholder="Search category..." value={createProductCategoryQuery} onChange={(event) => setCreateProductCategoryQuery(event.target.value)} />
                <div className="grid max-h-44 gap-2 overflow-auto rounded-lg border border-ink/10 p-2 sm:grid-cols-2">
                  {filteredCreateCategories.map((category) => {
                    const checked = createSelectedCategoryIds.includes(category.id)
                    return (
                      <button
                        key={category.id}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => toggleCategoryId(category.id, createSelectedCategoryIds, setCreateSelectedCategoryIds)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${checked ? 'border-yellow-500 bg-yellow-400/80 text-ink' : 'border-ink/15 bg-white text-ink/75'}`}
                      >
                        <span className="truncate">{category.name}</span>
                        <span className={`ml-2 h-4 w-4 rounded-full border ${checked ? 'border-yellow-700 bg-yellow-600' : 'border-ink/30 bg-white'}`} />
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-ink/60">Selected: {createSelectedCategoryIds.length}</p>
              </div>

              <Button type="submit" disabled={createProduct.isPending || createProductWithUpload.isPending}>
                {createProduct.isPending || createProductWithUpload.isPending ? 'Saving...' : 'Create Product'}
              </Button>
            </form>
          </Card>

          <Card className="space-y-4 border-ink/20 bg-white shadow-[0_18px_40px_-30px_rgba(0,0,0,0.45)]">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold">Manage Products</h2>
              <Input placeholder="Search product by name/description" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} />
              <select className="h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm" value={productFilterCategoryId} onChange={(event) => setProductFilterCategoryId(event.target.value)}>
                <option value="all">All categories</option>
                {sortedCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="rounded-xl border border-ink/15 bg-parchment/35 p-3">
                  {editingProductId === product.id ? (
                    <div className="space-y-2">
                      <Input maxLength={NAME_MAX} value={editingProductName} onChange={(event) => setEditingProductName(event.target.value)} />
                      <Textarea value={editingProductDescription} maxLength={DESCRIPTION_MAX} className="min-h-24 max-h-44" onChange={(event) => setEditingProductDescription(event.target.value)} />
                      <FilePicker
                        id={`edit-product-files-${product.id}`}
                        selectedCount={editingProductFiles.length}
                        onChange={(event) => setEditingProductFiles(Array.from(event.target.files || []).slice(0, IMAGE_MAX))}
                      />

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Edit category combobox</p>
                        <Input placeholder="Search category..." value={editingProductCategoryQuery} onChange={(event) => setEditingProductCategoryQuery(event.target.value)} />
                        <div className="grid max-h-44 gap-2 overflow-auto rounded-lg border border-ink/10 p-2 sm:grid-cols-2">
                          {filteredEditCategories.map((category) => {
                            const checked = editingSelectedCategoryIds.includes(category.id)
                            return (
                              <button
                                key={category.id}
                                type="button"
                                aria-pressed={checked}
                                onClick={() => toggleCategoryId(category.id, editingSelectedCategoryIds, setEditingSelectedCategoryIds)}
                                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${checked ? 'border-yellow-500 bg-yellow-400/80 text-ink' : 'border-ink/15 bg-white text-ink/75'}`}
                              >
                                <span className="truncate">{category.name}</span>
                                <span className={`ml-2 h-4 w-4 rounded-full border ${checked ? 'border-yellow-700 bg-yellow-600' : 'border-ink/30 bg-white'}`} />
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-ink/60">Selected: {editingSelectedCategoryIds.length}</p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        {(product.images || []).map((image) => (
                          <div key={image.id || image.url} className="overflow-hidden rounded-lg border border-ink/10 p-1">
                            <img src={`${import.meta.env.VITE_API_URL}${image.url}`} alt={product.name} className="h-20 w-full rounded object-cover" />
                            <Button type="button" className="mt-1 h-8 w-full bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteImage(image.id)}>
                              Delete image
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => saveEditProduct((product.images || []).length)}>Save</Button>
                        <Button type="button" variant="ghost" onClick={() => setEditingProductId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{product.name}</p>
                        <p className="truncate text-xs uppercase tracking-[0.15em] text-brass">{(product.categories || []).map((item) => item.name).join(' / ') || 'Uncategorized'}</p>
                        <p className="line-clamp-2 break-words text-sm text-ink/60">{product.description || 'No description'}</p>
                        <div className="mt-2 flex gap-2 overflow-x-auto">
                          {(product.images || []).map((image) => (
                            <img key={image.id || image.url} src={`${import.meta.env.VITE_API_URL}${image.url}`} alt={product.name} className="h-14 w-20 rounded object-cover" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" className="bg-yellow-500 text-black hover:bg-yellow-600" onClick={() => beginEditProduct(product.id, product.name, product.description, (product.categories || []).map((item) => item.id))}>Edit</Button>
                        <Button type="button" className="bg-red-600 text-white hover:bg-red-700" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </section>
  )
}
