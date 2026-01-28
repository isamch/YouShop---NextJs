import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * تحويل السعر من string أو number إلى string منسق
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return (numPrice || 0).toFixed(2);
}

/**
 * الحصول على الصورة الأولى من images array أو استخدام image
 */
export function getProductImage(product: any): string {
  if (!product) return '/placeholder.svg';

  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    let firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      if (firstImage.startsWith('{')) firstImage = firstImage.substring(1);
      if (firstImage.endsWith('}')) firstImage = firstImage.substring(0, firstImage.length - 1);
      return firstImage;
    }
  }

  return product.image || '/placeholder.svg';
}
