"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { deleteProduct } from "@/app/actions/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductForm } from "./product-form"

interface ProductItem {
  id: number
  name: string
  slug: string
  description: string
  price: string
  image_url: string
  images?: string[] | null
  category_id: number
  category_name: string
  total_sales: number
  design_number?: string
}

interface AdminProductsListProps {
  products: ProductItem[]
}

export function AdminProductsList({ products }: AdminProductsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [designNumberFilter, setDesignNumberFilter] = useState("")
  const [minPriceFilter, setMinPriceFilter] = useState("")
  const [maxPriceFilter, setMaxPriceFilter] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const { toast } = useToast()

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount))
  }

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Text search (name, category)
      const matchesText = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Design number filter
      const matchesDesignNumber = !designNumberFilter || 
        (product.design_number && product.design_number.toLowerCase().includes(designNumberFilter.toLowerCase()))
      
      // Price range filter
      const productPrice = Number.parseFloat(product.price)
      const matchesMinPrice = !minPriceFilter || productPrice >= Number.parseFloat(minPriceFilter)
      const matchesMaxPrice = !maxPriceFilter || productPrice <= Number.parseFloat(maxPriceFilter)
      
      return matchesText && matchesDesignNumber && matchesMinPrice && matchesMaxPrice
    })
  }, [products, searchQuery, designNumberFilter, minPriceFilter, maxPriceFilter])

  const handleDelete = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return
    }

    const result = await deleteProduct(productId)

    if (result.success) {
      toast({
        title: "Product deleted",
        description: `${productName} has been deleted successfully.`,
      })
      window.location.reload()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  // Convert ProductItem to the format expected by ProductForm
  const prepareProductForForm = (product: ProductItem | null) => {
    if (!product) return null;
    
    return {
      ...product,
      images: product.images || (product.image_url ? [product.image_url] : [])
    };
  };

  const clearFilters = () => {
    setSearchQuery("")
    setDesignNumberFilter("")
    setMinPriceFilter("")
    setMaxPriceFilter("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Create a new product in your catalog</DialogDescription>
                </DialogHeader>
                <ProductForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Advanced Search Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <Input
                type="text"
                placeholder="Design Number"
                value={designNumberFilter}
                onChange={(e) => setDesignNumberFilter(e.target.value)}
              />
            </div>
            
            <div>
              <Input
                type="number"
                placeholder="Min Price"
                value={minPriceFilter}
                onChange={(e) => setMinPriceFilter(e.target.value)}
              />
            </div>
            
            <div>
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <p className="col-span-full py-8 text-center text-muted-foreground">
                {searchQuery || designNumberFilter || minPriceFilter || maxPriceFilter 
                  ? "No products found matching your filters" 
                  : "No products yet"}
              </p>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground">{product.category_name}</p>
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.design_number && (
                        <p className="text-xs text-muted-foreground">#{product.design_number}</p>
                      )}
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                    </div>
                    <div className="mb-4 text-sm text-muted-foreground">Total Sales: {product.total_sales}</div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>Update product information</DialogDescription>
                          </DialogHeader>
                          <ProductForm product={prepareProductForForm(editingProduct)} onSuccess={() => setEditingProduct(null)} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(product.id, product.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}