-- Complete database seed with admin user and products
-- This script will clear existing data and create fresh seed data

-- First, ensure we have clean data
TRUNCATE users, categories, products, cart_items, orders, order_items, addresses, wishlist RESTART IDENTITY CASCADE;

-- Create admin user
-- Email: admin@nivara.com
-- Password: admin123
-- SHA-256 hash of "admin123" is: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO users (email, password_hash, full_name, phone, role, created_at, updated_at)
VALUES (
  'admin@nivara.com',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  'Admin User',
  '+1234567890',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET role = 'admin', password_hash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

-- Insert Categories (only 4 as requested)
INSERT INTO categories (name, slug, description, image_url, created_at) VALUES
('Rings', 'rings', 'Exquisite silver rings crafted with precision and adorned with timeless elegance. From delicate bands to statement pieces, each ring tells a story of sophistication and style. Perfect for everyday wear or special occasions.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', NOW()),
('Pendant Sets', 'pendant-sets', 'Elegant pendant sets that combine grace with luxury. Each set is meticulously designed to complement your neckline, featuring intricate details and premium silver craftsmanship. Complete your look with these stunning pieces.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', NOW()),
('Bracelets', 'bracelets', 'Beautiful silver bracelets that wrap your wrist in elegance. From minimalist designs to ornate pieces, our collection offers versatility and sophistication. Each bracelet is crafted to be a timeless addition to your jewelry collection.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800', NOW()),
('Earrings', 'earrings', 'Stunning silver earrings that frame your face with grace. Our collection ranges from delicate studs to dramatic drops, each piece designed to enhance your natural beauty. Lightweight yet impactful, perfect for any occasion.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Products for Rings
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
SELECT 
  'Celestial Band Ring', 'celestial-band-ring',
  'A delicate band ring featuring intricate celestial motifs. Handcrafted with precision, this ring showcases subtle star and moon engravings that catch the light beautifully.',
  2499.00, 3499.00, id, 
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
  '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800"]'::jsonb,
  25, 3.5, 'Ring Size: Adjustable', '92.5% Sterling Silver', true, true, NOW(), NOW()
FROM categories WHERE slug = 'rings'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Eternity Stone Ring', 'eternity-stone-ring',
  'An elegant ring adorned with carefully set cubic zirconia stones. The continuous band design symbolizes eternal beauty and commitment.',
  3299.00, 4299.00, (SELECT id FROM categories WHERE slug = 'rings'),
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
  '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"]'::jsonb,
  20, 4.2, 'Ring Size: 6-8 (adjustable)', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Vintage Filigree Ring', 'vintage-filigree-ring',
  'A statement ring featuring intricate filigree work inspired by vintage designs. The oxidized finish adds depth and character to this artistic piece.',
  2799.00, 3799.00, (SELECT id FROM categories WHERE slug = 'rings'),
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  '["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"]'::jsonb,
  15, 5.0, 'Ring Size: 7', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Minimalist Stacking Ring Set', 'minimalist-stacking-ring-set',
  'A set of three delicate stacking rings that can be worn together or separately. Perfect for creating a personalized look with effortless elegance.',
  1999.00, 2999.00, (SELECT id FROM categories WHERE slug = 'rings'),
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
  '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"]'::jsonb,
  30, 2.5, 'Ring Sizes: Adjustable', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products for Pendant Sets
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Moonstone Elegance Pendant Set', 'moonstone-elegance-pendant',
  'A stunning pendant featuring a genuine moonstone centerpiece. The ethereal glow of the moonstone is complemented by intricate silver work. Includes matching chain.',
  4599.00, 6299.00, (SELECT id FROM categories WHERE slug = 'pendant-sets'),
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800"]'::jsonb,
  18, 8.5, 'Pendant: 2.5cm x 1.5cm, Chain: 18 inches', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Royal Peacock Pendant Set', 'royal-peacock-pendant',
  'An exquisite pendant set inspired by the majestic peacock. Features detailed craftsmanship with colored enamel work and stone embellishments.',
  5299.00, 7299.00, (SELECT id FROM categories WHERE slug = 'pendant-sets'),
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800',
  '["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800"]'::jsonb,
  12, 12.0, 'Pendant: 3cm x 2cm, Chain: 20 inches', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Infinity Love Pendant', 'infinity-love-pendant',
  'A minimalist pendant featuring the infinity symbol adorned with sparkling stones. Symbolizes eternal love and endless possibilities.',
  3299.00, 4599.00, (SELECT id FROM categories WHERE slug = 'pendant-sets'),
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
  '["https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800"]'::jsonb,
  22, 6.0, 'Pendant: 2cm x 1cm, Chain: 16 inches', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Mandala Wisdom Pendant', 'mandala-wisdom-pendant',
  'A spiritual pendant featuring an intricate mandala design. Each detail represents harmony and balance, making it a meaningful accessory.',
  3799.00, 5299.00, (SELECT id FROM categories WHERE slug = 'pendant-sets'),
  'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800',
  '["https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800"]'::jsonb,
  16, 7.5, 'Pendant: 2.8cm diameter, Chain: 18 inches', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products for Bracelets
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Chain Link Charm Bracelet', 'chain-link-charm-bracelet',
  'A versatile chain bracelet with multiple charm attachments. Mix and match charms to create your personalized story bracelet.',
  3599.00, 4899.00, (SELECT id FROM categories WHERE slug = 'bracelets'),
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
  '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"]'::jsonb,
  20, 9.0, 'Length: 7-8 inches (adjustable)', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Bangle Set of 4', 'bangle-set-of-4',
  'An elegant set of four bangles with varying textures - from smooth polish to intricate patterns. Perfect for stacking or wearing individually.',
  4299.00, 5999.00, (SELECT id FROM categories WHERE slug = 'bracelets'),
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
  '["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800"]'::jsonb,
  15, 28.0, 'Diameter: 2.4 inches', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Tennis Bracelet Deluxe', 'tennis-bracelet-deluxe',
  'A classic tennis bracelet featuring a continuous line of cubic zirconia stones. Timeless elegance for any occasion.',
  5999.00, 7999.00, (SELECT id FROM categories WHERE slug = 'bracelets'),
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
  '["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"]'::jsonb,
  10, 11.5, 'Length: 7 inches', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Boho Beaded Bracelet', 'boho-beaded-bracelet',
  'A bohemian-style bracelet featuring silver beads and oxidized accents. Perfect for adding a touch of artistic flair to your look.',
  2299.00, 3299.00, (SELECT id FROM categories WHERE slug = 'bracelets'),
  'https://images.unsplash.com/photo-1588444650921-4c0b7eb20d24?w=800',
  '["https://images.unsplash.com/photo-1588444650921-4c0b7eb20d24?w=800"]'::jsonb,
  25, 7.0, 'Length: 6.5-7.5 inches (adjustable)', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Products for Earrings
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Hoop Earrings Classic', 'hoop-earrings-classic',
  'Timeless silver hoop earrings with a contemporary twist. Lightweight and comfortable for all-day wear with a perfect diameter.',
  1799.00, 2599.00, (SELECT id FROM categories WHERE slug = 'earrings'),
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
  '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"]'::jsonb,
  35, 4.5, 'Diameter: 3cm', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Crystal Drop Earrings', 'crystal-drop-earrings',
  'Elegant drop earrings featuring sparkling crystals that catch and reflect light beautifully. Perfect for evening wear.',
  2899.00, 3999.00, (SELECT id FROM categories WHERE slug = 'earrings'),
  'https://images.unsplash.com/photo-1589674781759-c0c0f0b7d7b7?w=800',
  '["https://images.unsplash.com/photo-1589674781759-c0c0f0b7d7b7?w=800"]'::jsonb,
  28, 5.5, 'Length: 4cm', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Floral Stud Earrings', 'floral-stud-earrings',
  'Delicate floral-inspired stud earrings perfect for everyday elegance. Features intricate petal details with oxidized accents.',
  1499.00, 2199.00, (SELECT id FROM categories WHERE slug = 'earrings'),
  'https://images.unsplash.com/photo-1596944946731-6dfeb57a2c74?w=800',
  '["https://images.unsplash.com/photo-1596944946731-6dfeb57a2c74?w=800"]'::jsonb,
  40, 3.0, 'Diameter: 1cm', '92.5% Sterling Silver', true, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock_quantity, weight, dimensions, metal_purity, is_featured, is_active, created_at, updated_at)
VALUES (
  'Chandelier Statement Earrings', 'chandelier-statement-earrings',
  'Dramatic chandelier earrings that make a bold statement. Features multiple tiers of intricate silver work and stone details.',
  4599.00, 6299.00, (SELECT id FROM categories WHERE slug = 'earrings'),
  'https://images.unsplash.com/photo-1595423362945-d6c79bbe7a62?w=800',
  '["https://images.unsplash.com/photo-1595423362945-d6c79bbe7a62?w=800"]'::jsonb,
  12, 8.0, 'Length: 6cm', '92.5% Sterling Silver', false, true, NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;
