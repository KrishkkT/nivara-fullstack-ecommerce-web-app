module.exports=[37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},27699,(a,b,c)=>{b.exports=a.x("events",()=>require("events"))},92509,(a,b,c)=>{b.exports=a.x("url",()=>require("url"))},22734,(a,b,c)=>{b.exports=a.x("fs",()=>require("fs"))},21517,(a,b,c)=>{b.exports=a.x("http",()=>require("http"))},24836,(a,b,c)=>{b.exports=a.x("https",()=>require("https"))},6461,(a,b,c)=>{b.exports=a.x("zlib",()=>require("zlib"))},88947,(a,b,c)=>{b.exports=a.x("stream",()=>require("stream"))},63818,a=>{a.v({name:"nodemailer",version:"7.0.11",description:"Easy as cake e-mail sending from your Node.js applications",main:"lib/nodemailer.js",scripts:{test:"node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js","test:coverage":"c8 node --test --test-concurrency=1 test/**/*.test.js test/**/*-test.js",format:'prettier --write "**/*.{js,json,md}"',"format:check":'prettier --check "**/*.{js,json,md}"',lint:"eslint .","lint:fix":"eslint . --fix",update:"rm -rf node_modules/ package-lock.json && ncu -u && npm install"},repository:{type:"git",url:"https://github.com/nodemailer/nodemailer.git"},keywords:["Nodemailer"],author:"Andris Reinman",license:"MIT-0",bugs:{url:"https://github.com/nodemailer/nodemailer/issues"},homepage:"https://nodemailer.com/",devDependencies:{"@aws-sdk/client-sesv2":"3.940.0",bunyan:"1.8.15",c8:"10.1.3",eslint:"9.39.1","eslint-config-prettier":"10.1.8",globals:"16.5.0",libbase64:"1.3.0",libmime:"5.3.7",libqp:"2.1.1","nodemailer-ntlm-auth":"1.0.4",prettier:"3.6.2",proxy:"1.0.2","proxy-test-server":"1.0.0","smtp-server":"3.16.1"},engines:{node:">=6.0.0"}})},4446,(a,b,c)=>{b.exports=a.x("net",()=>require("net"))},79594,(a,b,c)=>{b.exports=a.x("dns",()=>require("dns"))},46786,(a,b,c)=>{b.exports=a.x("os",()=>require("os"))},55004,(a,b,c)=>{b.exports=a.x("tls",()=>require("tls"))},55381,a=>{a.v(JSON.parse('{"1und1":{"description":"1&1 Mail (German hosting provider)","host":"smtp.1und1.de","port":465,"secure":true,"authMethod":"LOGIN"},"126":{"description":"126 Mail (NetEase)","host":"smtp.126.com","port":465,"secure":true},"163":{"description":"163 Mail (NetEase)","host":"smtp.163.com","port":465,"secure":true},"Aliyun":{"description":"Alibaba Cloud Mail","domains":["aliyun.com"],"host":"smtp.aliyun.com","port":465,"secure":true},"AliyunQiye":{"description":"Alibaba Cloud Enterprise Mail","host":"smtp.qiye.aliyun.com","port":465,"secure":true},"AOL":{"description":"AOL Mail","domains":["aol.com"],"host":"smtp.aol.com","port":587},"Aruba":{"description":"Aruba PEC (Italian email provider)","domains":["aruba.it","pec.aruba.it"],"aliases":["Aruba PEC"],"host":"smtps.aruba.it","port":465,"secure":true,"authMethod":"LOGIN"},"Bluewin":{"description":"Bluewin (Swiss email provider)","host":"smtpauths.bluewin.ch","domains":["bluewin.ch"],"port":465},"BOL":{"description":"BOL Mail (Brazilian provider)","domains":["bol.com.br"],"host":"smtp.bol.com.br","port":587,"requireTLS":true},"DebugMail":{"description":"DebugMail (email testing service)","host":"debugmail.io","port":25},"Disroot":{"description":"Disroot (privacy-focused provider)","domains":["disroot.org"],"host":"disroot.org","port":587,"secure":false,"authMethod":"LOGIN"},"DynectEmail":{"description":"Dyn Email Delivery","aliases":["Dynect"],"host":"smtp.dynect.net","port":25},"ElasticEmail":{"description":"Elastic Email","aliases":["Elastic Email"],"host":"smtp.elasticemail.com","port":465,"secure":true},"Ethereal":{"description":"Ethereal Email (email testing service)","aliases":["ethereal.email"],"host":"smtp.ethereal.email","port":587},"FastMail":{"description":"FastMail","domains":["fastmail.fm"],"host":"smtp.fastmail.com","port":465,"secure":true},"Feishu Mail":{"description":"Feishu Mail (Lark)","aliases":["Feishu","FeishuMail"],"domains":["www.feishu.cn"],"host":"smtp.feishu.cn","port":465,"secure":true},"Forward Email":{"description":"Forward Email (email forwarding service)","aliases":["FE","ForwardEmail"],"domains":["forwardemail.net"],"host":"smtp.forwardemail.net","port":465,"secure":true},"GandiMail":{"description":"Gandi Mail","aliases":["Gandi","Gandi Mail"],"host":"mail.gandi.net","port":587},"Gmail":{"description":"Gmail","aliases":["Google Mail"],"domains":["gmail.com","googlemail.com"],"host":"smtp.gmail.com","port":465,"secure":true},"GMX":{"description":"GMX Mail","domains":["gmx.com","gmx.net","gmx.de"],"host":"mail.gmx.com","port":587},"Godaddy":{"description":"GoDaddy Email (US)","host":"smtpout.secureserver.net","port":25},"GodaddyAsia":{"description":"GoDaddy Email (Asia)","host":"smtp.asia.secureserver.net","port":25},"GodaddyEurope":{"description":"GoDaddy Email (Europe)","host":"smtp.europe.secureserver.net","port":25},"hot.ee":{"description":"Hot.ee (Estonian email provider)","host":"mail.hot.ee"},"Hotmail":{"description":"Outlook.com / Hotmail","aliases":["Outlook","Outlook.com","Hotmail.com"],"domains":["hotmail.com","outlook.com"],"host":"smtp-mail.outlook.com","port":587},"iCloud":{"description":"iCloud Mail","aliases":["Me","Mac"],"domains":["me.com","mac.com"],"host":"smtp.mail.me.com","port":587},"Infomaniak":{"description":"Infomaniak Mail (Swiss hosting provider)","host":"mail.infomaniak.com","domains":["ik.me","ikmail.com","etik.com"],"port":587},"KolabNow":{"description":"KolabNow (secure email service)","domains":["kolabnow.com"],"aliases":["Kolab"],"host":"smtp.kolabnow.com","port":465,"secure":true,"authMethod":"LOGIN"},"Loopia":{"description":"Loopia (Swedish hosting provider)","host":"mailcluster.loopia.se","port":465},"Loops":{"description":"Loops","host":"smtp.loops.so","port":587},"mail.ee":{"description":"Mail.ee (Estonian email provider)","host":"smtp.mail.ee"},"Mail.ru":{"description":"Mail.ru","host":"smtp.mail.ru","port":465,"secure":true},"Mailcatch.app":{"description":"Mailcatch (email testing service)","host":"sandbox-smtp.mailcatch.app","port":2525},"Maildev":{"description":"MailDev (local email testing)","port":1025,"ignoreTLS":true},"MailerSend":{"description":"MailerSend","host":"smtp.mailersend.net","port":587},"Mailgun":{"description":"Mailgun","host":"smtp.mailgun.org","port":465,"secure":true},"Mailjet":{"description":"Mailjet","host":"in.mailjet.com","port":587},"Mailosaur":{"description":"Mailosaur (email testing service)","host":"mailosaur.io","port":25},"Mailtrap":{"description":"Mailtrap","host":"live.smtp.mailtrap.io","port":587},"Mandrill":{"description":"Mandrill (by Mailchimp)","host":"smtp.mandrillapp.com","port":587},"Naver":{"description":"Naver Mail (Korean email provider)","host":"smtp.naver.com","port":587},"OhMySMTP":{"description":"OhMySMTP (email delivery service)","host":"smtp.ohmysmtp.com","port":587,"secure":false},"One":{"description":"One.com Email","host":"send.one.com","port":465,"secure":true},"OpenMailBox":{"description":"OpenMailBox","aliases":["OMB","openmailbox.org"],"host":"smtp.openmailbox.org","port":465,"secure":true},"Outlook365":{"description":"Microsoft 365 / Office 365","host":"smtp.office365.com","port":587,"secure":false},"Postmark":{"description":"Postmark","aliases":["PostmarkApp"],"host":"smtp.postmarkapp.com","port":2525},"Proton":{"description":"Proton Mail","aliases":["ProtonMail","Proton.me","Protonmail.com","Protonmail.ch"],"domains":["proton.me","protonmail.com","pm.me","protonmail.ch"],"host":"smtp.protonmail.ch","port":587,"requireTLS":true},"qiye.aliyun":{"description":"Alibaba Mail Enterprise Edition","host":"smtp.mxhichina.com","port":"465","secure":true},"QQ":{"description":"QQ Mail","domains":["qq.com"],"host":"smtp.qq.com","port":465,"secure":true},"QQex":{"description":"QQ Enterprise Mail","aliases":["QQ Enterprise"],"domains":["exmail.qq.com"],"host":"smtp.exmail.qq.com","port":465,"secure":true},"Resend":{"description":"Resend","host":"smtp.resend.com","port":465,"secure":true},"Runbox":{"description":"Runbox (Norwegian email provider)","domains":["runbox.com"],"host":"smtp.runbox.com","port":465,"secure":true},"SendCloud":{"description":"SendCloud (Chinese email delivery)","host":"smtp.sendcloud.net","port":2525},"SendGrid":{"description":"SendGrid","host":"smtp.sendgrid.net","port":587},"SendinBlue":{"description":"Brevo (formerly Sendinblue)","aliases":["Brevo"],"host":"smtp-relay.brevo.com","port":587},"SendPulse":{"description":"SendPulse","host":"smtp-pulse.com","port":465,"secure":true},"SES":{"description":"AWS SES US East (N. Virginia)","host":"email-smtp.us-east-1.amazonaws.com","port":465,"secure":true},"SES-AP-NORTHEAST-1":{"description":"AWS SES Asia Pacific (Tokyo)","host":"email-smtp.ap-northeast-1.amazonaws.com","port":465,"secure":true},"SES-AP-NORTHEAST-2":{"description":"AWS SES Asia Pacific (Seoul)","host":"email-smtp.ap-northeast-2.amazonaws.com","port":465,"secure":true},"SES-AP-NORTHEAST-3":{"description":"AWS SES Asia Pacific (Osaka)","host":"email-smtp.ap-northeast-3.amazonaws.com","port":465,"secure":true},"SES-AP-SOUTH-1":{"description":"AWS SES Asia Pacific (Mumbai)","host":"email-smtp.ap-south-1.amazonaws.com","port":465,"secure":true},"SES-AP-SOUTHEAST-1":{"description":"AWS SES Asia Pacific (Singapore)","host":"email-smtp.ap-southeast-1.amazonaws.com","port":465,"secure":true},"SES-AP-SOUTHEAST-2":{"description":"AWS SES Asia Pacific (Sydney)","host":"email-smtp.ap-southeast-2.amazonaws.com","port":465,"secure":true},"SES-CA-CENTRAL-1":{"description":"AWS SES Canada (Central)","host":"email-smtp.ca-central-1.amazonaws.com","port":465,"secure":true},"SES-EU-CENTRAL-1":{"description":"AWS SES Europe (Frankfurt)","host":"email-smtp.eu-central-1.amazonaws.com","port":465,"secure":true},"SES-EU-NORTH-1":{"description":"AWS SES Europe (Stockholm)","host":"email-smtp.eu-north-1.amazonaws.com","port":465,"secure":true},"SES-EU-WEST-1":{"description":"AWS SES Europe (Ireland)","host":"email-smtp.eu-west-1.amazonaws.com","port":465,"secure":true},"SES-EU-WEST-2":{"description":"AWS SES Europe (London)","host":"email-smtp.eu-west-2.amazonaws.com","port":465,"secure":true},"SES-EU-WEST-3":{"description":"AWS SES Europe (Paris)","host":"email-smtp.eu-west-3.amazonaws.com","port":465,"secure":true},"SES-SA-EAST-1":{"description":"AWS SES South America (São Paulo)","host":"email-smtp.sa-east-1.amazonaws.com","port":465,"secure":true},"SES-US-EAST-1":{"description":"AWS SES US East (N. Virginia)","host":"email-smtp.us-east-1.amazonaws.com","port":465,"secure":true},"SES-US-EAST-2":{"description":"AWS SES US East (Ohio)","host":"email-smtp.us-east-2.amazonaws.com","port":465,"secure":true},"SES-US-GOV-EAST-1":{"description":"AWS SES GovCloud (US-East)","host":"email-smtp.us-gov-east-1.amazonaws.com","port":465,"secure":true},"SES-US-GOV-WEST-1":{"description":"AWS SES GovCloud (US-West)","host":"email-smtp.us-gov-west-1.amazonaws.com","port":465,"secure":true},"SES-US-WEST-1":{"description":"AWS SES US West (N. California)","host":"email-smtp.us-west-1.amazonaws.com","port":465,"secure":true},"SES-US-WEST-2":{"description":"AWS SES US West (Oregon)","host":"email-smtp.us-west-2.amazonaws.com","port":465,"secure":true},"Seznam":{"description":"Seznam Email (Czech email provider)","aliases":["Seznam Email"],"domains":["seznam.cz","email.cz","post.cz","spoluzaci.cz"],"host":"smtp.seznam.cz","port":465,"secure":true},"SMTP2GO":{"description":"SMTP2GO","host":"mail.smtp2go.com","port":2525},"Sparkpost":{"description":"SparkPost","aliases":["SparkPost","SparkPost Mail"],"domains":["sparkpost.com"],"host":"smtp.sparkpostmail.com","port":587,"secure":false},"Tipimail":{"description":"Tipimail (email delivery service)","host":"smtp.tipimail.com","port":587},"Tutanota":{"description":"Tutanota (Tuta Mail)","domains":["tutanota.com","tuta.com","tutanota.de","tuta.io"],"host":"smtp.tutanota.com","port":465,"secure":true},"Yahoo":{"description":"Yahoo Mail","domains":["yahoo.com"],"host":"smtp.mail.yahoo.com","port":465,"secure":true},"Yandex":{"description":"Yandex Mail","domains":["yandex.ru"],"host":"smtp.yandex.ru","port":465,"secure":true},"Zimbra":{"description":"Zimbra Mail Server","aliases":["Zimbra Collaboration"],"host":"smtp.zimbra.com","port":587,"requireTLS":true},"Zoho":{"description":"Zoho Mail","host":"smtp.zoho.com","port":465,"secure":true,"authMethod":"LOGIN"}}'))},33405,(a,b,c)=>{b.exports=a.x("child_process",()=>require("child_process"))},70479,a=>{"use strict";var b=a.i(37936),c=a.i(66879),d=a.i(73478),e=a.i(18558),f=a.i(6731);async function g(a){try{let b=await (0,d.getSession)();if(!b)return{error:"Please sign in to place an order"};let f=`NIVARA-${Date.now()}`,g=(await c.sql`
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
        `;b.length>0&&(d=b[0])}else if(a.shipping_address)try{d=JSON.parse(a.shipping_address)}catch(a){d={}}if(d)try{let c=(0,f.generateOrderCancellationEmail)(a,b,i,d);await (0,f.sendEmail)({to:b.email,subject:`Order #${a.order_number} Cancelled`,html:c})}catch(a){console.error("[v0] Failed to send cancellation email:",a)}}return(0,e.revalidatePath)("/account"),(0,e.revalidatePath)("/orders"),(0,e.revalidatePath)(`/orders/${a}`),{success:!0}}catch(a){return console.error("[v0] Failed to cancel order:",a),{error:"Failed to cancel order"}}}(0,a.i(13095).ensureServerEntryExports)([g,h]),(0,b.registerServerReference)(g,"4092236c67afa3346a320374b8c3df1fa7187b9005",null),(0,b.registerServerReference)(h,"4068bf0181f24a199e2d852075c25992cf1639aea9",null),a.s(["cancelOrder",()=>h,"createOrder",()=>g])},20497,a=>{"use strict";var b=a.i(37936);async function c(){return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID||""}(0,a.i(13095).ensureServerEntryExports)([c]),(0,b.registerServerReference)(c,"00418ce438cb53ce0d5731b9ed91863489d3d34d38",null),a.s(["getRazorpayPublicKey",()=>c])},27001,a=>{"use strict";var b=a.i(70479),c=a.i(20497);a.s([],88252),a.i(88252),a.s(["00418ce438cb53ce0d5731b9ed91863489d3d34d38",()=>c.getRazorpayPublicKey,"4092236c67afa3346a320374b8c3df1fa7187b9005",()=>b.createOrder],27001)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__48934493._.js.map