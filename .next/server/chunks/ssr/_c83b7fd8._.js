module.exports=[70479,a=>{"use strict";var b=a.i(37936),c=a.i(66879),d=a.i(73478),e=a.i(18558),f=a.i(6731);async function g(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to place an order"};let f=`NIVARA-${Date.now()}`,g=(await c.sql`
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
        `;b.length>0&&(d=b[0])}else if(a.shipping_address)try{d=JSON.parse(a.shipping_address)}catch(a){d={}}if(d)try{let c=(0,f.generateOrderCancellationEmail)(a,b,i,d);await (0,f.sendEmail)({to:b.email,subject:`Order #${a.order_number} Cancelled`,html:c})}catch(a){console.error("[v0] Failed to send cancellation email:",a)}}return(0,e.revalidatePath)("/account"),(0,e.revalidatePath)("/orders"),(0,e.revalidatePath)(`/orders/${a}`),{success:!0}}catch(a){return console.error("[v0] Failed to cancel order:",a),{error:"Failed to cancel order"}}}(0,a.i(13095).ensureServerEntryExports)([g,h]),(0,b.registerServerReference)(g,"4092236c67afa3346a320374b8c3df1fa7187b9005",null),(0,b.registerServerReference)(h,"4068bf0181f24a199e2d852075c25992cf1639aea9",null),a.s(["cancelOrder",()=>h,"createOrder",()=>g])},11979,a=>{"use strict";var b=a.i(70479),c=a.i(20006);a.s([],96443),a.i(96443),a.s(["401afdf693e644ce4f0761bfd0af817d46732dc380",()=>c.cancelOrder,"4068bf0181f24a199e2d852075c25992cf1639aea9",()=>b.cancelOrder,"607aa12dcca34b8ecb9ba93bf72eca644316457d40",()=>c.updateOrderStatus],11979)}];

//# sourceMappingURL=_c83b7fd8._.js.map