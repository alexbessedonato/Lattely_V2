-- Private deterministic sample data for the isolated Neon branch.
INSERT INTO public.coffee_shops (id, name, location)
VALUES
  (
    'gracia-test-sample-cafe',
    'Gràcia Test Sample Café',
    ST_SetSRID(ST_MakePoint(2.156, 41.403), 4326)::geography
  ),
  (
    'lattely-test-coffee',
    'Lattely Test Coffee',
    ST_SetSRID(ST_MakePoint(2.1798, 41.403), 4326)::geography
  ),
  (
    'outside-radius-test-cafe',
    'Outside Radius Test Café',
    ST_SetSRID(ST_MakePoint(2.1802, 41.403), 4326)::geography
  )
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, location = EXCLUDED.location;
