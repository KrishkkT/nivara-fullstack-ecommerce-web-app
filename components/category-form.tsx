"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CategoryFormProps {
  category?: {
    id: number
    name: string
    slug?: string
    description: string
    image_url: string
    seo_title?: string
    seo_description?: string
  }
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image_url: category?.image_url || "",
    seo_title: category?.seo_title || "",
    seo_description: category?.seo_description || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(category?.image_url || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Auto-generate slug from name
  useEffect(() => {
    if (!category && formData.name && !formData.slug) {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, category, formData.slug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploading(true);
      
      try {
        // In a real implementation, you would upload to a storage service
        // For now, we'll use a data URL but show how it would work with an actual upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreviewImage(result);
          setFormData(prev => ({ ...prev, image_url: result }));
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image upload error:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
    // Form validation
    if (!formData.name?.trim()) {
      alert("Category name is required");
      return;
    }
      
    if (!formData.slug?.trim()) {
      alert("Slug is required");
      return;
    }
      
    // Image is required but can be either URL or uploaded file
    if (!formData.image_url?.trim()) {
      alert("Image is required. Please upload an image or provide an image URL.");
      return;
    }
      
    if (!formData.description?.trim()) {
      alert("Description is required");
      return;
    }
      
    setIsSubmitting(true);
      
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        imageUrl: formData.image_url
      };
        
      await onSubmit(submitData);
    } catch (error) {
      console.error("Category form submission error:", error);
      alert("An error occurred while saving the category. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Category" : "Add New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Necklace"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="e.g., necklace"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image *</Label>
              <div className="space-y-2">
                {previewImage ? (
                  <div className="relative inline-block">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                    </label>
                  </div>
                )}
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="https://... or upload an image"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Category description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              placeholder="Automatically generated if left empty"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              placeholder="Automatically uses description if left empty"
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving..." : category ? "Update Category" : "Add Category"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || uploading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
