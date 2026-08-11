"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/AdminHeader";
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import Image from 'next/image';
import { getProducts, saveProduct, deleteProduct, Product } from './actions';

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [justLongPressed, setJustLongPressed] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'serum',
    skin_type: 'all',
    volume_ml: '',
    image: ''
  });

  // Fetch from KV on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        skin_type: product.skin_type,
        volume_ml: product.volume_ml.toString(),
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', category: 'serum', skin_type: 'all', volume_ml: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const startPress = (id: string) => {
    const timer = setTimeout(() => {
      setJustLongPressed(true);
      if (!isSelectionMode) {
        setIsSelectionMode(true);
        setSelectedIds(new Set([id]));
      } else {
        toggleSelection(id);
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const cancelPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (isSelectionMode && selectedIds.size === 0 && !justLongPressed) {
      setIsSelectionMode(false);
    }
  }, [selectedIds, isSelectionMode, justLongPressed]);

  const handleProductClick = (e: React.MouseEvent | React.TouchEvent, product: Product) => {
    if (justLongPressed) {
      setJustLongPressed(false);
      return;
    }
    if (isSelectionMode) {
      toggleSelection(product.id);
    } else {
      handleOpenModal(product);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected product(s)?`)) {
      setIsLoading(true);
      await Promise.all(Array.from(selectedIds).map(id => deleteProduct(id)));
      await loadProducts();
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  const cancelSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if IMGBB API key is set
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || prompt("Please enter your IMGBB API Key for testing:");
    
    if (!apiKey) {
      alert("IMGBB API Key is required to upload images.");
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: data,
      });
      
      const result = await res.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.data.url }));
      } else {
        alert("Failed to upload image: " + result.error.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image to IMGBB.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : '',
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      skin_type: formData.skin_type,
      volume_ml: parseInt(formData.volume_ml) || 0,
      image: formData.image
    };

    const res = await saveProduct(newProduct);
    if (res.success) {
      await loadProducts();
      handleCloseModal();
    } else {
      alert(res.error || 'Failed to save product');
    }
  };

  // Legacy single delete (can keep if needed, but we use batch now)
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProduct(id);
      if (res.success) {
        await loadProducts();
      } else {
        alert(res.error || 'Failed to delete product');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.skin_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Products" subtitle="Manage your store products and catalog" pendingCount={0} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl border border-accent/20 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-primary">Catalog Overview</h2>
              <p className="text-sm text-text/60">You have {products.length} products in your store.</p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button variant="primary" onClick={() => handleOpenModal()} className="flex shrink-0 items-center gap-1.5 !py-2 !px-4 text-sm font-semibold rounded-lg">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </div>
          </div>

          {isSelectionMode && (
            <div className="flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
              <span className="font-medium text-sm">{selectedIds.size} selected</span>
              <div className="flex items-center gap-4">
                <button onClick={cancelSelection} className="text-gray-300 hover:text-white text-xs font-medium transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSelected} 
                  disabled={selectedIds.size === 0 || isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-accent/20 p-12 text-center text-gray-500 shadow-sm flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                <p className="font-medium text-gray-600">No products found.</p>
                {searchTerm && <p className="text-sm mt-1">Try adjusting your search.</p>}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative cursor-pointer select-none ${
                    selectedIds.has(product.id) ? 'ring-2 ring-primary border-transparent' : 'border border-accent/20'
                  }`}
                  onMouseDown={() => startPress(product.id)}
                  onMouseUp={cancelPress}
                  onMouseLeave={cancelPress}
                  onTouchStart={() => startPress(product.id)}
                  onTouchEnd={cancelPress}
                  onClick={(e) => handleProductClick(e, product)}
                >
                  <div className="relative aspect-[4/3] w-full bg-gray-50 border-b border-accent/10">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover pointer-events-none" />
                    ) : (
                      <ImageIcon className="w-8 h-8 m-auto text-gray-400 absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                    {/* Selection Checkmark */}
                    <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all z-10 ${
                      selectedIds.has(product.id) 
                        ? 'bg-primary text-white scale-100 shadow-md' 
                        : isSelectionMode 
                          ? 'bg-white/80 border-2 border-gray-300 text-transparent scale-100 shadow-sm'
                          : 'bg-black/20 text-transparent scale-0 group-hover:scale-100'
                    }`}>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm md:text-base text-text mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] md:text-xs font-semibold capitalize">
                        {product.category}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] md:text-xs font-medium capitalize">
                        {product.skin_type}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-accent/10 pt-3 mt-auto">
                      <p className="font-bold text-primary text-sm md:text-base">{formatPrice(product.price)}</p>
                      <p className="text-[10px] md:text-xs font-semibold text-text/40 tracking-wider uppercase">{product.volume_ml} ml</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-5 overflow-y-auto flex-1 custom-scrollbar">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Brightening Serum"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Price (IDR)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. 150000"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
                        >
                          <option value="serum">Serum</option>
                          <option value="moisturizer">Moisturizer</option>
                          <option value="toner">Toner</option>
                          <option value="cleanser">Cleanser</option>
                          <option value="bundle">Bundle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Skin Type</label>
                        <select 
                          value={formData.skin_type}
                          onChange={e => setFormData({...formData, skin_type: e.target.value})}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
                        >
                          <option value="all">All Types</option>
                          <option value="oily">Oily</option>
                          <option value="dry">Dry</option>
                          <option value="combination">Combination</option>
                          <option value="sensitive">Sensitive</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Volume (ml)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.volume_ml}
                        onChange={e => setFormData({...formData, volume_ml: e.target.value})}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center h-40 relative bg-gray-50 hover:bg-gray-100 transition-colors">
                      {formData.image ? (
                        <div className="absolute inset-0 w-full h-full p-2">
                          <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200">
                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                                Change Image
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          )}
                          <span className="text-sm font-medium text-gray-600">
                            {isUploading ? 'Uploading to IMGBB...' : 'Click to upload image'}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                      )}
                    </div>
                    {formData.image && (
                      <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                        ✓ Image uploaded successfully
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 md:p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal} type="button" className="!py-1.5 !px-4 text-sm font-medium">
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="productForm" disabled={isUploading} className="!py-1.5 !px-4 text-sm font-medium">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
