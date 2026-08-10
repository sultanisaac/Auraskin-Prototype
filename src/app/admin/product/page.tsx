"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/AdminHeader";
import { Plus, Edit, Trash2, Image as ImageIcon, X, Upload } from 'lucide-react';
import { Button } from '@/components/Button';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  skin_type: string;
  volume_ml: number;
  image: string;
}

// Initial mock data for prototype
const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Auraskin Brightening Serum", price: 185000, category: "serum", skin_type: "all", volume_ml: 30, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop" },
  { id: "2", name: "Auraskin Hydra Moisturizer", price: 165000, category: "moisturizer", skin_type: "dry", volume_ml: 50, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop" }
];

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'serum',
    skin_type: 'all',
    volume_ml: '',
    image: ''
  });

  // Load from local storage on mount (simulate DB)
  useEffect(() => {
    const saved = localStorage.getItem('auraskin_admin_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse products from local storage");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('auraskin_admin_products', JSON.stringify(products));
  }, [products]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      skin_type: formData.skin_type,
      volume_ml: parseInt(formData.volume_ml) || 0,
      image: formData.image
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Products" subtitle="Manage your store products and catalog" pendingCount={0} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-accent/20 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-primary">Catalog Overview</h2>
              <p className="text-sm text-text/60">You have {products.length} products in your store.</p>
            </div>
            <Button variant="primary" onClick={() => handleOpenModal()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </div>

          <div className="bg-white border border-accent/20 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 text-primary text-sm border-b border-accent/20">
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Volume</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/10">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No products found. Add some to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-accent/5 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                              {product.image ? (
                                <Image src={product.image} alt={product.name} fill className="object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 m-auto text-gray-400 absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-text group-hover:text-primary transition-colors">{product.name}</p>
                              <p className="text-xs text-text/60 capitalize">{product.skin_type} Skin</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-text">
                          {formatPrice(product.price)}
                        </td>
                        <td className="p-4 text-text/80 text-sm">
                          {product.volume_ml} ml
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. Brightening Serum"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Price (IDR)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. 150000"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
                        >
                          <option value="serum">Serum</option>
                          <option value="moisturizer">Moisturizer</option>
                          <option value="toner">Toner</option>
                          <option value="cleanser">Cleanser</option>
                          <option value="bundle">Bundle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Skin Type</label>
                        <select 
                          value={formData.skin_type}
                          onChange={e => setFormData({...formData, skin_type: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 capitalize"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Volume (ml)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.volume_ml}
                        onChange={e => setFormData({...formData, volume_ml: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-48 relative bg-gray-50 hover:bg-gray-100 transition-colors">
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
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" form="productForm" disabled={isUploading}>
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
