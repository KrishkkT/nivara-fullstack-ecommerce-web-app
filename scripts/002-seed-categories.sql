-- Updated to 5 new categories with SEO fields
-- Using meta_title and meta_description columns
INSERT INTO categories (name, slug, description, image_url, meta_title, meta_description) VALUES
('Necklace', 'necklace', 'Exquisite silver necklaces crafted with precision', '/placeholder.svg?height=400&width=400', 'Premium Silver Necklaces | NIVARA Jewellery', 'Shop handcrafted sterling silver necklaces. Premium quality, elegant designs for every occasion.'),
('Pendent Set', 'pendent-set', 'Beautiful silver pendant sets with matching chains', '/placeholder.svg?height=400&width=400', 'Silver Pendant Sets | NIVARA Jewellery', 'Discover stunning silver pendant sets. Complete with matching chains, perfect for gifting.'),
('Mop Ring', 'mop-ring', 'Elegant mother of pearl silver rings', '/placeholder.svg?height=400&width=400', 'Mother of Pearl Silver Rings | NIVARA', 'Unique MOP silver rings featuring natural mother of pearl. Handcrafted luxury designs.'),
('Solitare Ring', 'solitare-ring', 'Classic silver solitaire rings with precious stones', '/placeholder.svg?height=400&width=400', 'Silver Solitaire Rings | NIVARA Jewellery', 'Elegant silver solitaire rings with premium stones. Timeless designs for special moments.'),
('Bracelet', 'bracelet', 'Stylish silver bracelets and bangles', '/placeholder.svg?height=400&width=400', 'Sterling Silver Bracelets | NIVARA Jewellery', 'Shop beautiful silver bracelets and bangles. Contemporary and traditional designs available.')
ON CONFLICT (slug) DO NOTHING;
