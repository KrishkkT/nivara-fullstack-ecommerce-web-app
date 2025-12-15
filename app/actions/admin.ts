"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { sendEmail, generateShippingConfirmationEmail, generateOrderCancellationEmail } from "@/lib/email"

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
    console.log(`[v0] Updating order ${orderId} status to ${status}`);
    
    // Get order details before updating
    const orderDetails: any = await sql`
      SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${orderId}
    `

    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `
    
    console.log(`[v0] Order ${orderId} status updated successfully`);

    // Send shipping confirmation email when status is updated to shipped
    if (status === "shipped" && orderDetails.length > 0) {
      const order = orderDetails[0]
      const customer = {
        full_name: order.full_name,
        email: order.customer_email,
        phone: order.customer_phone
      }

      // Get shipping address
      let shippingAddress = null
      if (order.shipping_address_id) {
        const addressResult: any = await sql`
          SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
        `
        if (addressResult.length > 0) {
          shippingAddress = addressResult[0]
        }
      } else if (order.shipping_address) {
        try {
          shippingAddress = JSON.parse(order.shipping_address)
        } catch (e) {
          shippingAddress = {}
        }
      }

      if (shippingAddress) {
        // Send shipping confirmation email to customer
        try {
          console.log(`[v0] Sending shipping confirmation email to ${customer.email}`);
          const emailHtml = generateShippingConfirmationEmail(order, customer, orderItems, shippingAddress, null)
          await sendEmail({
            to: customer.email,
            subject: `Your Order #${order.order_number} Has Been Shipped`,
            html: emailHtml
          })
          console.log(`[v0] Shipping confirmation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send shipping confirmation email to customer:", emailError)
        }
        
        // Send shipping notification to admins
        try {
          // Get active admin emails
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const emailHtml = generateShippingConfirmationEmail(order, customer, orderItems, shippingAddress, null)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Shipped - Admin Notification`,
              html: emailHtml
            })
            console.log(`[v0] Shipping notification email sent successfully to admins`);
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send shipping notification email to admins:", adminEmailError)
        }
      } else {
        console.warn("[v0] No shipping address found for order, skipping shipping confirmation email");
      }
    }

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to update order status:", error);
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
    revalidatePath("/categories")
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
    console.log(`[v0] Cancelling order ${orderId}`);
    
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

    // Get order details for email
    const orderDetails: any = await sql`
      SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${orderId}
    `

    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    // Update order status
    await sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `
    
    console.log(`[v0] Order ${orderId} cancelled successfully`);

    // Send cancellation email to customer
    if (orderDetails.length > 0) {
      const order = orderDetails[0]
      const customer = {
        full_name: order.full_name,
        email: order.customer_email,
        phone: order.customer_phone
      }

      // Get shipping address
      let shippingAddress = null
      if (order.shipping_address_id) {
        const addressResult: any = await sql`
          SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
        `
        if (addressResult.length > 0) {
          shippingAddress = addressResult[0]
        }
      } else if (order.shipping_address) {
        try {
          shippingAddress = JSON.parse(order.shipping_address)
        } catch (e) {
          shippingAddress = {}
        }
      }

      if (shippingAddress) {
        try {
          console.log(`[v0] Sending cancellation email to ${customer.email}`);
          const emailHtml = generateOrderCancellationEmail(order, customer, orderItems, shippingAddress)
          await sendEmail({
            to: customer.email,
            subject: `Order #${order.order_number} Cancelled`,
            html: emailHtml
          })
          console.log(`[v0] Cancellation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send cancellation email:", emailError)
        }
      } else {
        console.warn("[v0] No shipping address found for order, skipping cancellation email");
      }
    }

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Cancel order error:", error)
    return { success: false, error: "Failed to cancel order" }
  }
}"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { sendEmail, generateShippingConfirmationEmail, generateOrderCancellationEmail } from "@/lib/email"

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
    console.log(`[v0] Updating order ${orderId} status to ${status}`);
    
    // Get order details before updating
    const orderDetails: any = await sql`
      SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${orderId}
    `

    const orderItems: any = await sql`
      SELECT * FROM order_items WHERE order_id = ${orderId}
    `

    await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `
    
    console.log(`[v0] Order ${orderId} status updated successfully`);

    // Send shipping confirmation email when status is updated to shipped
    if (status === "shipped" && orderDetails.length > 0) {
      const order = orderDetails[0]
      const customer = {
        full_name: order.full_name,
        email: order.customer_email,
        phone: order.customer_phone
      }

      // Get shipping address
      let shippingAddress = null
      if (order.shipping_address_id) {
        const addressResult: any = await sql`
          SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
        `
        if (addressResult.length > 0) {
          shippingAddress = addressResult[0]
        }
      } else if (order.shipping_address) {
        try {
          shippingAddress = JSON.parse(order.shipping_address)
        } catch (e) {
          shippingAddress = {}
        }
      }

      if (shippingAddress) {
        // Send shipping confirmation email to customer
        try {
          console.log(`[v0] Sending shipping confirmation email to ${customer.email}`);
          const emailHtml = generateShippingConfirmationEmail(order, customer, orderItems, shippingAddress, null)
          await sendEmail({
            to: customer.email,
            subject: `Your Order #${order.order_number} Has Been Shipped`,
            html: emailHtml
          })
          console.log(`[v0] Shipping confirmation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send shipping confirmation email to customer:", emailError)
        }
        
        // Send shipping notification to admins
        try {
          // Get active admin emails
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const emailHtml = generateShippingConfirmationEmail(order, customer, orderItems, shippingAddress, null)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Shipped - Admin Notification`,
              html: emailHtml
            })
            console.log(`[v0] Shipping notification email sent successfully to admins`);
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send shipping notification email to admins:", adminEmailError)
        }
      } else {
        console.warn("[v0] No shipping address found for order, skipping shipping confirmation email");
      }
    }

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to update order status:", error);
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

  try