"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { verifyAuth } from "@/lib/session"
import { sql } from "@/lib/db"
import { sendEmail, generateShippingConfirmationEmail, generateCancellationConfirmationEmail, generateAdminShippingNotificationEmail, generateAdminCancellationNotificationEmail } from "@/lib/email"

// Update order status (admin)
export async function updateOrderStatus(orderId: number, status: string) {
  "use server"

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
    // Get order details
    const orderResult: any = await sql`
      SELECT * FROM orders WHERE id = ${orderId}
    `
    
    if (orderResult.length === 0) {
      return { success: false, error: "Order not found" }
    }
    
    const order = orderResult[0]
    
    // Update order status
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${orderId}
    `
    
    // If status is shipped, send email notification to customer
    if (status === 'shipped') {
      try {
        // Get customer details
        const customerResult: any = await sql`
          SELECT * FROM users WHERE id = ${order.user_id}
        `
        
        const customer = customerResult[0]
        
        // Get order items
        const itemsResult: any = await sql`
          SELECT oi.*, p.name as product_name, p.image_url
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ${orderId}
        `
        
        const items = itemsResult
        
        // Get shipping address
        const shippingAddress = order.shipping_address
        
        // Send shipping confirmation email to customer
        const emailHtml = generateShippingConfirmationEmail(order, customer, items, shippingAddress)
        await sendEmail({
          to: customer.email,
          subject: `Your Order #${order.order_number} Has Been Shipped!`,
          html: emailHtml
        })
        
        // Send notification to admins
        try {
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const adminEmailHtml = generateAdminShippingNotificationEmail(order, customer, items)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Marked as Shipped`,
              html: adminEmailHtml
            })
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send admin shipping notification:", adminEmailError)
        }
      } catch (emailError) {
        console.error("[v0] Failed to send shipping confirmation email:", emailError)
        // Don't return error here as the status update was successful
      }
    }
    
    // If status is cancelled, send email notification to customer
    if (status === 'cancelled') {
      try {
        // Get customer details
        const customerResult: any = await sql`
          SELECT * FROM users WHERE id = ${order.user_id}
        `
        
        const customer = customerResult[0]
        
        // Get order items
        const itemsResult: any = await sql`
          SELECT oi.*, p.name as product_name
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ${orderId}
        `
        
        const items = itemsResult
        
        // Send cancellation confirmation email to customer
        const emailHtml = generateCancellationConfirmationEmail(order, customer, items)
        await sendEmail({
          to: customer.email,
          subject: `Your Order #${order.order_number} Has Been Cancelled`,
          html: emailHtml
        })
        
        // Send notification to admins
        try {
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const adminEmailHtml = generateAdminCancellationNotificationEmail(order, customer, items)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Cancelled by Admin`,
              html: adminEmailHtml
            })
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send admin cancellation notification:", adminEmailError)
        }
      } catch (emailError) {
        console.error("[v0] Failed to send cancellation confirmation email:", emailError)
        // Don't return error here as the status update was successful
      }
    }
    
    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    console.error("[v0] Update order status error:", error)
    return { success: false, error: "Failed to update order status" }
  }
}

// Cancel order (admin)
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
    console.log(`[v0] Admin attempting to cancel order ${orderId}`);
    
    // Check if order exists
    const order: any = await sql`
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
    
    console.log(`[v0] Order ${orderId} cancelled successfully by admin`);

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
        // Send cancellation email to customer
        try {
          console.log(`[v0] Sending cancellation email to ${customer.email}`);
          const emailHtml = generateCancellationConfirmationEmail(order, customer, orderItems)
          await sendEmail({
            to: customer.email,
            subject: `Order #${order.order_number} Cancelled by Admin`,
            html: emailHtml
          })
          console.log(`[v0] Cancellation email sent successfully to ${customer.email}`);
        } catch (emailError) {
          console.error("[v0] Failed to send cancellation email to customer:", emailError)
        }
        
        // Send cancellation notification to admins
        try {
          // Get active admin emails
          const adminEmailsResult: any = await sql`
            SELECT email FROM admin_emails WHERE is_active = true
          `
          
          const adminEmails = adminEmailsResult.map((row: any) => row.email)
          
          if (adminEmails.length > 0) {
            const emailHtml = generateAdminCancellationNotificationEmail(order, customer, orderItems)
            await sendEmail({
              to: adminEmails,
              subject: `Order #${order.order_number} Cancelled by Admin - Admin Notification`,
              html: emailHtml
            })
            console.log(`[v0] Cancellation notification email sent successfully to admins`);
          }
        } catch (adminEmailError) {
          console.error("[v0] Failed to send cancellation notification email to admins:", adminEmailError)
        }
      } else {
        console.warn("[v0] No shipping address found for order, skipping cancellation email");
      }
    }

    revalidatePath("/admin/orders")
    revalidatePath("/orders")

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to cancel order:", error);
    return { success: false, error: "Failed to cancel order" }
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
    const result: any = await sql`
      INSERT INTO products (
        name, 
        slug, 
        description, 
        price, 
        compare_at_price, 
        category_id, 
        image_url, 
        images, 
        metal_purity, 
        design_number, 
        is_featured, 
        is_active
      )
      VALUES (
        ${data.name},
        ${data.slug},
        ${data.description},
        ${data.price},
        ${data.compareAtPrice},
        ${data.categoryId},
        ${data.imageUrl},
        ${JSON.stringify(data.images)},
        ${data.metalPurity},
        ${data.designNumber},
        ${data.isFeatured},
        ${data.isActive}
      )
      RETURNING id
    `

    const productId = result[0].id

    revalidatePath("/admin/products")
    revalidatePath("/shop")
    return { success: true, productId }
  } catch (error) {
    console.error("[v0] Add product error:", error)
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
    // Generate slug if not provided
    let slug = data.slug;
    if (!slug && data.name) {
      slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    await sql`
      UPDATE products
      SET 
        name = ${data.name},
        slug = ${slug},
        description = ${data.description},
        price = ${data.price},
        compare_at_price = ${data.compareAtPrice},
        category_id = ${data.categoryId},
        image_url = ${data.imageUrl},
        images = ${JSON.stringify(data.images)},
        metal_purity = ${data.metalPurity},
        design_number = ${data.designNumber},
        is_featured = ${data.isFeatured},
        is_active = ${data.isActive},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${productId}
    `

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${productId}`)
    revalidatePath("/shop")
    revalidatePath(`/products/${slug}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Update product error:", error)
    return { success: false, error: "Failed to update product" }
  }
}

