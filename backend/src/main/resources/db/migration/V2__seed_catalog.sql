-- Starter catalog. Prices are placeholders and every producer below is fictional sample data:
-- replace them with your real partner producers before launch.

INSERT INTO plans (code, name, tagline, contents, product_type, price_cents, featured, sort_order) VALUES
('VINO',   'La Bodega',   'Two bottles from Málaga''s small wineries.',
 '2 bottles of wine · tasting cards',                         'WINE',      3900, FALSE, 1),
('MESA',   'La Mesa',     'The full table: wine and extra virgin olive oil.',
 '2 bottles of wine · 500 ml EVOO · tasting cards',           'BOTH',      5400, TRUE,  2),
('ACEITE', 'La Almazara', 'Fresh-pressed extra virgin olive oil from local mills.',
 '2 × 500 ml EVOO · pairing ideas',                           'OLIVE_OIL', 2600, FALSE, 3);

INSERT INTO producers (slug, name, kind, town, area, specialty, description) VALUES
('vinas-de-la-cuesta', 'Viñas de la Cuesta', 'WINERY', 'Cómpeta', 'Axarquía',
 'Moscatel de Alejandría, dry and sweet',
 'Family vines on steep slate slopes above the sea, harvested by hand. Their dry Moscatel is all orange blossom and salt air.'),
('bodega-tajo-alto', 'Bodega Tajo Alto', 'WINERY', 'Ronda', 'Serranía de Ronda',
 'High-altitude reds',
 'A tiny cellar at 750 m making structured reds from Tempranillo, Syrah and Petit Verdot, with cool nights and long ripening.'),
('lagar-montes-verdes', 'Lagar Montes Verdes', 'WINERY', 'Málaga', 'Montes de Málaga',
 'Traditional sweet Pedro Ximénez',
 'An old lagar in the hills behind the city, sun-drying Pedro Ximénez grapes for the classic sweet wines of Málaga.'),
('almazara-olivar-de-la-vega', 'Almazara Olivar de la Vega', 'OLIVE_MILL', 'Antequera', 'Vega de Antequera',
 'Early-harvest Hojiblanca',
 'A small mill pressing Hojiblanca olives within hours of picking. Green tomato, artichoke and a peppery finish.'),
('aceites-verdial-del-valle', 'Aceites Verdial del Valle', 'OLIVE_MILL', 'Vélez-Málaga', 'Axarquía',
 'Verdial de Vélez-Málaga',
 'Centuries-old Verdial trees give a gentle, sweet and almondy oil, perfect for fish and salads.'),
('finca-las-encinas', 'Finca Las Encinas', 'OLIVE_MILL', 'Arriate', 'Serranía de Ronda',
 'Organic Lechín & Picual blend',
 'Certified-organic mountain grove producing a robust, grassy blend that stands up to stews and grilled meat.');
