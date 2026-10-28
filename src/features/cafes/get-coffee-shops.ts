import { asc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { coffeeShops } from "@/db/schema";

export const DEFAULT_SEARCH_RADIUS_METERS = 2_000;

export async function getCoffeeShopsNearPoint(
  longitude: number,
  latitude: number,
) {
  const point = sql`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`;

  return getDb()
    .select({ id: coffeeShops.id, name: coffeeShops.name })
    .from(coffeeShops)
    .where(
      sql`ST_DWithin(${coffeeShops.location}, ${point}, ${DEFAULT_SEARCH_RADIUS_METERS})`,
    )
    .orderBy(asc(coffeeShops.name));
}
