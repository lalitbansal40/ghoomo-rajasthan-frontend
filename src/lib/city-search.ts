import type { City } from "./api";

/** Search the server-owned city catalog and keep the interactive list small. */
export function searchCities(
  cities: City[],
  query: string,
  limit = 12,
  cityLabel: (city: City) => string = (city) => city.label,
): City[] {
  const needle = query.trim().toLocaleLowerCase("en-IN");
  if (needle.length < 2 || limit <= 0) return [];

  return cities
    .map((city, order) => ({
      city,
      order,
      label:
        `${cityLabel(city)} ${city.label} ${city.state ?? ""} ${city.name.replace(/_/g, " ")}`.toLocaleLowerCase(
          "en-IN",
        ),
      prefix: `${cityLabel(city)} ${city.state ?? ""}`
        .toLocaleLowerCase("en-IN")
        .startsWith(needle),
    }))
    .filter((item) => item.label.includes(needle))
    .sort((a, b) => Number(b.prefix) - Number(a.prefix) || a.order - b.order)
    .slice(0, limit)
    .map((item) => item.city);
}
