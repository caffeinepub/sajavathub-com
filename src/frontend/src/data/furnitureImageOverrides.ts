/**
 * Copyright-free image URLs for furniture products
 * All images are from Pexels with CC0 licenses allowing commercial use without attribution
 * 
 * Source references (Pexels photo pages):
 * - Sofa: https://www.pexels.com/photo/beige-3-seat-sofa-276528/
 * - Center Table: https://www.pexels.com/photo/a-cozy-living-room-with-green-couch-12474787/
 * - Dining Table: https://www.pexels.com/photo/gray-dining-table-under-pendant-lamps-3356416/
 * - Corner Table: https://www.pexels.com/photo/living-room-interior-with-furniture-and-flowers-in-vase-5825576/
 * - King Size Bed: https://www.pexels.com/photo/big-bed-in-a-bathroom-21345931/
 * - Queen Size Bed: https://www.pexels.com/photo/bedroom-interior-with-bed-near-pouf-6782577/
 * - Bed Side Tables: https://www.pexels.com/photo/white-table-lamp-on-top-of-nightstand-2082092/
 * - Dressing Tables: https://www.pexels.com/photo/interior-of-modern-room-with-square-mirror-6970071/
 * - Study Table: https://www.pexels.com/photo/white-and-black-desk-beside-bed-and-window-439227/
 * - Sofa Chairs: https://www.pexels.com/photo/pink-sofa-chair-near-white-curtains-7394471/
 * - Recliners: https://www.pexels.com/photo/two-pillows-on-white-leather-fainting-couch-276534/
 * - Crockery Unit: https://www.pexels.com/photo/collection-of-decorative-ceramics-on-display-shelf-32582413/
 */

import type { FurnitureSubCategory } from '../backend';

// Map of subcategory to copyright-free Pexels image URL (optimized for web display)
const FURNITURE_IMAGES: Record<FurnitureSubCategory, string> = {
  sofa: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=800',
  centerTable: 'https://images.pexels.com/photos/12474787/pexels-photo-12474787.jpeg?auto=compress&cs=tinysrgb&w=800',
  diningTable: 'https://images.pexels.com/photos/3356416/pexels-photo-3356416.jpeg?auto=compress&cs=tinysrgb&w=800',
  cornerTable: 'https://images.pexels.com/photos/5825576/pexels-photo-5825576.jpeg?auto=compress&cs=tinysrgb&w=800',
  kingSizeBed: 'https://images.pexels.com/photos/21345931/pexels-photo-21345931.jpeg?auto=compress&cs=tinysrgb&w=800',
  queenSizeBed: 'https://images.pexels.com/photos/6782577/pexels-photo-6782577.jpeg?auto=compress&cs=tinysrgb&w=800',
  bedSideTables: 'https://images.pexels.com/photos/2082092/pexels-photo-2082092.jpeg?auto=compress&cs=tinysrgb&w=800',
  dressingTable: 'https://images.pexels.com/photos/6970071/pexels-photo-6970071.jpeg?auto=compress&cs=tinysrgb&w=800',
  studyTable: 'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=800',
  sofaChairs: 'https://images.pexels.com/photos/7394471/pexels-photo-7394471.jpeg?auto=compress&cs=tinysrgb&w=800',
  recliners: 'https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=800',
  crockeryUnit: 'https://images.pexels.com/photos/32582413/pexels-photo-32582413.jpeg?auto=compress&cs=tinysrgb&w=800',
};

/**
 * Get a copyright-free image URL for a furniture subcategory
 */
export function getFurnitureImageUrl(subCategory: FurnitureSubCategory): string {
  return FURNITURE_IMAGES[subCategory] || '';
}

/**
 * Apply image overrides to products that have missing or empty imageUrl
 */
export function applyFurnitureImageOverrides<T extends { imageUrl: string }>(
  products: T[],
  subCategory: FurnitureSubCategory
): T[] {
  const overrideUrl = getFurnitureImageUrl(subCategory);
  
  return products.map((product) => {
    // Only override if imageUrl is empty, whitespace, or invalid
    if (!product.imageUrl || product.imageUrl.trim() === '') {
      return { ...product, imageUrl: overrideUrl };
    }
    return product;
  });
}
