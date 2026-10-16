/**
 * Ghoomo Rajasthan's tour packages.
 *
 * SAMPLE — owner's decision (16 Oct 2026): dummy packages now, the real ones from the team
 * later (docs/content-template). The six names, routes and prices are hellomycabs.com's
 * sample set (src/content/rajasthan); the day plans are written here. While this is true every
 * package page is noindex, out of the sitemap, and every price carries a "Sample" badge — a
 * made-up price must never be what a search engine or a customer takes as ours.
 * It goes false in the very commit that brings the real packages.
 *
 * ⚠️ Nothing guessed: a place named here is really on that road, a season is the commonly
 * published one. Where in doubt, the line is left out rather than written.
 */
export const PACKAGES_ARE_SAMPLE = true;

export type Car = 'Dzire' | 'Ertiga' | 'Innova Crysta';

export interface DayPlan {
  day: number;
  title: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  /** Where the night is spent. */
  stay?: string;
}

export interface TourPackage {
  slug: string;
  name: string;
  days: number;
  nights: number;
  startsFrom: string;
  endsAt: string;
  /** The places, in order. */
  route: string[];
  /** Per car, "from" — SAMPLE while PACKAGES_ARE_SAMPLE is true. */
  fromRupees: { vehicle: Car; rupees: number }[];
  includes: string[];
  excludes: string[];
  bestMonths: string;
  goodFor: string[];
  highlights: string[];
  itinerary: DayPlan[];
  /** A key in content/photos.ts. */
  photo: string;
}

const price = (dzire: number, ertiga: number, crysta: number): TourPackage['fromRupees'] => [
  { vehicle: 'Dzire', rupees: dzire },
  { vehicle: 'Ertiga', rupees: ertiga },
  { vehicle: 'Innova Crysta', rupees: crysta },
];

/**
 * What every package covers, and what it does not — the same rule as every trip booked with
 * Hello My Cab (hellomycabs.com's TOUR_INCLUDED / TOUR_NOT_INCLUDED), so the two brands never
 * promise different things for the same car.
 */
export const INCLUDES = [
  'The car and the driver for every day of the tour',
  'Fuel',
  "The driver's allowance and his stay",
];
export const EXCLUDES = [
  'GST, 5% on top of the fare',
  'Hotels and meals',
  'Entry tickets, guides and safari permits',
  'Toll, parking and state tax, as they arise',
];

