import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sampleShop = {
  name: "Sample Coffee",
  neighborhood: "Gràcia",
  description:
    "Carefully sourced coffee, prepared as espresso and filter coffee.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      
      <h1 className="text-4xl font-semibold tracking-tight">Lattely</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Discover specialty coffee shops in Barcelona.
      </p>

      <Alert role="note" aria-labelledby="development-notice" className="mt-6">
        <AlertTitle id="development-notice" className="line-clamp-none">
          Private development · Sample data
        </AlertTitle>
        <AlertDescription>
          This fictional shop is for testing Lattely.
        </AlertDescription>
      </Alert>

      <article aria-labelledby="sample-shop-name" className="mt-8">
        <Card>
          <CardHeader>
            <Badge variant="secondary">Fictional sample shop</Badge>
            <CardTitle className="text-2xl">
              <h2 id="sample-shop-name">{sampleShop.name}</h2>
            </CardTitle>
            <CardDescription>
              <p>{sampleShop.neighborhood}, Barcelona</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{sampleShop.description}</p>
          </CardContent>
        </Card>
      </article>

    </main>
  );
}
