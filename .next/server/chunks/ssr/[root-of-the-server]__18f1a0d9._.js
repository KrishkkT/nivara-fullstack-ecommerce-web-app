module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70864,a=>{a.n(a.i(33290))},43619,a=>{a.n(a.i(79962))},13718,a=>{a.n(a.i(85523))},18198,a=>{a.n(a.i(45518))},62212,a=>{a.n(a.i(66114))},76282,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call SearchResults() from the server but SearchResults is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/search-results.tsx <module evaluation>","SearchResults");a.s(["SearchResults",0,b])},15479,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call SearchResults() from the server but SearchResults is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/search-results.tsx","SearchResults");a.s(["SearchResults",0,b])},69442,a=>{"use strict";a.i(76282);var b=a.i(15479);a.n(b)},21120,a=>{"use strict";var b=a.i(7997),c=a.i(66879),d=a.i(69442);async function e({searchParams:a}){let e=a.q||"",f=a.designNumber||"",g=a.minPrice||"",h=a.maxPrice||"",i=[];if(e||f||g||h){let a=`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `,b=[],d=[];e&&(b.push(`
        (p.name ILIKE $${b.length+1} OR 
         p.description ILIKE $${b.length+2} OR 
         c.name ILIKE $${b.length+3} OR
         p.design_number ILIKE $${b.length+4})
      `),d.push(`%${e}%`,`%${e}%`,`%${e}%`,`%${e}%`)),f&&(b.push(`p.design_number ILIKE $${b.length+1}`),d.push(`%${f}%`)),g&&(b.push(`p.price >= $${b.length+1}`),d.push(g)),h&&(b.push(`p.price <= $${b.length+1}`),d.push(h)),b.length>0&&(a+=" AND "+b.join(" AND ")),a+=" ORDER BY p.created_at DESC LIMIT 50",i=await (0,c.sql)(a,...d)}return(0,b.jsx)(d.SearchResults,{query:e,products:i})}a.s(["default",()=>e])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__18f1a0d9._.js.map