export async function addCategory(data: any) {
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
    // Generate slug if not provided
    let slug = data.slug;
    if (!slug) {
      slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    const result: any = await sql`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES (${data.name}, ${slug}, ${data.description}, ${data.imageUrl})
      RETURNING id
    `

    const categoryId = result[0].id

    revalidatePath("/admin/categories")
    revalidatePath("/shop")
    return { success: true, categoryId }
  } catch (error) {
    console.error("[v0] Add category error:", error)
    return { success: false, error: "Failed to add category" }
  }
}

export async function updateCategory(categoryId: number, data: any) {
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
    // Generate slug if not provided
    let slug = data.slug;
    if (!slug && data.name) {
      slug = data.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    await sql`
      UPDATE categories
      SET 
        name = ${data.name},
        slug = ${slug},
        description = ${data.description},
        image_url = ${data.imageUrl}
      WHERE id = ${categoryId}
    `

    revalidatePath("/admin/categories")
    revalidatePath(`/admin/categories/${categoryId}`)
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    console.error("[v0] Update category error:", error)
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
    // Check if any products are associated with this category
    const productCountResult: any = await sql`
      SELECT COUNT(*) as count FROM products WHERE category_id = ${categoryId}
    `
    
    const productCount = parseInt(productCountResult[0].count)
    
    if (productCount > 0) {
      return { success: false, error: `Cannot delete category with ${productCount} associated products` }
    }

    await sql`
      DELETE FROM categories
      WHERE id = ${categoryId}
    `

    revalidatePath("/admin/categories")
    revalidatePath("/shop")
    return { success: true }
  } catch (error) {
    console.error("[v0] Delete category error:", error)
    return { success: false, error: "Failed to delete category" }
  }
}