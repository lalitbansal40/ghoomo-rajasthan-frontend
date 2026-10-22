/** Coordinate small header panels without coupling their business state. */
export const HEADER_PANEL = 'gr-header-panel';
export const openHeaderPanel = (name: string) => document.dispatchEvent(new CustomEvent(HEADER_PANEL, { detail: name }));
