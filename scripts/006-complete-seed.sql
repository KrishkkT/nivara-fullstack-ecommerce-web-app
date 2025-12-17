-- First, clean up the database
TRUNCATE TABLE cart_items, wishlist, order_items, orders, products, categories, addresses, users RESTART IDENTITY CASCADE;

-- Insert only 4 categories as requested
INSERT INTO categories (name, slug, description, image_url) VALUES
('Rings', 'rings', 'Exquisite sterling silver rings - from delicate bands to statement pieces. Our ring collection features handcrafted designs ranging from minimalist everyday wear to ornate occasion pieces, each crafted with precision and artistry.', '/placeholder.svg?height=400&width=400'),
('Pendant Sets', 'pendant-sets', 'Elegant pendant sets with matching chains in sterling silver. Each piece tells a story through intricate craftsmanship, featuring traditional and contemporary designs perfect for both daily wear and special occasions.', '/placeholder.svg?height=400&width=400'),
('Bracelets', 'bracelets', 'Elegant sterling silver bracelets and bangles for every style. From delicate chains to bold cuffs, our bracelet collection showcases the versatility of silver jewelry with designs that complement any outfit.', '/placeholder.svg?height=400&width=400'),
('Earrings', 'earrings', 'Stunning sterling silver earrings collection - hoops, studs, and drops. Our earring designs range from timeless classics to modern statement pieces, all crafted to enhance your natural beauty with the elegance of silver.', '/placeholder.svg?height=400&width=400')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Insert premium silver products with real placeholder images
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, image_url, images, metal_purity, weight, dimensions, is_featured, is_active) VALUES
-- RINGS (category_id = 1)
('Celestial Moon Ring', 'celestial-moon-ring', 'A delicate crescent moon ring with intricate star detailing. This handcrafted piece captures the mystique of celestial beauty, perfect for those who appreciate subtle elegance. The oxidized finish highlights the intricate engravings, making it a timeless addition to your collection.', 1299.00, 1799.00, 1, 50, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", "https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 3.5, 'Adjustable (Size 6-9)', true, true),

