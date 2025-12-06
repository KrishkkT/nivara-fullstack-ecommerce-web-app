module.exports = [
"[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
const sql = (...args)=>{
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    const sqlInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
    // @ts-ignore
    return sqlInstance(...args);
};
}),
"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"401af00458668821159ce83d20fb6efe1fa1990eeb":"addCategory","4034cce345771ba811005606720b1704d25b7c4836":"deleteProduct","403b9b633e848ed75ec8b22897970b99a1776b66e1":"deleteCategory","4073598483a701b18cb18098ea5c114ef86fb00be6":"addProduct","408867af8e2270ca993b45b4be9e8102689d371ec9":"cancelOrder","601bba83073285f4640e291c92ff5c39392c34bb05":"updateCategory","60302545d25780565e7ee00a0e0b403425e7996969":"updateProduct","60da61b42a603d3f819adb883c51b078e96461ac83":"updateOrderStatus"},"",""] */ __turbopack_context__.s([
    "addCategory",
    ()=>addCategory,
    "addProduct",
    ()=>addProduct,
    "cancelOrder",
    ()=>cancelOrder,
    "deleteCategory",
    ()=>deleteCategory,
    "deleteProduct",
    ()=>deleteProduct,
    "updateCategory",
    ()=>updateCategory,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function updateOrderStatus(orderId, status) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/orders");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update order"
        };
    }
}
async function deleteProduct(productId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM products
      WHERE id = ${productId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete product"
        };
    }
}
async function addProduct(data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [
            data.image_url
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO products (
        name, slug, description, price, category_id, image_url, images, metal_purity, design_number
      )
      VALUES (
        ${data.name}, ${slug}, ${data.description}, ${data.price}, 
        ${data.category_id}, ${data.image_url},
        ${imagesJson}, ${data.metal_purity || null}, ${data.design_number || null}
      )
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to add product"
        };
    }
}
async function updateProduct(productId, data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const imagesJson = JSON.stringify(Array.isArray(data.images) ? data.images : [
            data.image_url
        ]);
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
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
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/products");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/products/${productId}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update product"
        };
    }
}
async function addCategory(data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`;
        const seoDescription = data.seo_description || data.description;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO categories (name, slug, description, image_url, meta_title, meta_description)
      VALUES (${data.name}, ${slug}, ${data.description}, ${data.image_url}, ${seoTitle}, ${seoDescription})
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/categories");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to add category"
        };
    }
}
async function updateCategory(categoryId, data) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const seoTitle = data.seo_title || `${data.name} | NIVARA Jewellery`;
        const seoDescription = data.seo_description || data.description;
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE categories
      SET 
        name = ${data.name},
        slug = ${slug},
        description = ${data.description},
        image_url = ${data.image_url},
        meta_title = ${seoTitle},
        meta_description = ${seoDescription}
      WHERE id = ${categoryId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/categories/${slug}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to update category"
        };
    }
}
async function deleteCategory(categoryId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      DELETE FROM categories
      WHERE id = ${categoryId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/categories");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/shop");
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: "Failed to delete category"
        };
    }
}
async function cancelOrder(orderId) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get("session")?.value;
    if (!token) {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAuth"])(token);
    if (!user || user.role !== "admin") {
        return {
            success: false,
            error: "Unauthorized"
        };
    }
    try {
        // Check if order exists
        const order = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      SELECT * FROM orders WHERE id = ${orderId}
    `;
        if (order.length === 0) {
            return {
                success: false,
                error: "Order not found"
            };
        }
        // Only allow cancellation for pending or processing orders
        if (![
            "pending",
            "processing"
        ].includes(order[0].status)) {
            return {
                success: false,
                error: "Cannot cancel order in current status"
            };
        }
        // Update order status
        await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${orderId}
    `;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/orders");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/orders/${orderId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Cancel order error:", error);
        return {
            success: false,
            error: "Failed to cancel order"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateOrderStatus,
    deleteProduct,
    addProduct,
    updateProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    cancelOrder
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrderStatus, "60da61b42a603d3f819adb883c51b078e96461ac83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteProduct, "4034cce345771ba811005606720b1704d25b7c4836", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addProduct, "4073598483a701b18cb18098ea5c114ef86fb00be6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateProduct, "60302545d25780565e7ee00a0e0b403425e7996969", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCategory, "401af00458668821159ce83d20fb6efe1fa1990eeb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateCategory, "601bba83073285f4640e291c92ff5c39392c34bb05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCategory, "403b9b633e848ed75ec8b22897970b99a1776b66e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelOrder, "408867af8e2270ca993b45b4be9e8102689d371ec9", null);
}),
"[project]/Downloads/nivarasilverjewels/.next-internal/server/app/admin/categories/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/Downloads/nivarasilverjewels/.next-internal/server/app/admin/categories/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "401af00458668821159ce83d20fb6efe1fa1990eeb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCategory"],
    "403b9b633e848ed75ec8b22897970b99a1776b66e1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCategory"],
    "601bba83073285f4640e291c92ff5c39392c34bb05",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategory"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$categories$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/nivarasilverjewels/.next-internal/server/app/admin/categories/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivarasilverjewels$2f$app$2f$actions$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivarasilverjewels/app/actions/admin.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Downloads_nivarasilverjewels_9dbb9c83._.js.map