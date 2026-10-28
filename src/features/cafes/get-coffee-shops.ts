import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { coffeeShops } from "@/db/schema";

export async function getCoffeeShops() {
  return getDb().select().from(coffeeShops).orderBy(asc(coffeeShops.name));
}
