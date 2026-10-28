-- Private deterministic sample data for the isolated Neon branch.
INSERT INTO public.coffee_shops (id, name)
VALUES
  ('gracia-test-sample-cafe', 'Gràcia Test Sample Café'),
  ('lattely-test-coffee', 'Lattely Test Coffee')
ON CONFLICT (id) DO NOTHING;
