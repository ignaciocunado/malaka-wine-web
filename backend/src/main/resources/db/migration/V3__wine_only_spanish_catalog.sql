-- Terruño becomes a wine-only subscription, with the catalog in Spanish.
-- As in V2, producers and prices are fictional sample data: replace them before launch.

-- Plans ---------------------------------------------------------------------------------------------
-- Plans are retired rather than deleted, so past subscriptions keep pointing at the plan they had.
ALTER TABLE plans ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE plans DROP COLUMN product_type;

-- Active subscribers of the old wine + oil box move to the two-bottle wine plan (the same wine,
-- without the oil). Oil-only subscriptions can no longer be fulfilled, so they are cancelled.
UPDATE subscriptions
SET plan_id = (SELECT id FROM plans WHERE code = 'VINO')
WHERE status = 'ACTIVE' AND plan_id = (SELECT id FROM plans WHERE code = 'MESA');

UPDATE subscriptions
SET status = 'CANCELLED', cancelled_at = CURRENT_TIMESTAMP(6), next_box_date = NULL
WHERE status = 'ACTIVE' AND plan_id = (SELECT id FROM plans WHERE code = 'ACEITE');

UPDATE plans SET active = FALSE, featured = FALSE WHERE code IN ('MESA', 'ACEITE');

UPDATE plans
SET name       = 'Descubre',
    tagline    = 'Dos vinos de pequeñas bodegas malagueñas cada mes.',
    contents   = '2 botellas · fichas de cata',
    price_cents = 3900,
    featured   = FALSE,
    sort_order = 1
WHERE code = 'VINO';

INSERT INTO plans (code, name, tagline, contents, price_cents, featured, sort_order, active) VALUES
('BODEGA',  'Bodega',  'Tres vinos para recorrer la provincia, de los blancos de Moscatel a los tintos de Ronda.',
 '3 botellas · fichas de cata · maridajes', 5400, TRUE, 2, TRUE),
('RESERVA', 'Reserva', 'Vinos de producción muy limitada, crianzas y dulces de añada.',
 '3 botellas de edición limitada · fichas de cata', 8900, FALSE, 3, TRUE);

-- Producers -----------------------------------------------------------------------------------------
DELETE FROM producers WHERE kind = 'OLIVE_MILL';
ALTER TABLE producers DROP COLUMN kind;

UPDATE producers
SET specialty   = 'Moscatel de Alejandría, seco y dulce',
    description = 'Viñedo familiar en laderas de pizarra sobre el mar, vendimiado a mano. Su Moscatel seco es puro azahar y brisa salina.'
WHERE slug = 'vinas-de-la-cuesta';

UPDATE producers
SET specialty   = 'Tintos de altura',
    description = 'Una pequeña bodega a 750 m que elabora tintos estructurados de Tempranillo, Syrah y Petit Verdot, con noches frescas y maduración lenta.'
WHERE slug = 'bodega-tajo-alto';

UPDATE producers
SET specialty   = 'Pedro Ximénez dulce tradicional',
    description = 'Un lagar antiguo en los montes que rodean la ciudad, donde se asolean las uvas de Pedro Ximénez para los clásicos vinos dulces de Málaga.'
WHERE slug = 'lagar-montes-verdes';

INSERT INTO producers (slug, name, town, area, specialty, description) VALUES
('lomas-de-rome', 'Lomas de Romé', 'Moclinejo', 'Axarquía',
 'Romé, la uva tinta autóctona',
 'Rescatan viñas viejas de Romé, una variedad casi desaparecida, para elaborar rosados y tintos ligeros llenos de fruta.'),
('mirador-de-manilva', 'Bodega Mirador de Manilva', 'Manilva', 'Costa Occidental',
 'Moscatel junto al Mediterráneo',
 'Viñas a pocos kilómetros de la playa. Blancos secos de Moscatel, frescos y salinos, y un dulce de vendimia tardía.'),
('lagar-vega-norte', 'Lagar Vega Norte', 'Mollina', 'Norte de Málaga',
 'Rosados y tintos de la vega',
 'Una bodega familiar en la llanura del norte de la provincia, con rosados de Syrah y tintos jóvenes para el día a día.');

-- Taste profiles: drop everything that was about olive oil -----------------------------------------
DROP TABLE taste_profile_olive_varieties;
DROP TABLE taste_profile_oil_uses;
ALTER TABLE taste_profiles DROP COLUMN product_preference;
ALTER TABLE taste_profiles DROP COLUMN oil_intensity;
