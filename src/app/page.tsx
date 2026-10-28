import { asc } from "drizzle-orm";
import { connection } from "next/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/db";
import { coffeeShops } from "@/db/schema";

export default async function Home() {
  await connection();

  let shops;
  try {
    shops = await getDb()
      .select()
      .from(coffeeShops)
      .orderBy(asc(coffeeShops.name));
  } catch (error) {
    console.error("Failed to load coffee shops from the database.", error);
    shops = null;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Lattely</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Discover specialty coffee shops in Barcelona.
      </p>

      {shops === null ? (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Could not load coffee shops</AlertTitle>
          <AlertDescription>
            Please try again in a little while.
          </AlertDescription>
        </Alert>
      ) : shops.length === 0 ? (
        <Alert role="status" className="mt-8">
          <AlertTitle>No coffee shops yet</AlertTitle>
          <AlertDescription>
            Coffee shops will appear here when they are added.
          </AlertDescription>
        </Alert>
      ) : (
        <ul className="mt-8 space-y-4">
          {shops.map((shop) => (
            <li key={shop.id}>
              <article>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      <h2>{shop.name}</h2>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
