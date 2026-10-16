/** One route's words, in both languages. */
export interface RouteText {
  en: RouteWords;
  hi: RouteWords;
  /** Slugs of the tour packages this road is part of (content/packages). */
  packages?: string[];
}
export interface RouteWords {
  /** Two or three short paragraphs, Ghoomo's voice. */
  intro: string[];
  /** Places worth a stop — only ones really on this road. */
  onTheWay?: Array<{ name: string; line: string }>;
  /** One practical tip for this road. */
  tip?: string;
}