('Vintage Rose Ring', 'vintage-rose-ring', 'Handcrafted silver ring featuring an ornate rose motif with oxidized finish. Each petal is meticulously carved by skilled artisans, creating a romantic vintage aesthetic. The antique patina adds depth and character to this statement piece.', 1599.00, 2199.00, 1, 35, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600", "https://images.unsplash.com/photo-1612083489805-eab6f02abcc5?w=600"]'::jsonb, '925 Sterling Silver', 4.2, 'US Size 7', false, true),

('Infinity Band Ring', 'infinity-band-ring', 'Minimalist infinity symbol ring symbolizing eternal love and connection. The sleek, modern design features a continuous infinity loop that wraps elegantly around your finger. Perfect for everyday wear or as a meaningful gift.', 999.00, 1399.00, 1, 60, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"]'::jsonb, '925 Sterling Silver', 2.8, 'Adjustable (Size 5-8)', true, true),

('Filigree Cocktail Ring', 'filigree-cocktail-ring', 'Stunning statement cocktail ring with intricate filigree work and gemstone center. This bold piece features traditional silver filigree techniques passed down through generations, creating a mesmerizing pattern that catches the light beautifully.', 2499.00, 3299.00, 1, 25, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"]'::jsonb, '925 Sterling Silver', 6.8, 'US Size 7', true, true),

-- PENDANT SETS (category_id = 2)
('Lotus Pendant Necklace', 'lotus-pendant-necklace', 'Sacred lotus flower pendant on delicate silver chain, representing purity and enlightenment. The multi-layered petals are hand-carved with exceptional detail, creating a three-dimensional effect. Comes with an 18-inch chain.', 2499.00, 3299.00, 2, 40, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", "https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 6.5, '18 inch chain, 1.2 inch pendant', true, true),

('Moonstone Pendant Set', 'moonstone-pendant-set', 'Ethereal rainbow moonstone set in sterling silver with matching chain. The iridescent stone displays a captivating blue sheen, beautifully complemented by the oxidized silver setting. A perfect blend of bohemian and elegant style.', 3299.00, 4299.00, 2, 25, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600"]'::jsonb, '925 Sterling Silver', 7.8, '20 inch chain, 1.5 inch pendant', true, true),

('Tree of Life Pendant', 'tree-of-life-pendant', 'Symbolic tree of life pendant representing growth, strength, and connection. The intricate branches and roots form a perfect circle, beautifully openwork design. Includes adjustable chain length from 16-18 inches.', 1899.00, 2499.00, 2, 35, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]'::jsonb, '925 Sterling Silver', 5.2, '16-18 inch adjustable chain', false, true),

('Mandala Pendant Set', 'mandala-pendant-set', 'Intricate mandala design pendant celebrating spiritual harmony and balance. Hand-engraved with geometric patterns that radiate from the center, creating a mesmerizing visual effect. Comes with a delicate box chain.', 2199.00, 2899.00, 2, 30, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 6.0, '18 inch chain, 1.3 inch pendant', false, true),

-- BRACELETS (category_id = 3)
('Charm Bracelet', 'charm-bracelet', 'Delicate charm bracelet with customizable hanging charms. Features a secure lobster clasp and five removable charms including heart, star, moon, and flower motifs. Perfect for creating your personal story.', 1499.00, 1999.00, 3, 50, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"]'::jsonb, '925 Sterling Silver', 6.0, '7.5 inches, adjustable', false, true),

('Oxidized Cuff Bracelet', 'oxidized-cuff-bracelet', 'Bold oxidized silver cuff with traditional tribal motifs and geometric patterns. This statement piece features deep engravings that create beautiful shadows and depth. The open design allows for comfortable adjustment.', 2299.00, 2999.00, 3, 30, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 12.5, '2.5 inches wide, adjustable', true, true),

('Link Chain Bracelet', 'link-chain-bracelet', 'Classic cable link chain bracelet with secure box clasp. The substantial weight and perfectly polished links create a luxurious feel. Versatile enough to wear alone or layered with other bracelets.', 1799.00, 2399.00, 3, 45, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 8.5, '7 inches with 1 inch extender', true, true),

('Bangle Set', 'bangle-set', 'Set of three stacking bangles with varying textures - polished, hammered, and twisted. These versatile bangles can be worn together for a layered look or separately for understated elegance. Each piece complements the others perfectly.', 2599.00, 3299.00, 3, 35, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1611591437611-e27c68e38721?w=600"]'::jsonb, '925 Sterling Silver', 15.0, '2.5 inch diameter each', false, true),

-- EARRINGS (category_id = 4)
('Chandelier Earrings', 'chandelier-earrings', 'Ornate chandelier style earrings with intricate filigree patterns and cascading design. These statement earrings feature multiple tiers of delicate silverwork, creating dramatic movement. Perfect for special occasions.', 1799.00, 2399.00, 4, 45, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600"]'::jsonb, '925 Sterling Silver', 5.5, '2.5 inches long', true, true),

('Minimalist Hoops', 'minimalist-hoops', 'Classic silver hoop earrings with sleek polished finish and secure hinged closure. These timeless hoops are lightweight and comfortable for all-day wear. The perfect diameter strikes a balance between subtle and statement-making.', 899.00, 1199.00, 4, 80, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]'::jsonb, '925 Sterling Silver', 3.2, '1.5 inch diameter', false, true),

('Pearl Drop Earrings', 'pearl-drop-earrings', 'Elegant freshwater pearl drop earrings with sterling silver hooks. Each luminous pearl is carefully selected for its luster and shape, suspended from delicate silver links. Classic elegance for any occasion.', 2199.00, 2899.00, 4, 35, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]'::jsonb, '925 Sterling Silver', 4.8, '1.8 inches long', true, true),

('Stud Earring Set', 'stud-earring-set', 'Set of three pairs of silver stud earrings - geometric, floral, and minimalist designs. This versatile set offers options for every mood and outfit. Each pair features secure butterfly backs.', 1299.00, 1699.00, 4, 60, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]'::jsonb, '925 Sterling Silver', 2.5, '0.5 inch each', false, true),

('Tribal Dangle Earrings', 'tribal-dangle-earrings', 'Bold tribal-inspired dangle earrings with oxidized finish and geometric patterns. These eye-catching earrings feature traditional motifs reimagined in a contemporary style. The oxidized detailing creates striking contrast.', 1599.00, 2099.00, 4, 40, '/placeholder.svg?height=600&width=600', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"]'::jsonb, '925 Sterling Silver', 4.2, '2 inches long', true, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  stock_quantity = EXCLUDED.stock_quantity,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  metal_purity = EXCLUDED.metal_purity,
  weight = EXCLUDED.weight,
  dimensions = EXCLUDED.dimensions,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- Insert an admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@nivara.com', 'f6e0a1e2ac41945a9aa7ff8a8aaa0cebc12a3bcc981a929ad5cf810a090e11ae', 'NIVARA Admin', '+91 6351049574', 'admin')
ON CONFLICT (email) DO NOTHING;
