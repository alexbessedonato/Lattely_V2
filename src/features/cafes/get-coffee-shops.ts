import { asc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { coffeeShops } from "@/db/schema";

export const DEFAULT_SEARCH_RADIUS_METERS = 2_000;

export const SEARCH_RADIUS_OPTIONS = [
  { value: "500", label: "500 m", meters: 500 },
  { value: "1000", label: "1 km", meters: 1_000 },
  { value: "2000", label: "2 km", meters: DEFAULT_SEARCH_RADIUS_METERS },
  { value: "5000", label: "5 km", meters: 5_000 },
  { value: "10000", label: "10 km", meters: 10_000 },
  { value: "anywhere", label: "Anywhere", meters: null },
] as const;

export const DEFAULT_SEARCH_RADIUS = SEARCH_RADIUS_OPTIONS[2];

export function getSearchRadius(value: unknown) {
  return (
    SEARCH_RADIUS_OPTIONS.find((option) => option.value === value) ??
    DEFAULT_SEARCH_RADIUS
  );
}

type CoffeeShopSearch =
  | { longitude: number; latitude: number; radiusMeters: number }
  | { radiusMeters: null };

export async function getCoffeeShops(search: CoffeeShopSearch) {
  const query = getDb()
    .select({ id: coffeeShops.id, name: coffeeShops.name })
    .from(coffeeShops);

  if (search.radiusMeters === null) {
    return query.orderBy(asc(coffeeShops.name));
  }

  const point = sql`ST_SetSRID(ST_MakePoint(${search.longitude}, ${search.latitude}), 4326)::geography`;

  return query
    .where(
      sql`ST_DWithin(${coffeeShops.location}, ${point}, ${search.radiusMeters})`,
    )
    .orderBy(asc(coffeeShops.name));
}
