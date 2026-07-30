/*
  FORMATTING UTILITIES
  
  Pure functions that transform data for display.
  They never modify the original data — they return new strings.
*/

/** Format a rating number to one decimal place */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Truncate text to a maximum length with ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/** Format episode count display */
export function formatEpisodeCount(
  current?: number,
  total?: number
): string {
  if (current && total) return `${current}/${total} EP`;
  if (total) return `${total} EP`;
  if (current) return `${current} EP`;
  return "? EP";
}

/** Format year and season */
export function formatSeason(season?: string, year?: number): string {
  if (season && year) return `${season} ${year}`;
  if (year) return `${year}`;
  if (season) return season;
  return "TBA";
}

/** Get color class based on rating value */
export function getRatingColor(rating: number): string {
  if (rating >= 8.5) return "text-green-400";
  if (rating >= 7.0) return "text-yellow-400";
  if (rating >= 5.0) return "text-orange-400";
  return "text-red-400";
}

/** Get background color class for rating badge */
export function getRatingBgColor(rating: number): string {
  if (rating >= 8.5) return "bg-green-500/20 text-green-400";
  if (rating >= 7.0) return "bg-yellow-500/20 text-yellow-400";
  if (rating >= 5.0) return "bg-orange-500/20 text-orange-400";
  return "bg-red-500/20 text-red-400";
}
