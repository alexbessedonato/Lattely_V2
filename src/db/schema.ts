import { pgTable, text } from "drizzle-orm/pg-core";

export const coffeeShops = pgTable("coffee_shops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
