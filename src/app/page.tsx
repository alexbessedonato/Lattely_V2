import { connection } from "next/server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCoffeeShops,
  getSearchRadius,
  SEARCH_RADIUS_OPTIONS,
} from "@/features/cafes/get-coffee-shops";
import { getNeighborhood, neighborhoods } from "@/features/cafes/neighborhoods";

export default async function Home({ searchParams }: PageProps<"/">) {
  await connection();

  const { neighborhood, radius: radiusParam } = await searchParams;
  const selectedNeighborhood = getNeighborhood(neighborhood);
  const selectedRadius = getSearchRadius(radiusParam);

  let shops;
  try {
    shops = await getCoffeeShops(
      selectedRadius.meters === null
        ? { radiusMeters: null }
        : {
            longitude: selectedNeighborhood.longitude,
            latitude: selectedNeighborhood.latitude,
            radiusMeters: selectedRadius.meters,
          },
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
          <Select name="neighborhood" defaultValue={selectedNeighborhood.id}>
            <SelectTrigger id="neighborhood">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="search-radius" className="text-sm font-medium">
            Search radius
          </label>
          <Select name="radius" defaultValue={selectedRadius.value}>
            <SelectTrigger id="search-radius">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEARCH_RADIUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Show coffee shops</Button>
      </form>

      <h2 className="mt-8 text-xl font-semibold">
        {selectedRadius.meters === null
          ? "All listed specialty coffee shops in Barcelona"
          : `Coffee shops within ${selectedRadius.label} of ${selectedNeighborhood.name}`}
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
            {selectedRadius.meters === null
              ? "No specialty coffee shops are listed in Barcelona yet"
              : `No coffee shops within ${selectedRadius.label} of ${selectedNeighborhood.name}`}
          </AlertTitle>
          <AlertDescription>
            {selectedRadius.meters === null
              ? "Try again in a little while."
              : "Try another neighborhood or a wider search radius to see nearby specialty coffee shops."}
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
