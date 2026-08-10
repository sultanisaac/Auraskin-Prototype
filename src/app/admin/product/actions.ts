'use server';

import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  skin_type: string;
  volume_ml: number;
  image: string;
  stock?: number;
  is_active?: boolean;
}

// Ensure basic products exist in KV for demo if empty
async function seedInitialProductsIfNeeded() {
  const existingCount = await kv.scard('products:set');
  if (existingCount === 0) {
    const INITIAL_PRODUCTS: Product[] = [
      { id: "1", name: "Auraskin Brightening Serum", price: 185000, category: "serum", skin_type: "all", volume_ml: 30, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop", stock: 100, is_active: true },
      { id: "2", name: "Auraskin Hydra Moisturizer", price: 165000, category: "moisturizer", skin_type: "dry", volume_ml: 50, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop", stock: 100, is_active: true },
      { id: "3", name: "Auraskin Pore Toner", price: 145000, category: "toner", skin_type: "oily", volume_ml: 100, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop", stock: 100, is_active: true },
      { id: "4", name: "Auraskin Glow Bundle", price: 420000, category: "bundle", skin_type: "combination", volume_ml: 180, image: "https://images.unsplash.com/photo-1615397323214-72b22036c0a0?q=80&w=600&auto=format&fit=crop", stock: 100, is_active: true }
    ];

    for (const p of INITIAL_PRODUCTS) {
      await kv.sadd('products:set', p.id);
      await kv.set(`product:${p.id}`, p);
    }
  }
}

export async function getProducts() {
  try {
    await seedInitialProductsIfNeeded();
    
    const productIds = await kv.smembers('products:set');
    const products: Product[] = [];
    
    if (productIds && productIds.length > 0) {
      for (const id of productIds) {
        const product = await kv.get(`product:${id}`);
        if (product) {
          products.push(product as Product);
        }
      }
    }
    
    // Sort by name for consistency
    return products.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function saveProduct(product: Product) {
  try {
    // If it's new, give it a timestamp ID
    if (!product.id || product.id === '') {
      product.id = Date.now().toString();
    }
    
    await kv.sadd('products:set', product.id);
    await kv.set(`product:${product.id}`, product);
    
    revalidatePath('/admin/product');
    revalidatePath('/store');
    
    return { success: true, product };
  } catch (error) {
    console.error('Error saving product:', error);
    return { success: false, error: 'Failed to save product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await kv.srem('products:set', id);
    await kv.del(`product:${id}`);
    
    revalidatePath('/admin/product');
    revalidatePath('/store');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}
