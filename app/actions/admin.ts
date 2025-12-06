"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"

export async function updateOrderStatus(orderId: number, status: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update order" }
  }
}

export async function deleteProduct(productId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM products
      WHERE id = ${productId}
    `

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete product" }
  }
}

export async function addProduct(data: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [data.image_url])

    await sql`
      INSERT INTO products (
        name, slug, description, price, category_id, image_url, images, metal_purity, design_number
      )
      VALUES (
        ${data.name}, ${slug}, ${data.description}, ${data.price}, 
        ${data.category_id}, ${data.image_url},
        ${imagesJson}, ${data.metal_purity || null}, ${data.design_number || null}
      )
    `

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to add product" }
  }
}

export async function updateProduct(productId: number, data: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [data.image_url])

    await sql`
      UPDATE products
      SET 
        name = ${data.name},
        description = ${data.description},
        price = ${data.price},
        category_id = ${data.category_id},
        image_url = ${data.image_url},
        images = ${imagesJson},
        metal_purity = ${data.metal_purity || null},
        design_number = ${data.design_number || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
    `

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    revalidatePath(`/products/${productId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update product" }
  }
}

export async function addCategory(data: {
  name: string
  description: string
  image_url: string
  seo_title?: string
  seo_description?: string
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`
    const seoDescription = data.seo_description || data.description

    await sql`
      INSERT INTO categories (name, slug, description, image_url, meta_title, meta_description)
      VALUES (${data.name}, ${slug}, ${data.description}, ${data.image_url}, ${seoTitle}, ${seoDescription})
    `

    revalidatePath("/admin/categories")
    revalidatePath("/shop")
    revalidatePath("/categories")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to add category" }
  }
}

export async function updateCategory(
  categoryId: number,
  data: { name: string; description: string; image_url: string; seo_title?: string; seo_description?: string },
) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`
    const seoDescription = data.seo_description || data.description

    await sql`
      UPDATE categories
      SET 
        name = ${data.name},
        slug = ${slug},
        description = ${data.description},
        image_url = ${data.image_url},
        meta_title = ${seoTitle},
        meta_description = ${seoDescription}
      WHERE id = ${categoryId}
    `

    revalidatePath("/admin/categories")
    revalidatePath("/shop")
    revalidatePath(`/categories/${slug}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update category" }
  }
}

export async function deleteCategory(categoryId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM categories
      WHERE id = ${categoryId}
    `

    revalidatePath("/admin/categories")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete category" }
  }
}

export async function cancelOrder(orderId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { success: false, error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  try {
    // Check if order exists
    const order = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `

    if (order.length === 0) {
      return { success: false, error: "Order not found" }
    }

    // Only allow cancellation for pending or processing orders
    if (!["pending", "processing"].includes(order[0].status)) {
      return { success: false, error: "Cannot cancel order in current status" }
    }

    // Update order status
    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Cancel order error:", error)
    return { success: false, error: "Failed to cancel order" }
  }
}