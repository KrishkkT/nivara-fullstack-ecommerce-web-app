import { sql } from "@/lib/db"
import { AdminCategoriesList } from "@/components/admin-categories-list"

export default async function AdminCategoriesPage() {
  const categories = await sql`
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.image_url,
      c.meta_title as seo_title,
      c.meta_description as seo_description,
      COUNT(p.id)::integer as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.meta_title, c.meta_description
    ORDER BY c.name ASC
  `

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Category Management</h1>
        <p className="text-muted-foreground mt-2">Manage product categories and their SEO settings</p>
      </div>

      <AdminCategoriesList categories={categories as any[]} />
    </div>
  )
}
