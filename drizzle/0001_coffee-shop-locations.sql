CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "coffee_shops" ADD COLUMN "location" geography(Point, 4326);

UPDATE "coffee_shops"
SET "location" = ST_SetSRID(ST_MakePoint(2.156, 41.403), 4326)::geography
WHERE "id" = 'gracia-test-sample-cafe';

UPDATE "coffee_shops"
SET "location" = ST_SetSRID(ST_MakePoint(2.1798, 41.403), 4326)::geography
WHERE "id" = 'lattely-test-coffee';

ALTER TABLE "coffee_shops" ALTER COLUMN "location" SET NOT NULL;
