/**
 * Formats a number as Indian Rupees with Cr/L shorthand.
 */
export function formatPrice(price: number): string {
  if (price >= 10_000_000) return `\u20B9${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `\u20B9${(price / 100_000).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats area with unit display.
 */
export function formatArea(area: number, unit: string): string {
  const unitDisplay: Record<string, string> = {
    acres: 'Acres',
    sq_ft: 'Sq.Ft',
    cents: 'Cents',
    hectares: 'Ha',
  };
  return `${area} ${unitDisplay[unit] ?? unit}`;
}

/**
 * Truncates a MongoDB ObjectId for display.
 */
export function shortId(id: string): string {
  return id.slice(-6).toUpperCase();
}