export const PACKAGES: TourPackage[] = [
  {
    slug: 'jaipur-pink-city-weekend',
    name: 'Jaipur Pink City Weekend',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Amer Fort', 'Jaigarh', 'Nahargarh', 'City Palace', 'Hawa Mahal', 'Jal Mahal'],
    fromRupees: price(4999, 5999, 7999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['Families', 'Couples', 'A first visit to Rajasthan'],
    highlights: [
      'Amer Fort early, before the heat and the crowds',
      'Sunset over the old city from Nahargarh',
      'The walled city on foot while the car waits',
      'Pickup from your hotel, the station or the airport',
    ],
    itinerary: [
      {
        day: 1,
        title: 'The forts on the hills',
        morning: 'Amer Fort — the Sheesh Mahal and the courtyards, with the town below.',
        afternoon: 'Jaigarh, the fort above Amer, and a stop at Jal Mahal in Man Sagar lake.',
        evening: 'Up to Nahargarh for the sunset over Jaipur.',
        stay: 'Jaipur',
      },
      {
        day: 2,
        title: 'The walled city',
        morning: 'City Palace and Jantar Mantar, side by side in the old city.',
        afternoon: 'Hawa Mahal from the street, then the bazaars of the Pink City.',
        evening: 'Dropped at your hotel, the station or the airport.',
      },
    ],
    photo: 'jaipur-hawa-mahal',
  },
  {
    slug: 'ajmer-pushkar-darshan',
    name: 'Ajmer–Pushkar Darshan',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Ajmer', 'Pushkar', 'Jaipur'],
    fromRupees: price(5499, 6499, 8499),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['Pilgrims', 'Families', 'Short breaks'],
    highlights: [
      'Ajmer Sharif Dargah and Ana Sagar lake',
      'The Brahma temple and the ghats of Pushkar lake',
      'The evening aarti at Pushkar',
      'Back in Jaipur on the second evening',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Ajmer and Pushkar',
        morning: 'Leave Jaipur after breakfast for Ajmer.',
        afternoon: 'Ajmer Sharif Dargah, then the lakeside of Ana Sagar.',
        evening: 'On to Pushkar — the aarti at the ghats of Pushkar lake.',
        stay: 'Pushkar',
      },
      {
        day: 2,
        title: 'Pushkar, and back to Jaipur',
        morning: 'The Brahma temple and the lanes around the lake.',
        afternoon: 'The drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'pushkar-ghats',
  },
  {
    slug: 'lakes-and-forts',
    name: 'Lakes & Forts',
    days: 5,
    nights: 4,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Chittorgarh', 'Udaipur', 'Kumbhalgarh', 'Jaipur'],
    fromRupees: price(17999, 21999, 27999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'September to March',
    goodFor: ['Families', 'History lovers', 'Couples'],
    highlights: [
      'Chittorgarh, one of the largest forts in India',
      'Udaipur — the City Palace and a boat on Lake Pichola',
      'The long walls of Kumbhalgarh',
      'One car and one driver for all five days',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Chittorgarh',
        morning: 'An early start south from Jaipur.',
        afternoon: 'Chittorgarh Fort — Vijay Stambh and the palace of Rana Kumbha.',
        stay: 'Chittorgarh',
      },
      {
        day: 2,
        title: 'Chittorgarh to Udaipur',
        morning: 'The drive to Udaipur.',
        afternoon: 'The City Palace above Lake Pichola.',
        evening: 'A boat on Lake Pichola at sunset.',
        stay: 'Udaipur',
      },
      {
        day: 3,
        title: 'Udaipur',
        morning: 'Saheliyon ki Bari and Fateh Sagar lake.',
        afternoon: 'Jagdish temple and the old city lanes by the lake.',
        evening: 'Free in Udaipur.',
        stay: 'Udaipur',
      },
      {
        day: 4,
        title: 'Kumbhalgarh',
        morning: 'Into the Aravalli hills to Kumbhalgarh.',
        afternoon: 'The fort and its walls, which run for kilometres over the hills.',
        stay: 'Kumbhalgarh',
      },
      {
        day: 5,
        title: 'Back to Jaipur',
        morning: 'The long drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'chittorgarh-vijay-stambh',
  },
  {
    slug: 'royal-rajasthan-circuit',
    name: 'Royal Rajasthan Circuit',
    days: 7,
    nights: 6,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur', 'Jaipur'],
    fromRupees: price(27999, 33999, 42999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to March',
    goodFor: ['A first long trip to Rajasthan', 'Families', 'Groups'],
    highlights: [
      'Mehrangarh Fort over the blue city of Jodhpur',
      'An evening on the dunes near Jaisalmer',
      'The lakes and palaces of Udaipur',
      'A driver who knows the whole circuit',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Jodhpur',
        morning: 'West from Jaipur to Jodhpur.',
        evening: 'The clock tower market in the old city.',
        stay: 'Jodhpur',
      },
      {
        day: 2,
        title: 'Jodhpur',
        morning: 'Mehrangarh Fort, high above the blue houses.',
        afternoon: 'Jaswant Thada, then Umaid Bhawan from outside.',
        stay: 'Jodhpur',
      },
      {
        day: 3,
        title: 'Jodhpur to Jaisalmer',
        morning: 'Into the Thar, to Jaisalmer.',
        evening: 'Gadisar lake at sunset.',
        stay: 'Jaisalmer',
      },
      {
        day: 4,
        title: 'Jaisalmer and the dunes',
        morning: 'Jaisalmer Fort — a fort people still live in — and the havelis.',
        afternoon: 'Out to the Sam sand dunes.',
        evening: 'Sunset on the dunes; a camel ride if you like (paid there).',
        stay: 'Jaisalmer',
      },
      {
        day: 5,
        title: 'Jaisalmer to Udaipur',
        morning: 'A long drive, the longest of the tour — an early start.',
        evening: 'Arrive in Udaipur.',
        stay: 'Udaipur',
      },
      {
        day: 6,
        title: 'Udaipur',
        morning: 'The City Palace.',
        afternoon: 'Saheliyon ki Bari and Fateh Sagar lake.',
        evening: 'A boat on Lake Pichola.',
        stay: 'Udaipur',
      },
      {
        day: 7,
        title: 'Back to Jaipur',
        morning: 'Udaipur to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'jodhpur-mehrangarh',
  },
  {
    slug: 'ranthambore-wildlife',
    name: 'Ranthambore Wildlife',
    days: 2,
    nights: 1,
    startsFrom: 'Jaipur',
    endsAt: 'Jaipur',
    route: ['Jaipur', 'Sawai Madhopur (Ranthambore)', 'Jaipur'],
    fromRupees: price(5999, 6999, 8999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'October to June (the park closes for the monsoon)',
    goodFor: ['Wildlife lovers', 'Families', 'Photographers'],
    highlights: [
      'Dropped at the gate for the morning or the afternoon safari',
      'Ranthambore Fort, inside the park',
      'Back in Jaipur the next evening',
      'Safari permits are booked by you, on the forest department site',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Jaipur to Ranthambore',
        morning: 'Jaipur to Sawai Madhopur.',
        afternoon: 'Dropped at the park for the afternoon safari (your permit).',
        stay: 'Sawai Madhopur',
      },
      {
        day: 2,
        title: 'Safari and back',
        morning: 'The morning safari (your permit), or Ranthambore Fort.',
        afternoon: 'The drive back to Jaipur.',
        evening: 'Dropped at your hotel, home, the station or the airport.',
      },
    ],
    photo: 'ranthambore-fort',
  },
  {
    slug: 'udaipur-mount-abu',
    name: 'Udaipur–Mount Abu',
    days: 3,
    nights: 2,
    startsFrom: 'Udaipur',
    endsAt: 'Udaipur',
    route: ['Udaipur', 'Mount Abu', 'Udaipur'],
    fromRupees: price(8999, 10999, 13999),
    includes: INCLUDES,
    excludes: EXCLUDES,
    bestMonths: 'All year — a cool break from the plains in summer',
    goodFor: ['Families', 'Couples', 'Summer holidays'],
    highlights: [
      'The Dilwara Jain temples',
      'Nakki lake and Sunset Point',
      'The only hill station in Rajasthan',
      'Starts and ends in Udaipur',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Udaipur to Mount Abu',
        morning: 'Up into the hills to Mount Abu.',
        evening: 'Sunset Point, then the evening by Nakki lake.',
        stay: 'Mount Abu',
      },
      {
        day: 2,
        title: 'Mount Abu',
        morning: 'The Dilwara temples — the marble carving is the reason to come.',
        afternoon: 'Guru Shikhar, the highest point of the Aravallis.',
        evening: 'A boat on Nakki lake.',
        stay: 'Mount Abu',
      },
      {
        day: 3,
        title: 'Back to Udaipur',
        morning: 'Down the hill to Udaipur.',
        evening: 'Dropped at your hotel, the station or the airport.',
      },
    ],
    photo: 'mount-abu-nakki',
  },
];

export const packageBySlug = (slug: string) => PACKAGES.find((p) => p.slug === slug) ?? null;
