import { sql } from "@/lib/db"
import { SearchResults } from "@/components/search-results"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; designNumber?: string; minPrice?: string; maxPrice?: string }
}) {
  const query = searchParams.q || ""
  const designNumber = searchParams.designNumber || ""
  const minPrice = searchParams.minPrice || ""
  const maxPrice = searchParams.maxPrice || ""

  let products = []

  if (query || designNumber || minPrice || maxPrice) {
    let sqlQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `

    const conditions = []
    const values = []

    // Text search (name, description, category)
    if (query) {
      conditions.push(`
        (p.name ILIKE $${conditions.length + 1} OR 
         p.description ILIKE $${conditions.length + 2} OR 
         c.name ILIKE $${conditions.length + 3} OR
         p.design_number ILIKE $${conditions.length + 4})
      `)
      values.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`)
    }

    // Design number search
    if (designNumber) {
      conditions.push(`p.design_number ILIKE $${conditions.length + 1}`)
      values.push(`%${designNumber}%`)
    }

    // Price range search
    if (minPrice) {
      conditions.push(`p.price >= $${conditions.length + 1}`)
      values.push(minPrice)
    }
    
    if (maxPrice) {
      conditions.push(`p.price <= $${conditions.length + 1}`)
      values.push(maxPrice)
    }

    if (conditions.length > 0) {
      sqlQuery += " AND " + conditions.join(" AND ")
    }

    sqlQuery += " ORDER BY p.created_at DESC LIMIT 50"

    products = await sql(sqlQuery, ...values)
  }

  return <SearchResults query={query} products={products} />
}