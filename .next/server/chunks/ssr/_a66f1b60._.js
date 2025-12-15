module.exports=[20916,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ReadonlyURLSearchParams",{enumerable:!0,get:function(){return e}});class d extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class e extends URLSearchParams{append(){throw new d}delete(){throw new d}set(){throw new d}sort(){throw new d}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},21170,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"RedirectStatusCode",{enumerable:!0,get:function(){return e}});var d,e=((d={})[d.SeeOther=303]="SeeOther",d[d.TemporaryRedirect=307]="TemporaryRedirect",d[d.PermanentRedirect=308]="PermanentRedirect",d);("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},28859,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d,e={REDIRECT_ERROR_CODE:function(){return h},RedirectType:function(){return i},isRedirectError:function(){return j}};for(var f in e)Object.defineProperty(c,f,{enumerable:!0,get:e[f]});let g=a.r(21170),h="NEXT_REDIRECT";var i=((d={}).push="push",d.replace="replace",d);function j(a){if("object"!=typeof a||null===a||!("digest"in a)||"string"!=typeof a.digest)return!1;let b=a.digest.split(";"),[c,d]=b,e=b.slice(2,-2).join(";"),f=Number(b.at(-2));return c===h&&("replace"===d||"push"===d)&&"string"==typeof e&&!isNaN(f)&&f in g.RedirectStatusCode}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},44868,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={getRedirectError:function(){return i},getRedirectStatusCodeFromError:function(){return n},getRedirectTypeFromError:function(){return m},getURLFromRedirectError:function(){return l},permanentRedirect:function(){return k},redirect:function(){return j}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(21170),g=a.r(28859),h=a.r(20635).actionAsyncStorage;function i(a,b,c=f.RedirectStatusCode.TemporaryRedirect){let d=Object.defineProperty(Error(g.REDIRECT_ERROR_CODE),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});return d.digest=`${g.REDIRECT_ERROR_CODE};${b};${a};${c};`,d}function j(a,b){throw i(a,b??=h?.getStore()?.isAction?g.RedirectType.push:g.RedirectType.replace,f.RedirectStatusCode.TemporaryRedirect)}function k(a,b=g.RedirectType.replace){throw i(a,b,f.RedirectStatusCode.PermanentRedirect)}function l(a){return(0,g.isRedirectError)(a)?a.digest.split(";").slice(2,-2).join(";"):null}function m(a){if(!(0,g.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return a.digest.split(";",2)[1]}function n(a){if(!(0,g.isRedirectError)(a))throw Object.defineProperty(Error("Not a redirect error"),"__NEXT_ERROR_CODE",{value:"E260",enumerable:!1,configurable:!0});return Number(a.digest.split(";").at(-2))}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},89798,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={HTTPAccessErrorStatus:function(){return f},HTTP_ERROR_FALLBACK_ERROR_CODE:function(){return h},getAccessFallbackErrorTypeByStatus:function(){return k},getAccessFallbackHTTPStatus:function(){return j},isHTTPAccessFallbackError:function(){return i}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f={NOT_FOUND:404,FORBIDDEN:403,UNAUTHORIZED:401},g=new Set(Object.values(f)),h="NEXT_HTTP_ERROR_FALLBACK";function i(a){if("object"!=typeof a||null===a||!("digest"in a)||"string"!=typeof a.digest)return!1;let[b,c]=a.digest.split(";");return b===h&&g.has(Number(c))}function j(a){return Number(a.digest.split(";")[1])}function k(a){switch(a){case 401:return"unauthorized";case 403:return"forbidden";case 404:return"not-found";default:return}}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},16155,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"notFound",{enumerable:!0,get:function(){return f}});let d=a.r(89798),e=`${d.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;function f(){let a=Object.defineProperty(Error(e),"__NEXT_ERROR_CODE",{value:"E394",enumerable:!1,configurable:!0});throw a.digest=e,a}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},34557,(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E488",enumerable:!1,configurable:!0})}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"forbidden",{enumerable:!0,get:function(){return d}}),a.r(89798).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},93845,(a,b,c)=>{"use strict";function d(){throw Object.defineProperty(Error("`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled."),"__NEXT_ERROR_CODE",{value:"E411",enumerable:!1,configurable:!0})}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unauthorized",{enumerable:!0,get:function(){return d}}),a.r(89798).HTTP_ERROR_FALLBACK_ERROR_CODE,("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},73808,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"isPostpone",{enumerable:!0,get:function(){return e}});let d=Symbol.for("react.postpone");function e(a){return"object"==typeof a&&null!==a&&a.$$typeof===d}},1567,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"isNextRouterError",{enumerable:!0,get:function(){return f}});let d=a.r(89798),e=a.r(28859);function f(a){return(0,e.isRedirectError)(a)||(0,d.isHTTPAccessFallbackError)(a)}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},94783,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unstable_rethrow",{enumerable:!0,get:function(){return function a(b){if((0,g.isNextRouterError)(b)||(0,f.isBailoutToCSRError)(b)||(0,i.isDynamicServerError)(b)||(0,h.isDynamicPostpone)(b)||(0,e.isPostpone)(b)||(0,d.isHangingPromiseRejectionError)(b)||(0,h.isPrerenderInterruptedError)(b))throw b;b instanceof Error&&"cause"in b&&a(b.cause)}}});let d=a.r(13091),e=a.r(73808),f=a.r(49640),g=a.r(1567),h=a.r(60384),i=a.r(96556);("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},60968,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"unstable_rethrow",{enumerable:!0,get:function(){return d}});let d=a.r(94783).unstable_rethrow;("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},73727,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});var d={ReadonlyURLSearchParams:function(){return f.ReadonlyURLSearchParams},RedirectType:function(){return h.RedirectType},forbidden:function(){return j.forbidden},notFound:function(){return i.notFound},permanentRedirect:function(){return g.permanentRedirect},redirect:function(){return g.redirect},unauthorized:function(){return k.unauthorized},unstable_isUnrecognizedActionError:function(){return m},unstable_rethrow:function(){return l.unstable_rethrow}};for(var e in d)Object.defineProperty(c,e,{enumerable:!0,get:d[e]});let f=a.r(20916),g=a.r(44868),h=a.r(28859),i=a.r(16155),j=a.r(34557),k=a.r(93845),l=a.r(60968);function m(){throw Object.defineProperty(Error("`unstable_isUnrecognizedActionError` can only be used on the client."),"__NEXT_ERROR_CODE",{value:"E776",enumerable:!1,configurable:!0})}("function"==typeof c.default||"object"==typeof c.default&&null!==c.default)&&void 0===c.default.__esModule&&(Object.defineProperty(c.default,"__esModule",{value:!0}),Object.assign(c.default,c),b.exports=c.default)},70396,a=>{"use strict";a.i(73727),a.s([])},77728,a=>{"use strict";var b=a.i(37936),c=a.i(5246),d=a.i(66879);async function e(a){let b=new TextEncoder().encode(a);return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",b))).map(a=>a.toString(16).padStart(2,"0")).join("")}async function f(a,b){return await e(a)===b}async function g(a,b,c,f){let g=await e(b);return(await d.sql`
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES (${a}, ${g}, ${c}, ${f})
    RETURNING id, email, full_name, phone, role, created_at
  `)[0]}async function h(a){return(await d.sql`
    SELECT id, email, password_hash, full_name, phone, role, created_at
    FROM users
    WHERE email = ${a}
  `)[0]||null}var i=a.i(73478);a.i(70396);var j=a.i(73727),k=a.i(6731);async function l(a){let b=a.get("email"),d=a.get("password"),e=a.get("fullName"),f=a.get("phone");if(!b||!d||!e)return{error:"All fields are required"};if(d.length<8)return{error:"Password must be at least 8 characters"};try{if(await h(b))return{error:"Email already registered"};let a=await g(b,d,e,f);try{let a=(0,k.generateWelcomeEmail)({full_name:e,email:b});await (0,k.sendEmail)({to:b,subject:`Welcome to NIVARA, ${e}!`,html:a})}catch(a){console.error("[v0] Failed to send welcome email:",a)}let j=await (0,i.createSession)({userId:a.id,email:a.email,role:a.role});return(await (0,c.cookies)()).set("session",j,{httpOnly:!0,secure:!0,sameSite:"lax",maxAge:604800}),{success:!0}}catch(a){return console.error("[v0] Sign up error:",a),{error:"Failed to create account"}}}async function m(a){let b=a.get("email"),d=a.get("password");if(!b||!d)return{error:"Email and password are required"};try{let a=await h(b);if(!a||!await f(d,a.password_hash))return{error:"Invalid email or password"};let e=await (0,i.createSession)({userId:a.id,email:a.email,role:a.role});return(await (0,c.cookies)()).set("session",e,{httpOnly:!0,secure:!0,sameSite:"lax",maxAge:604800}),{success:!0}}catch(a){return console.error("[v0] Sign in error:",a),{error:"Failed to sign in"}}}async function n(){(await (0,c.cookies)()).delete("session"),(0,j.redirect)("/")}(0,a.i(13095).ensureServerEntryExports)([l,m,n]),(0,b.registerServerReference)(l,"404fa6d56cb475768172a71cf77c29fae1b2d0dd5d",null),(0,b.registerServerReference)(m,"40a8f14b4cf5954a89f2d1493008c224f51fe37c1f",null),(0,b.registerServerReference)(n,"00ea135415424fe593d7ab8d104e99d0d977d8fb51",null),a.s(["signIn",()=>m,"signOut",()=>n,"signUp",()=>l],77728)},70479,a=>{"use strict";var b=a.i(37936),c=a.i(66879),d=a.i(73478),e=a.i(18558),f=a.i(6731);async function g(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to place an order"};let f=`NIVARA-${Date.now()}`,g=(await c.sql`
      INSERT INTO orders (
        user_id, 
        order_number, 
        total_amount, 
        status, 
        payment_status,
        payment_type,
        shipping_address,
        shipping_address_id
      )
      VALUES (
        ${b.userId},
        ${f},
        ${a.totalAmount},
        'pending',
        'awaiting_payment',
        ${a.paymentMethod},
        ${a.shippingAddressId?null:JSON.stringify(a.shippingAddress)},
        ${a.shippingAddressId||null}
      )
      RETURNING id
    `)[0].id;for(let b of a.items){let a=await c.sql`
        SELECT name, price FROM products WHERE id = ${b.productId}
      `;await c.sql`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
        VALUES (${g}, ${b.productId}, ${a[0].name}, ${b.price}, ${b.quantity})
      `}await c.sql`
      DELETE FROM cart_items WHERE user_id = ${b.userId}
    `,(0,e.revalidatePath)("/cart"),(0,e.revalidatePath)("/orders"),(0,e.revalidatePath)("/api/cart/count");try{if(!a.shippingAddressId&&a.shippingAddress){let d=await c.sql`
          SELECT id FROM addresses 
          WHERE user_id = ${b.userId}
          AND address_line1 = ${a.shippingAddress.address_line1}
          AND city = ${a.shippingAddress.city}
          AND state = ${a.shippingAddress.state}
          AND postal_code = ${a.shippingAddress.postal_code}
        `;if(0===d.length)await c.sql`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${b.userId}
          `,await c.sql`
            INSERT INTO addresses (
              user_id, 
              address_line1, 
              address_line2, 
              city, 
              state, 
              postal_code, 
              country, 
              is_default
            )
            VALUES (
              ${b.userId},
              ${a.shippingAddress.address_line1},
              ${a.shippingAddress.address_line2||""},
              ${a.shippingAddress.city},
              ${a.shippingAddress.state},
              ${a.shippingAddress.postal_code},
              ${a.shippingAddress.country||"India"},
              true
            )
          `;else{let a=d[0].id;await c.sql`
            UPDATE addresses 
            SET is_default = false 
            WHERE user_id = ${b.userId}
          `,await c.sql`
            UPDATE addresses 
            SET is_default = true 
            WHERE id = ${a}
          `}}else a.shippingAddressId&&(await c.sql`
          UPDATE addresses 
          SET is_default = false 
          WHERE user_id = ${b.userId}
        `,await c.sql`
          UPDATE addresses 
          SET is_default = true 
          WHERE id = ${a.shippingAddressId}
        `)}catch(a){console.error("[v0] Failed to save default address:",a)}return{success:!0,orderId:g,orderNumber:f}}catch(a){return{error:"Failed to create order"}}}async function h(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to cancel order"};let g=await c.sql`
      SELECT * FROM orders WHERE id = ${a} AND user_id = ${b.userId}
    `;if(0===g.length)return{error:"Order not found"};if(!["pending","processing"].includes(g[0].status))return{error:"Cannot cancel order in current status"};let h=await c.sql`
      SELECT o.*, u.full_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ${a} AND o.user_id = ${b.userId}
    `,i=await c.sql`
      SELECT * FROM order_items WHERE order_id = ${a}
    `;if(await c.sql`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = ${a}
    `,h.length>0){let a=h[0],b={full_name:a.full_name,email:a.customer_email,phone:a.customer_phone},d=null;if(a.shipping_address_id){let b=await c.sql`
          SELECT * FROM addresses WHERE id = ${a.shipping_address_id}
        `;b.length>0&&(d=b[0])}else if(a.shipping_address)try{d=JSON.parse(a.shipping_address)}catch(a){d={}}if(d)try{let c=(0,f.generateOrderCancellationEmail)(a,b,i,d);await (0,f.sendEmail)({to:b.email,subject:`Order #${a.order_number} Cancelled`,html:c})}catch(a){console.error("[v0] Failed to send cancellation email:",a)}}return(0,e.revalidatePath)("/account"),(0,e.revalidatePath)("/orders"),(0,e.revalidatePath)(`/orders/${a}`),{success:!0}}catch(a){return console.error("[v0] Failed to cancel order:",a),{error:"Failed to cancel order"}}}(0,a.i(13095).ensureServerEntryExports)([g,h]),(0,b.registerServerReference)(g,"4092236c67afa3346a320374b8c3df1fa7187b9005",null),(0,b.registerServerReference)(h,"4068bf0181f24a199e2d852075c25992cf1639aea9",null),a.s(["cancelOrder",()=>h,"createOrder",()=>g])},21206,a=>{"use strict";var b=a.i(77728),c=a.i(70479),d=a.i(20006);a.s([],33355),a.i(33355),a.s(["00ea135415424fe593d7ab8d104e99d0d977d8fb51",()=>b.signOut,"401afdf693e644ce4f0761bfd0af817d46732dc380",()=>d.cancelOrder,"404fa6d56cb475768172a71cf77c29fae1b2d0dd5d",()=>b.signUp,"4068bf0181f24a199e2d852075c25992cf1639aea9",()=>c.cancelOrder,"40a8f14b4cf5954a89f2d1493008c224f51fe37c1f",()=>b.signIn],21206)}];

//# sourceMappingURL=_a66f1b60._.js.map