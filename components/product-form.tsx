"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addProduct, updateProduct } from "@/app/actions/admin"
import { X, Upload } from "lucide-react"

interface Product {
  id: number
  name: string
  description: string
  price: string
  image_url: string
  images?: string[] | null
  category_id: number
  metal_purity?: string
  design_number?: string
}

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(() => {
    // Handle various possible states of product.images
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(url => url && url.trim() !== '');
    }
    // Fallback to image_url if images array is empty or invalid
    if (product?.image_url && product.image_url.trim() !== '') {
      return [product.image_url];
    }
    return [];
  })
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.category_id?.toString() || "")
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)

        if (!product && data.length > 0) {
          setSelectedCategory(data[0].id.toString())
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [product])

  function addImageUrl() {
    if (currentImageUrl.trim()) {
      setImageUrls([...imageUrls, currentImageUrl.trim()])
      setCurrentImageUrl("")
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImage(true)

    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Warning",
            description: `${file.name} is too large. Please use images under 5MB or provide a URL instead.`,
            variant: "destructive",
          })
          continue
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageUrls((prev) => [...prev, event.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      }

      toast({
        title: "Images added",
        description: `${files.length} image(s) added successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  function removeImage(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Generate slug from product name
    const productName = formData.get("name") as string;
    const slug = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const data = {
      name: productName,
      slug: slug,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      categoryId: Number.parseInt(selectedCategory),
      imageUrl: imageUrls[0] || "",
      images: imageUrls.length > 0 ? imageUrls : [],
      metalPurity: formData.get("metal_purity") as string,
      designNumber: formData.get("design_number") as string,
      compareAtPrice: '',
      isFeatured: false,
      isActive: true
    }

    const result = product ? await updateProduct(product.id, data) : await addProduct(data)

    setLoading(false)

    if (result.success) {
      toast({
        title: product ? "Product updated" : "Product added",
        description: product ? "Product has been updated successfully." : "Product has been added successfully.",
      })
      onSuccess()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save product",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} required rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₹) *</Label>
        <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Category *</Label>
        <Select name="category_id" value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Add from URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={currentImageUrl}
                  onChange={(e) => setCurrentImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addImageUrl()
                    }
                  }}
                />
                <Button type="button" onClick={addImageUrl} variant="secondary">
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Upload from Device</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingImage}
                  className="cursor-pointer"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button type="button" variant="secondary" disabled={uploadingImage} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Browse"}
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Add multiple images via URL or upload from your device (max 5MB per image). First image will be the main
            product image.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="metal_purity">Metal Purity</Label>
          <Input
            id="metal_purity"
            name="metal_purity"
            placeholder="925 Sterling"
            defaultValue={product?.metal_purity}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="design_number">Design Number</Label>
          <Input id="design_number" name="design_number" placeholder="DN-001" defaultValue={product?.design_number} />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </Button>
    </form>
  )
}