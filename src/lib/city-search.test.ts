import assert from "node:assert/strict";
import test from "node:test";
import { searchCities } from "./city-search.ts";
import type { City } from "./api";

const cities: City[] = [
  {
    name: "JAIPUR",
    label: "Jaipur",
    state: "Rajasthan",
    hill: false,
    lat: 26.9,
    lng: 75.8,
  },
  {
    name: "JODHPUR",
    label: "Jodhpur",
    state: "Rajasthan",
    hill: false,
    lat: 26.2,
    lng: 73.0,
  },
  {
    name: "JAIPUR_RURAL",
    label: "Jaipur Rural",
    state: "Rajasthan",
    hill: false,
    lat: 26.8,
    lng: 75.7,
  },
  {
    name: "DELHI",
    label: "Delhi",
    state: "Delhi",
    hill: false,
    lat: 28.6,
    lng: 77.2,
  },
];

test("city search finds labels and returns prefix matches first", () => {
  assert.deepEqual(
    searchCities(cities, "jai").map((city) => city.name),
    ["JAIPUR", "JAIPUR_RURAL"],
  );
});

test("city search can match the backend state and normalized city key", () => {
  assert.deepEqual(
    searchCities(cities, "rajasthan").map((city) => city.name),
    ["JAIPUR", "JODHPUR", "JAIPUR_RURAL"],
  );
  assert.equal(searchCities(cities, "rural")[0]?.name, "JAIPUR_RURAL");
});

test("city search does not show thousands of results or accept one-character noise", () => {
  assert.deepEqual(searchCities(cities, "j"), []);
  assert.equal(
    searchCities([...cities, ...cities, ...cities], "ja", 2).length,
    2,
  );
});
