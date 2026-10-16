/**
 * Every short piece of interface text, in English. hi.ts must have every key (its type is
 * built from this one, so a missing key fails the build). No component writes user-facing
 * text of its own — it reads it from here.
 */
export const en = {
  brand: {
    name: 'Ghoomo Rajasthan',
    tagline: 'Tours across Rajasthan with a car and a driver who knows the road.',
    aHelloMyCabCompany: 'A Hello My Cab company',
    logoAlt: 'Ghoomo Rajasthan',
    home: 'Ghoomo Rajasthan — home',
  },
  nav: {
    label: 'Main',
    packages: 'Packages',
    destinations: 'Destinations',
    cab: 'Cab',
    desertSafari: 'Desert Safari',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    soon: 'Soon',
  },
  cta: {
    whatsapp: 'WhatsApp karo',
    call: 'Call karo',
    bookNow: 'Book now',
    view: 'View',
    viewPackage: 'See the tour',
    payNow: 'Pay now',
    planTrip: 'Plan my trip',
    whatsappMessage: 'Namaste, Ghoomo Rajasthan ke tour ke baare me jaanna hai',
  },
  pkg: {
    days: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`,
    nights: (n: number) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    daysNightsShort: (d: number, n: number) => `${d}D / ${n}N`,
    startsFrom: 'Starts from',
    from: 'from',
    sample: 'Sample',
    samplePrice: 'Sample price',
    gstExtra: '+ 5% GST',
    includes: 'Included',
    excludes: 'Not included',
    bestTime: 'Best time',
    goodFor: 'Good for',
    itinerary: 'Day by day',
    day: (n: number) => `Day ${n}`,
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    stay: 'Night in',
    more: (n: number) => `+${n} more`,
    packagesCount: (n: number) => `${n} ${n === 1 ? 'tour' : 'tours'}`,
    km: (n: number) => `${n} km`,
    popular: 'Popular',
    new: 'New',
  },
  form: {
    name: 'Your name',
    phone: 'Mobile number',
    phoneHelp: '10 digits — we send the booking details here',
    date: 'Date',
    people: 'People',
    message: 'Anything we should know',
    select: 'Choose',
    required: 'required',
    errRequired: 'Please fill this in',
    errPhone: 'Please enter a 10-digit mobile number',
    errDate: 'Please choose a date from today on',
    decrease: 'Fewer',
    increase: 'More',
  },
  state: {
    loading: 'Just a moment…',
    loadingBooking: 'Your booking is on its way…',
    empty: 'Nothing here yet',
    error: 'Something went wrong',
    retry: 'Try again',
    dismiss: 'Close',
  },
  common: {
    comingSoon: 'Coming soon',
    photoBy: 'Photo',
    credits: 'Photo credits',
    breadcrumb: 'Breadcrumb',
    rating: (r: number) => `${r} out of 5`,
    notFoundTitle: 'This road does not lead anywhere',
    notFoundBody: 'The page you were looking for is not here. Let us help you find your way.',
    goHome: 'Go to the home page',
    errorTitle: 'Something went wrong',
    errorBody: 'Something went wrong on our side. Please try again.',
    explore: 'Explore',
    company: 'Company',
    legal: 'Legal',
    privacy: 'Privacy',
    terms: 'Terms',
    refund: 'Refund',
    talkToUs: 'Talk to us',
  },
  lang: {
    label: 'Language',
    switchTo: 'हिंदी में पढ़ें',
    short: 'हिं',
    current: 'EN',
  },
} as const;

/** The shape every language must fill: the same keys, strings where English has strings. */
type Widen<T> = T extends (...a: infer A) => string
  ? (...a: A) => string
  : T extends string
    ? string
    : { [K in keyof T]: Widen<T[K]> };
export type Dictionary = Widen<typeof en>;
