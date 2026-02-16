/**
 * Utility for managing the location list with Ahmedabad as the first option.
 * Ensures Ahmedabad appears first without duplication while preserving the order of other locations.
 */

const baseLocations = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Ahmedabad'];

/**
 * Returns a location list with Ahmedabad guaranteed to be first.
 * If Ahmedabad exists in the list, it's moved to the front; otherwise, it's added.
 * All other locations maintain their relative order.
 */
export function getOrderedLocations(): string[] {
  // Filter out Ahmedabad from the list
  const withoutAhmedabad = baseLocations.filter((loc) => loc !== 'Ahmedabad');
  
  // Return with Ahmedabad at the front
  return ['Ahmedabad', ...withoutAhmedabad];
}
