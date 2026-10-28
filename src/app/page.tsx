import { connection } from "next/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_SEARCH_RADIUS_METERS,
  getCoffeeShopsNearPoint,
} from "@/features/cafes/get-coffee-shops";
import { getNeighborhood, neighborhoods } from "@/features/cafes/neighborhoods";

export default async function Home({ searchParams }: PageProps<"/">) {
  await connection();

  const { neighborhood } = await searchParams;
  const selectedNeighborhood = getNeighborhood(neighborhood);

  let shops;
  try {
    shops = await getCoffeeShopsNearPoint(
      selectedNeighborhood.longitude,
      selectedNeighborhood.latitude,
    );
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

      <form
        action="/"
        method="get"
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="neighborhood" className="text-sm font-medium">
            Barcelona neighborhood
          </label>
          <select
            id="neighborhood"
            name="neighborhood"
            defaultValue={selectedNeighborhood.id}
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood.id} value={neighborhood.id}>
                {neighborhood.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Show nearby shops
        </button>
      </form>

      <h2 className="mt-8 text-xl font-semibold">
        Coffee shops within {DEFAULT_SEARCH_RADIUS_METERS / 1000} km of{" "}
        {selectedNeighborhood.name}
      </h2>

      {shops === null ? (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Could not load coffee shops</AlertTitle>
          <AlertDescription>
            Please try again in a little while.
          </AlertDescription>
        </Alert>
      ) : shops.length === 0 ? (
        <Alert role="status" className="mt-8">
          <AlertTitle>
            No coffee shops within {DEFAULT_SEARCH_RADIUS_METERS / 1000} km of{" "}
            {selectedNeighborhood.name}
          </AlertTitle>
          <AlertDescription>
            Try another neighborhood to see nearby specialty coffee shops.
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
