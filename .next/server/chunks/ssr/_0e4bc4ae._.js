module.exports=[37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},74838,a=>{"use strict";var b=a.i(37936),c=a.i(66879),d=a.i(73478),e=a.i(18558);async function f(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to add items to wishlist"};if((await c.sql`
      SELECT * FROM wishlist
      WHERE user_id = ${b.userId} AND product_id = ${a}
    `).length>0)return{error:"Item already in wishlist"};return await c.sql`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (${b.userId}, ${a})
    `,(0,e.revalidatePath)("/wishlist"),{success:!0}}catch(a){return console.error("[v0] Add to wishlist error:",a),{error:"Failed to add item to wishlist"}}}async function g(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in"};return await c.sql`
      DELETE FROM wishlist
      WHERE user_id = ${b.userId} AND product_id = ${a}
    `,(0,e.revalidatePath)("/wishlist"),{success:!0}}catch(a){return console.error("[v0] Remove from wishlist error:",a),{error:"Failed to remove item"}}}async function h(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in"};let f=await c.sql`
      SELECT product_id FROM cart_items
      WHERE id = ${a} AND user_id = ${b.userId}
    `;if(0===f.length)return{error:"Cart item not found"};let g=f[0].product_id,h=await c.sql`
      SELECT * FROM wishlist
      WHERE user_id = ${b.userId} AND product_id = ${g}
    `;return 0===h.length&&await c.sql`
        INSERT INTO wishlist (user_id, product_id)
        VALUES (${b.userId}, ${g})
      `,await c.sql`
      DELETE FROM cart_items
      WHERE id = ${a} AND user_id = ${b.userId}
    `,(0,e.revalidatePath)("/cart"),(0,e.revalidatePath)("/wishlist"),{success:!0}}catch(a){return console.error("[v0] Move to wishlist error:",a),{error:"Failed to move item to wishlist"}}}async function i(a){try{let b=await (0,d.getSession)();if(!b)return!1;return(await c.sql`
      SELECT 1 FROM wishlist
      WHERE user_id = ${b.userId} AND product_id = ${a}
    `).length>0}catch(a){return console.error("[v0] Check wishlist error:",a),!1}}(0,a.i(13095).ensureServerEntryExports)([f,g,h,i]),(0,b.registerServerReference)(f,"408f14e84e2d921f7b530266bb9076850d808182ad",null),(0,b.registerServerReference)(g,"4038eb4d09ebc23cb5773f940e0512a07e99923015",null),(0,b.registerServerReference)(h,"40933ce6382771838bde69a5e387becc99c34e2150",null),(0,b.registerServerReference)(i,"40083dab82c37eeb0a0fd825fc41793aa11806b167",null),a.s(["addToWishlist",()=>f,"isInWishlist",()=>i,"moveToWishlist",()=>h,"removeFromWishlist",()=>g])},36709,a=>{"use strict";var b=a.i(37936),c=a.i(66879),d=a.i(73478),e=a.i(18558);async function f(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to add items to cart"};return(await c.sql`
      SELECT * FROM cart_items
      WHERE user_id = ${b.userId} AND product_id = ${a}
    `).length>0?await c.sql`
        UPDATE cart_items
        SET quantity = quantity + 1
        WHERE user_id = ${b.userId} AND product_id = ${a}
      `:await c.sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${b.userId}, ${a}, 1)
      `,(0,e.revalidatePath)("/cart"),{success:!0}}catch(a){return console.error("[v0] Add to cart error:",a),{error:"Failed to add item to cart"}}}async function g(a,b){try{let f=await (0,d.getSession)();if(!f)return{error:"Please sign in"};return await c.sql`
      UPDATE cart_items
      SET quantity = ${b}
      WHERE id = ${a} AND user_id = ${f.userId}
    `,(0,e.revalidatePath)("/cart"),{success:!0}}catch(a){return console.error("[v0] Update cart error:",a),{error:"Failed to update cart"}}}async function h(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in"};return await c.sql`
      DELETE FROM cart_items
      WHERE id = ${a} AND user_id = ${b.userId}
    `,(0,e.revalidatePath)("/cart"),{success:!0}}catch(a){return console.error("[v0] Remove from cart error:",a),{error:"Failed to remove item"}}}(0,a.i(13095).ensureServerEntryExports)([f,g,h]),(0,b.registerServerReference)(f,"4000a98622c3bd7838534c238d4593ca798a69456e",null),(0,b.registerServerReference)(g,"60974de0de8fd1da886c1466542bb1d0855a797d4e",null),(0,b.registerServerReference)(h,"4088877ecb15aa4273161f24e95db40cdf9ac2d587",null),a.s(["addToCart",()=>f,"removeFromCart",()=>h,"updateCartQuantity",()=>g])},10433,a=>{"use strict";var b=a.i(36709),c=a.i(74838);a.s([],16104),a.i(16104),a.s(["4000a98622c3bd7838534c238d4593ca798a69456e",()=>b.addToCart,"40083dab82c37eeb0a0fd825fc41793aa11806b167",()=>c.isInWishlist,"4038eb4d09ebc23cb5773f940e0512a07e99923015",()=>c.removeFromWishlist,"408f14e84e2d921f7b530266bb9076850d808182ad",()=>c.addToWishlist],10433)}];

//# sourceMappingURL=_0e4bc4ae._.js.map