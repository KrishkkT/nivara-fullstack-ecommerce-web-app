module.exports=[93695,(a,b,c)=>{b.exports=a.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70864,a=>{a.n(a.i(33290))},43619,a=>{a.n(a.i(79962))},13718,a=>{a.n(a.i(85523))},18198,a=>{a.n(a.i(45518))},62212,a=>{a.n(a.i(66114))},20163,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call AdminCategoriesList() from the server but AdminCategoriesList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/admin-categories-list.tsx <module evaluation>","AdminCategoriesList");a.s(["AdminCategoriesList",0,b])},65574,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call AdminCategoriesList() from the server but AdminCategoriesList is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/admin-categories-list.tsx","AdminCategoriesList");a.s(["AdminCategoriesList",0,b])},93737,a=>{"use strict";a.i(20163);var b=a.i(65574);a.n(b)},3476,a=>{"use strict";var b=a.i(7997),c=a.i(66879),d=a.i(93737);async function e(){let a=await c.sql`
    SELECT 
      c.id,
      c.name,
      c.slug,
      c.description,
      c.image_url,
      c.meta_title as seo_title,
      c.meta_description as seo_description,
      COUNT(p.id)::integer as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.meta_title, c.meta_description
    ORDER BY c.name ASC
  `;return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-serif font-bold text-foreground",children:"Category Management"}),(0,b.jsx)("p",{className:"text-muted-foreground mt-2",children:"Manage product categories and their SEO settings"})]}),(0,b.jsx)(d.AdminCategoriesList,{categories:a})]})}a.s(["default",()=>e])}];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c1649a9._.js.map