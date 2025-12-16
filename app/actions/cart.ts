"use server"

import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function addToCart(productId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in to add items to cart" }
    }

    console.log(`[v0] Adding product ${productId} to cart for user ${session.userId}`);

    // Check if item already in cart
    const existing = await sql`
      SELECT * FROM cart_items
      WHERE user_id = ${session.userId} AND product_id = ${productId}
    `

    console.log(`[v0] Existing cart items for user ${session.userId} and product ${productId}:`, existing.length);

    if (existing.length > 0) {
      // Update quantity
      console.log(`[v0] Updating quantity for existing cart item`);
      await sql`
        UPDATE cart_items
        SET quantity = quantity + 1
        WHERE user_id = ${session.userId} AND product_id = ${productId}
      `
    } else {
      // Insert new item
      console.log(`[v0] Inserting new cart item`);
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${session.userId}, ${productId}, 1)
      `
    }

    console.log(`[v0] Revalidating cart page cache`);
    revalidatePath("/cart")
    console.log(`[v0] Successfully added product to cart`);
    return { success: true }
  } catch (error) {
    console.error("[v0] Add to cart error:", error)
    return { error: "Failed to add item to cart" }
  }
}

export async function updateCartQuantity(cartItemId: number, quantity: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in" }
    }

    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
    `

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("[v0] Update cart error:", error)
    return { error: "Failed to update cart" }
  }
}

export async function removeFromCart(cartItemId: number) {
  try {
    const session = await getSession()

    if (!session) {
      return { error: "Please sign in" }
    }

    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${session.userId}
    `

    revalidatePath("/cart")
    return { success: true }
  } catch (error) {
    console.error("[v0] Remove from cart error:", error)
    return { error: "Failed to remove item" }
  }
}