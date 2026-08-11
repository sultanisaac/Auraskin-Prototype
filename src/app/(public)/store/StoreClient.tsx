"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, Filter, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/app/admin/product/actions';

export default function StoreClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const navigate = (path: string | -1) => { if (path === -1) router.back(); else router.push(path); };

  const [activeCategory, setActiveCategory] = useState("all");
  const { addItem } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = activeCategory === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === activeCategory);

  const categories = ["all", "serum", "moisturizer", "toner", "cleanser", "bundle"];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Auraskin Store</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover our premium skincare collection tailored for your skin type. Glow from within with Auraskin.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors
                  ${activeCategory === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-primary/10 hover:text-primary border border-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap shrink-0 w-full md:w-auto text-left md:text-right">
            Showing {filteredProducts.length} products
          </div>
        </div>

        {/* Product Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">
                  {product.category}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs md:text-sm font-medium text-gray-700">5.0</span>
                  <span className="text-[10px] md:text-xs text-gray-400">(New)</span>
                </div>
                
                <h3 className="font-serif font-bold text-gray-900 text-sm md:text-base leading-tight mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3 mt-auto pt-2">
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] md:text-xs rounded font-medium capitalize">
                    {product.skin_type} skin
                  </span>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] md:text-xs rounded font-medium">
                    {product.volume_ml}ml
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 border-t border-gray-50 pt-3">
                  <div className="font-bold text-primary text-sm md:text-lg">
                    {formatPrice(product.price)}
                  </div>
                  {product.stock !== undefined && product.stock <= 0 ? (
                    <div className="py-1.5 px-3 text-xs md:text-sm w-full sm:w-auto rounded-xl flex items-center justify-center font-semibold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                      Out of Stock
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={() => addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        weight: 100, // Default weight or product.weight if available
                        quantity: 1
                      })}
                      className="py-1.5 px-3 text-xs md:text-sm w-full sm:w-auto rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Add</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
