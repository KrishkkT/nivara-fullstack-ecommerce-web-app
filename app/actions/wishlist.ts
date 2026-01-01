"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"

// Add to wishlist action
export async function addToWishlist(productId: number) {
  "use server"

  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { error: "Please sign in to manage your wishlist" }
  }

  const user = await verifyAuth(token)
  if (!user) {
    return { error: "Please sign in to manage your wishlist" }
  }

  try {
    // Check if product exists
    const productResult: any = await sql`
      SELECT id, name 
      FROM products 
      WHERE id = ${productId} AND is_active = true
    `

    if (productResult.length === 0) {
      return { error: "Product not found or inactive" }
    }

    // Check if item already exists in wishlist
    const existingWishlistItem: any = await sql`
      SELECT id 
      FROM wishlist 
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `

    if (existingWishlistItem.length > 0) {
      return { error: "Product is already in your wishlist" }
    }

    // Add item to wishlist
    await sql`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (${user.id}, ${productId})
    `

    revalidatePath("/wishlist")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    console.error("[v0] Add to wishlist error:", error)
    return { error: "Failed to add item to wishlist" }
  }
}

// Remove from wishlist action
export async function removeFromWishlist(productId: number) {
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
      DELETE FROM wishlist 
      WHERE product_id = ${productId} AND user_id = ${user.id}
    `

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[v0] Remove from wishlist error:", error)
    return { error: "Failed to remove item from wishlist" }
  }
}

// Check if product is in wishlist
export async function isInWishlist(productId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return false
  }

  const user = await verifyAuth(token)
  if (!user) {
    return false
  }

  try {
    const result: any = await sql`
      SELECT id 
      FROM wishlist 
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `

    return result.length > 0
  } catch (error) {
    console.error("[v0] Check wishlist error:", error)
    return false
  }
}

// Move to wishlist from cart
export async function moveToWishlist(cartItemId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return { error: "Please sign in to manage your wishlist" }
  }

  const user = await verifyAuth(token)
  if (!user) {
    return { error: "Please sign in to manage your wishlist" }
  }

  try {
    // Get the product ID from the cart item
    const cartItemResult: any = await sql`
      SELECT product_id
      FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${user.id}
    `

    if (cartItemResult.length === 0) {
      return { error: "Cart item not found" }
    }

    const productId = cartItemResult[0].product_id

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
      return { error: "This product is currently sold out and cannot be added to wishlist" }
    }

    // Check if item already exists in wishlist
    const existingWishlistItem: any = await sql`
      SELECT id 
      FROM wishlist 
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `

    if (existingWishlistItem.length > 0) {
      return { error: "Product is already in your wishlist" }
    }

    // Add item to wishlist
    await sql`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (${user.id}, ${productId})
    `

    // Remove item from cart
    await sql`
      DELETE FROM cart_items 
      WHERE id = ${cartItemId} AND user_id = ${user.id}
    `

    revalidatePath("/wishlist")
    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("[v0] Move to wishlist error:", error)
    return { error: "Failed to move item to wishlist" }
  }
}
