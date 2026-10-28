import { customType, pgTable, text } from "drizzle-orm/pg-core";

export const coffeeShops = pgTable("coffee_shops", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: customType<{ data: string; driverData: string }>({
    dataType: () => "geography(Point, 4326)",
  })("location").notNull(),
});
