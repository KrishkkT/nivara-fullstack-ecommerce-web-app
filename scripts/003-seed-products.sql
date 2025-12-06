-- Insert sample products
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, stock_quantity, image_url, images, metal_purity, weight, is_featured, is_active) VALUES
-- Rings
('Celestial Moon Ring', 'celestial-moon-ring', 'A delicate crescent moon ring with intricate detailing, perfect for everyday elegance', 1299.00, 1799.00, 1, 50, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Ring+1", "https://via.placeholder.com/600x600/F1EEEC/B29789?text=Ring+2"]'::jsonb, '925 Sterling Silver', 3.5, true, true),
('Vintage Rose Ring', 'vintage-rose-ring', 'Handcrafted silver ring with rose motif and oxidized finish', 1599.00, 2199.00, 1, 35, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Ring+1"]'::jsonb, '925 Sterling Silver', 4.2, false, true),
('Infinity Band Ring', 'infinity-band-ring', 'Minimalist infinity symbol ring, symbolizing eternal love', 999.00, 1399.00, 1, 60, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Ring+1"]'::jsonb, '925 Sterling Silver', 2.8, true, true),

-- Necklaces
('Lotus Pendant Necklace', 'lotus-pendant-necklace', 'Sacred lotus flower pendant on delicate silver chain', 2499.00, 3299.00, 2, 40, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Necklace+1"]'::jsonb, '925 Sterling Silver', 6.5, true, true),
('Layered Chain Necklace', 'layered-chain-necklace', 'Modern multi-layered chain necklace for contemporary style', 1899.00, 2499.00, 2, 30, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Necklace+1"]'::jsonb, '925 Sterling Silver', 8.2, false, true),
('Moonstone Pendant', 'moonstone-pendant', 'Ethereal moonstone set in sterling silver pendant', 3299.00, 4299.00, 2, 25, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Necklace+1"]'::jsonb, '925 Sterling Silver', 7.8, true, true),

-- Earrings
('Chandelier Earrings', 'chandelier-earrings', 'Ornate chandelier style earrings with intricate patterns', 1799.00, 2399.00, 3, 45, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Earrings+1"]'::jsonb, '925 Sterling Silver', 5.5, true, true),
('Minimalist Hoops', 'minimalist-hoops', 'Classic silver hoop earrings with sleek finish', 899.00, 1199.00, 3, 80, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Earrings+1"]'::jsonb, '925 Sterling Silver', 3.2, false, true),
('Pearl Drop Earrings', 'pearl-drop-earrings', 'Elegant freshwater pearl drop earrings', 2199.00, 2899.00, 3, 35, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Earrings+1"]'::jsonb, '925 Sterling Silver', 4.8, true, true),

-- Bracelets
('Charm Bracelet', 'charm-bracelet', 'Delicate charm bracelet with customizable charms', 1499.00, 1999.00, 4, 50, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Bracelet+1"]'::jsonb, '925 Sterling Silver', 6.0, false, true),
('Cuff Bracelet', 'cuff-bracelet', 'Bold oxidized silver cuff with traditional motifs', 2299.00, 2999.00, 4, 30, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Bracelet+1"]'::jsonb, '925 Sterling Silver', 12.5, true, true),

-- Anklets
('Bell Anklet', 'bell-anklet', 'Traditional anklet with tiny bells, creating a melodious sound', 1299.00, 1699.00, 5, 40, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Anklet+1"]'::jsonb, '925 Sterling Silver', 8.5, false, true),
('Chain Anklet', 'chain-anklet', 'Delicate chain anklet with adjustable length', 999.00, 1299.00, 5, 55, '/placeholder.svg?height=600&width=600', '["https://via.placeholder.com/600x600/F1EEEC/B29789?text=Anklet+1"]'::jsonb, '925 Sterling Silver', 5.8, true, true)
ON CONFLICT (slug) DO NOTHING;
