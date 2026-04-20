"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"

// Add to cart action
export async function addToCart(productId: number, quantity: number = 1) {
  "use server"

  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { error: "Please sign in to add items to cart" }
  }

  const user = await verifyAuth(token)
  if (!user) {
    return { error: "Please sign in to add items to cart" }
  }

  try {
    // Check if product exists and is not sold out
    const productResult: any = await sql`
      SELECT id, name, is_sold_out 
      FROM products 
      WHERE id = ${productId} AND is_active = true
    `

    if (productResult.length === 0) {
      return { error: "Product not found or inactive" }
    }

    const product = productResult[0]

    // Check if product is sold out
    if (product.is_sold_out) {
      return { error: "This product is currently sold out" }
    }

    // Check if item already exists in cart
    const existingCartItem: any = await sql`
      SELECT id, quantity 
      FROM cart_items 
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `

    if (existingCartItem.length > 0) {
      // Update quantity if item already exists
      await sql`
        UPDATE cart_items 
        SET quantity = ${existingCartItem[0].quantity + quantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingCartItem[0].id}
      `
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${user.id}, ${productId}, ${quantity})
      `
    }

    revalidatePath("/cart")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    console.error("[v0] Add to cart error:", error)
    return { error: "Failed to add item to cart" }
  }
}

// Remove from cart action
export async function removeFromCart(cartItemId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user) {
    return { error: "Unauthorized" }
  }

  try {
    await sql`
      DELETE FROM cart_items 
      WHERE id = ${cartItemId} AND user_id = ${user.id}
    `

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("[v0] Remove from cart error:", error)
    return { error: "Failed to remove item from cart" }
  }
}

// Update cart quantity action
export async function updateCartQuantity(cartItemId: number, quantity: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { error: "Unauthorized" }
  }

  const user = await verifyAuth(token)
  if (!user) {
    return { error: "Unauthorized" }
  }

  try {
    if (quantity < 1) {
      await sql`
        DELETE FROM cart_items 
        WHERE id = ${cartItemId} AND user_id = ${user.id}
      `
    } else {
      await sql`
        UPDATE cart_items 
        SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${cartItemId} AND user_id = ${user.id}
      `
    }

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("[v0] Update cart quantity error:", error)
    return { error: "Failed to update cart quantity" }
  }
}