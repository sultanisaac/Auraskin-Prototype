import { Metadata } from 'next';
import { getProducts } from '@/app/admin/product/actions';
import StoreClient from './StoreClient';

export const revalidate = 0; // Disable cache so products show up immediately

export const metadata: Metadata = {
  title: 'Auraskin Store - Premium Medical Aesthetic Skincare',
  description: 'Shop our exclusive range of premium skincare products, tailored for every skin type. Fast shipping across Indonesia.',
  openGraph: {
    title: 'Auraskin Store - Premium Skincare',
    description: 'Shop our exclusive range of premium skincare products.',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop'],
    type: 'website',
  },
};

export default async function StorePage() {
  const products = await getProducts();

  return (
    <StoreClient initialProducts={products} />
  );
}
