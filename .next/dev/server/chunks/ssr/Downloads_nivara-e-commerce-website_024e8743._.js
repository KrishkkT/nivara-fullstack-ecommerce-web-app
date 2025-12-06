module.exports = [
"[project]/Downloads/nivara-e-commerce-website/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/@neondatabase/serverless/index.mjs [app-rsc] (ecmascript)");
;
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
}),
"[project]/Downloads/nivara-e-commerce-website/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "getUserByEmail",
    ()=>getUserByEmail,
    "getUserById",
    ()=>getUserById,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/db.ts [app-rsc] (ecmascript)");
;
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}
async function createUser(email, password, fullName, phone) {
    const passwordHash = await hashPassword(password);
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${phone})
    RETURNING id, email, full_name, phone, role, created_at
  `;
    return result[0];
}
async function getUserByEmail(email) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    SELECT id, email, password_hash, full_name, phone, role, created_at
    FROM users
    WHERE email = ${email}
  `;
    return result[0] || null;
}
async function getUserById(id) {
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`
    SELECT id, email, full_name, phone, role, created_at
    FROM users
    WHERE id = ${id}
  `;
    return result[0] || null;
}
}),
"[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00647d44727184f3fddec827c43bcac5f3b7a84355":"signOut","407c776b9f07a75a4755e0866c94a6032864858f83":"signUp","4089bee5504cd1090530a87ef4270832819bd35844":"signIn"},"",""] */ __turbopack_context__.s([
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/lib/session.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function signUp(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const phone = formData.get("phone");
    // Validation
    if (!email || !password || !fullName) {
        return {
            error: "All fields are required"
        };
    }
    if (password.length < 8) {
        return {
            error: "Password must be at least 8 characters"
        };
    }
    try {
        // Check if user already exists
        const existingUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (existingUser) {
            return {
                error: "Email already registered"
            };
        }
        // Create user
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUser"])(email, password, fullName, phone);
        // Create session
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSession"])({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Sign up error:", error);
        return {
            error: "Failed to create account"
        };
    }
}
async function signIn(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
        return {
            error: "Email and password are required"
        };
    }
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserByEmail"])(email);
        if (!user) {
            return {
                error: "Invalid email or password"
            };
        }
        const isValidPassword = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.password_hash);
        if (!isValidPassword) {
            return {
                error: "Invalid email or password"
            };
        }
        // Create session
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$lib$2f$session$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSession"])({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7
        });
        return {
            success: true
        };
    } catch (error) {
        console.error("[v0] Sign in error:", error);
        return {
            error: "Failed to sign in"
        };
    }
}
async function signOut() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("session");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/");
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUp,
    signIn,
    signOut
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "407c776b9f07a75a4755e0866c94a6032864858f83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signIn, "4089bee5504cd1090530a87ef4270832819bd35844", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "00647d44727184f3fddec827c43bcac5f3b7a84355", null);
}),
"[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4089bee5504cd1090530a87ef4270832819bd35844",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signIn"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f2e$next$2d$internal$2f$server$2f$app$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Downloads/nivara-e-commerce-website/.next-internal/server/app/login/page/actions.js { ACTIONS_MODULE0 => "[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$nivara$2d$e$2d$commerce$2d$website$2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/nivara-e-commerce-website/app/actions/auth.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Downloads_nivara-e-commerce-website_024e8743._.js.map