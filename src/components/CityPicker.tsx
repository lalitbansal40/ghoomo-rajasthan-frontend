"use client";

import { useId, useState } from "react";
import type { City } from "@/lib/api";
import { searchCities } from "@/lib/city-search";

type Props = {
  label: string;
  placeholder: string;
  cities: City[];
  value: string;
  cityLabel: (city: City) => string;
  onChange: (cityKey: string) => void;
};

const field =
  "min-h-12 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal";

export function CityPicker({
  label,
  placeholder,
  cities,
  value,
  cityLabel,
  onChange,
}: Props) {
  const listId = useId();
  const selected = cities.find((city) => city.name === value);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const results = searchCities(cities, query, 12, cityLabel);
  const display = query || (selected ? cityLabel(selected) : "");

  function choose(city: City) {
    onChange(city.name);
    setQuery("");
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setOpen(true);
      setActive((current) => (current + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setOpen(true);
      setActive((current) =>
        current < 0
          ? results.length - 1
          : (current - 1 + results.length) % results.length,
      );
      return;
    }
    if (event.key === "Enter" && open && results[active]) {
      event.preventDefault();
      choose(results[active]);
    }
  }

  return (
    <div className="relative flex flex-col gap-2 text-sm font-semibold">
      <label htmlFor={`${listId}-input`}>{label}</label>
      <input
        id={`${listId}-input`}
        className={field}
        type="search"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-option-${active}` : undefined
        }
        placeholder={placeholder}
        required
        value={display}
        onFocus={() => {
          if (query.length >= 2) setOpen(true);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(next.trim().length >= 2);
          setActive(-1);
          onChange("");
        }}
        onKeyDown={onKeyDown}
        onBlur={() => window.setTimeout(() => setOpen(false), 100)}
      />
      {open && results.length ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-ink/20 bg-white p-1 shadow-lg"
        >
          {results.map((city, index) => (
            <li key={city.name}>
              <button
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === active}
                className={`min-h-11 w-full rounded-md px-3 py-2 text-left font-normal hover:bg-royal/10 focus-visible:bg-royal/10 focus-visible:outline-2 focus-visible:outline-royal ${index === active ? "bg-royal/10" : ""}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(city)}
              >
                {cityLabel(city)}
                {city.state ? (
                  <span className="ml-2 text-muted">{city.state}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
