"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function addToWishlist(productId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in to add items to wishlist" }
    }

    // Check if already in wishlist
    const existing = await sql`
      SELECT * FROM wishlist
      WHERE user_id = ${session.userId} AND product_id = ${productId}
    `

    if (existing.length > 0) {
      return { error: "Item already in wishlist" }
    }

    await sql`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (${session.userId}, ${productId})
    `

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[v0] Add to wishlist error:", error)
    return { error: "Failed to add item to wishlist" }
  }
}

export async function removeFromWishlist(productId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in" }
    }

    await sql`
      DELETE FROM wishlist
      WHERE user_id = ${session.userId} AND product_id = ${productId}
    `

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[v0] Remove from wishlist error:", error)
    return { error: "Failed to remove item" }
  }
}

export async function moveToWishlist(cartItemId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in" }
    }

    // Get the cart item
    const cartItem = await sql`
      SELECT product_id FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
    `

    if (cartItem.length === 0) {
      return { error: "Cart item not found" }
    }

    const productId = cartItem[0].product_id

    // Check if already in wishlist
    const existing = await sql`
      SELECT * FROM wishlist
      WHERE user_id = ${session.userId} AND product_id = ${productId}
    `

    if (existing.length === 0) {
      // Add to wishlist
      await sql`
        INSERT INTO wishlist (user_id, product_id)
        VALUES (${session.userId}, ${productId})
      `
    }

    // Remove from cart
    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
    `

    revalidatePath("/cart")
    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[v0] Move to wishlist error:", error)
    return { error: "Failed to move item to wishlist" }
  }
}

export async function isInWishlist(productId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return false
    }

    const result = await sql`
      SELECT 1 FROM wishlist
      WHERE user_id = ${session.userId} AND product_id = ${productId}
    `

    return result.length > 0
  } catch (error) {
    console.error("[v0] Check wishlist error:", error)
    return false
  }
}
