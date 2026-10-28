const sampleShop = {
  name: "Sample Coffee",
  neighborhood: "Gràcia",
  description:
    "Carefully sourced coffee, prepared as espresso and filter coffee.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Lattely</h1>
      <p className="mt-4 text-lg text-stone-700">
        Discover specialty coffee shops in Barcelona.
      </p>
      <p className="mt-6 text-sm text-stone-600">
        Private development · Sample data
      </p>
      <article
        aria-labelledby="sample-shop-name"
        className="mt-8 rounded-xl border border-stone-200 bg-white p-6"
      >
        <p className="text-sm font-medium text-stone-600">
          Fictional sample shop
        </p>
        <h2
          id="sample-shop-name"
          className="mt-2 text-2xl font-semibold tracking-tight"
        >
          {sampleShop.name}
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          {sampleShop.neighborhood}, Barcelona
        </p>
        <p className="mt-4 leading-relaxed text-stone-700">
          {sampleShop.description}
        </p>
      </article>
    </main>
  );
}
