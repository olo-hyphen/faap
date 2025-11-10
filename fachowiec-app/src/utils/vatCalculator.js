/**
 * Calculate VAT and totals from items
 * @param {Array} items - Array of items with quantity, rate (price per unit)
 * @param {number} taxRate - VAT rate (default 23%)
 * @returns {Object} Calculated totals
 */
export function calculateTotals(items = [], taxRate = 23) {
  // Calculate subtotal (sum of all item totals)
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = (item.quantity || 0) * (item.rate || 0);
    return sum + itemTotal;
  }, 0);

  // Calculate tax
  const tax = subtotal * (taxRate / 100);

  // Calculate total (subtotal + tax)
  const total = subtotal + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    taxRate,
  };
}

/**
 * Calculate totals from gross amount (reverse calculation)
 * @param {number} grossAmount - Gross amount (with VAT)
 * @param {number} taxRate - VAT rate (default 23%)
 * @returns {Object} Calculated totals
 */
export function calculateFromGross(grossAmount, taxRate = 23) {
  const subtotal = grossAmount / (1 + taxRate / 100);
  const tax = grossAmount - subtotal;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(grossAmount * 100) / 100,
    taxRate,
  };
}

/**
 * Calculate totals from net amount
 * @param {number} netAmount - Net amount (without VAT)
 * @param {number} taxRate - VAT rate (default 23%)
 * @returns {Object} Calculated totals
 */
export function calculateFromNet(netAmount, taxRate = 23) {
  const tax = netAmount * (taxRate / 100);
  const total = netAmount + tax;

  return {
    subtotal: Math.round(netAmount * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
    taxRate,
  };
}
