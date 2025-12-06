-- Update categories to only keep 4: rings, pendant set (necklaces renamed), bracelets, earrings
DELETE FROM categories WHERE slug NOT IN ('rings', 'necklaces', 'bracelets', 'earrings');

-- Update necklaces to pendant-sets
UPDATE categories SET 
  name = 'Pendant Sets',
  slug = 'pendant-sets',
  description = 'Elegant pendant sets with matching chains in sterling silver',
  image_url = '/placeholder.svg?height=400&width=400'
WHERE slug = 'necklaces';

-- Update descriptions and images with better queries
UPDATE categories SET 
  description = 'Exquisite sterling silver rings - from delicate bands to statement pieces',
  image_url = '/placeholder.svg?height=400&width=400'
WHERE slug = 'rings';

UPDATE categories SET 
  description = 'Stunning sterling silver earrings collection - hoops, studs, and drops',
  image_url = '/placeholder.svg?height=400&width=400'
WHERE slug = 'earrings';

UPDATE categories SET 
  description = 'Elegant sterling silver bracelets and bangles for every style',
  image_url = '/placeholder.svg?height=400&width=400'
WHERE slug = 'bracelets';
