// Curated search anchors near each area's center, as [longitude, latitude] in WGS 84.
export const neighborhoods = [
  {
    id: "vila-de-gracia",
    name: "Vila de Gràcia",
    longitude: 2.156,
    latitude: 41.403,
  },
  {
    id: "dreta-de-leixample",
    name: "Dreta de l’Eixample",
    longitude: 2.165,
    latitude: 41.39,
  },
  {
    id: "sants",
    name: "Sants",
    longitude: 2.134,
    latitude: 41.375,
  },
] as const;

export function getNeighborhood(id: unknown) {
  return (
    neighborhoods.find((neighborhood) => neighborhood.id === id) ??
    neighborhoods[0]
  );
}
