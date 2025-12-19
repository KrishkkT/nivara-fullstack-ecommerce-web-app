"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CategoryForm } from "@/components/category-form"
import { addCategory, updateCategory, deleteCategory } from "@/app/actions/admin"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image_url: string
  seo_title?: string
  seo_description?: string
  product_count: number
}

interface AdminCategoriesListProps {
  categories: Category[]
}

export function AdminCategoriesList({ categories }: AdminCategoriesListProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const { toast } = useToast()

  const handleAddCategory = async (data: any) => {
    const result = await addCategory(data)
    if (result.success) {
      toast({
        title: "Success",
        description: "Category added successfully",
      })
      setIsAddingCategory(false)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = async (categoryId: number, data: any) => {
    const result = await updateCategory(categoryId, data)
    if (result.success) {
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
      setEditingCategory(null)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return

    const result = await deleteCategory(deletingCategory.id)
    if (result.success) {
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      setDeletingCategory(null)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsAddingCategory(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {isAddingCategory && <CategoryForm onSubmit={handleAddCategory} onCancel={() => setIsAddingCategory(false)} />}

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onSubmit={(data) => handleUpdateCategory(editingCategory.id, data)}
          onCancel={() => setEditingCategory(null)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {category.product_count} product{category.product_count !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingCategory(category)}
                    disabled={category.product_count > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              )}
              {category.seo_title && (
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    SEO: {category.seo_title}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
