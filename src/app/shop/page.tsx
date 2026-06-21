'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { ShoppingBag, ArrowRight, Star, Search, SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { addToCart } from '@/store/slices/cartSlice';
import { getProducts } from '@/lib/db';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ProductDTO } from '@/types/api';

const ALL_CATEGORIES = ['All', 'Hair Care', 'Skin Care', 'Face', 'Equipment', 'Organic'];
const ALL_TAGS = ['Cream', 'Face', 'Blonde', 'Make up', 'Organic', 'Gloss', 'Trends', 'Fashion', 'Shampoo', 'Spray'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Sort by Rating' },
];

function SortDropdown({
  sortBy,
  setSortBy,
}: {
  sortBy: string;
  setSortBy: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  return (
    <div className="relative w-full sm:w-60" ref={ref}>
      {/* Trigger Button */}
      <button
        id="sort-dropdown-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 bg-secondary border border-primary/30 hover:border-primary text-white px-4 py-2.5 rounded-xl font-manrope text-sm font-medium transition-all duration-200 focus:outline-none focus:border-primary"
      >
        <span>{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute right-0 top-full mt-2 w-full z-30 bg-secondary border border-primary/20 rounded-xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-y-100 translate-y-0 visible' : 'opacity-0 scale-y-90 -translate-y-1 invisible'
        }`}
      >
        {SORT_OPTIONS.map((option) => {
          const isActive = sortBy === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => { setSortBy(option.value); setOpen(false); }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 font-manrope text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary/15 text-primary border-l-2 border-primary'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <span>{option.label}</span>
              {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const dispatch = useDispatch();
  const [productList, setProductList] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiClient.get<ProductDTO[]>('/api/v1/products');
        setProductList(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // Fallback to local products
        setProductList(getProducts() as any);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // State for search and filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(150);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Redux action handler
  const handleAddToCart = (product: ProductDTO) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Tag
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Filter by Price
    result = result.filter((p) => p.price <= maxPrice);

    // Sort Products
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [productList, searchQuery, selectedCategory, selectedTag, maxPrice, sortBy]);

  // Sidebar Component function for reuse
  const renderSidebarContent = () => (
    <div className="space-y-8 text-white">
      {/* Category List */}
      <div className="space-y-4">
        <h4 className="font-cormorant text-2xl font-semibold border-b border-primary/20 pb-2">Category</h4>
        <ul className="space-y-2.5 font-manrope text-sm text-white/70">
          {ALL_CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className={`hover:text-primary transition-colors text-left w-full font-medium ${
                  selectedCategory === cat ? 'text-primary font-bold' : ''
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter by Price */}
      <div className="space-y-4">
        <h4 className="font-cormorant text-2xl font-semibold border-b border-primary/20 pb-2">Filter By Price</h4>
        <div className="space-y-2 font-manrope">
          <input
            type="range"
            min="0"
            max="150"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-primary bg-secondary/50 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>$0</span>
            <span className="text-primary font-bold">${maxPrice}</span>
            <span>$150</span>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="space-y-4">
        <h4 className="font-cormorant text-2xl font-semibold border-b border-primary/20 pb-2">Popular Products</h4>
        <div className="space-y-4">
          {productList.slice(0, 3).map((prod) => (
            <Link key={prod.id} href={`/shop/${prod.id}`} className="group flex gap-4 items-center">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-primary/10 group-hover:border-primary/40 flex-shrink-0 transition-colors">
                <Image src={prod.image} alt={prod.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="font-manrope text-sm space-y-1">
                <p className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{prod.name}</p>
                <p className="text-primary font-bold">${prod.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter by Tags */}
      <div className="space-y-4">
        <h4 className="font-cormorant text-2xl font-semibold border-b border-primary/20 pb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all ${
                selectedTag === tag
                  ? 'bg-primary text-black border-primary'
                  : 'bg-secondary/40 text-white/80 border-primary/20 hover:border-primary/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full pb-20 md:pb-32">
      {/* Page Heading */}
      <PageHeading title="Shop" breadcrumbs={[{ label: 'Shop', href: '/shop' }]} />

      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-secondary/30 border border-primary/15 rounded-2xl p-6 shadow-2xl sticky top-24">
            <div className="relative w-full flex mb-6">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary text-white border-primary/30 focus:border-primary pr-10 py-5 rounded-xl placeholder:text-white/40"
              />
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-white/50" />
            </div>
            {renderSidebarContent()}
          </aside>

          {/* Mobile Filter Modal Panel */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 lg:hidden flex justify-end">
              <div className="w-80 h-full bg-black border-l border-primary/20 p-6 overflow-y-auto space-y-6">
                <div className="flex justify-between items-center text-white pb-2 border-b border-white/10">
                  <span className="font-cormorant text-2xl font-bold">Filter Options</span>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-6 h-6 hover:text-primary transition-colors" />
                  </button>
                </div>
                <div className="relative w-full flex">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-secondary text-white border-primary/30 focus:border-primary pr-10 py-5 rounded-xl placeholder:text-white/40"
                  />
                  <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-white/50" />
                </div>
                {renderSidebarContent()}
              </div>
            </div>
          )}

          {/* Main Product Catalog Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Filter and sorting actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-secondary/40 border border-primary/10 rounded-2xl">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-secondary border border-primary/30 text-white px-4 py-2.5 rounded-xl hover:border-primary transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <p className="text-white/70 font-manrope text-sm font-medium">
                  Showing all <span className="text-primary font-bold">{filteredProducts.length}</span> results
                </p>
              </div>

              {/* Sort Control — custom styled dropdown */}
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>

            {/* Active Filters Summary */}
            {(selectedCategory !== 'All' || selectedTag || searchQuery || maxPrice < 150) && (
              <div className="flex flex-wrap gap-2 items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                <span className="text-xs font-semibold text-primary font-manrope tracking-wider uppercase mr-2">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="text-xs bg-primary/20 text-white border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="text-xs font-bold hover:text-red-400">×</button>
                  </span>
                )}
                {selectedTag && (
                  <span className="text-xs bg-primary/20 text-white border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    Tag: {selectedTag}
                    <button onClick={() => setSelectedTag(null)} className="text-xs font-bold hover:text-red-400">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="text-xs bg-primary/20 text-white border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')} className="text-xs font-bold hover:text-red-400">×</button>
                  </span>
                )}
                {maxPrice < 150 && (
                  <span className="text-xs bg-primary/20 text-white border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    Price: &le;${maxPrice}
                    <button onClick={() => setMaxPrice(150)} className="text-xs font-bold hover:text-red-400">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedTag(null);
                    setSearchQuery('');
                    setMaxPrice(150);
                  }}
                  className="text-xs text-primary underline hover:text-primary/80 ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin"></div>
                </div>
                <p className="text-white/60 font-manrope text-sm animate-pulse">Loading curated collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-primary/10 space-y-4">
                <SlidersHorizontal className="w-12 h-12 text-primary/45 mx-auto" />
                <h3 className="font-cormorant text-2xl font-bold text-white">No Products Found</h3>
                <p className="text-white/60 font-manrope text-sm max-w-sm mx-auto">
                  Try adjusting your filters or search keywords to find what you are looking for.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-secondary/50 border border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square w-full bg-secondary overflow-hidden">
                      <Image
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-w-768px) 50vw, 33vw"
                      />
                      {/* Action overlays */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-black hover:bg-primary/80 transition-colors shadow-lg"
                          title="Add to Cart"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </button>
                        <Link
                          href={`/shop/${product.id}`}
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-lg"
                          title="View Details"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>

                    {/* Details Info */}
                    <div className="p-5 flex flex-col flex-grow font-manrope">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] tracking-widest text-primary font-bold uppercase">{product.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
                          <span className="text-xs text-white/80 font-bold">{product.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-white/40">({product.ratingCount})</span>
                        </div>
                      </div>
                      
                      <Link href={`/shop/${product.id}`} className="block">
                        <h4 className="text-xl font-cormorant font-semibold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                      </Link>
                      
                      <p className="text-white/60 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-primary/5 pt-4">
                        <span className="text-xl font-cormorant font-bold text-white">${product.price.toFixed(2)}</span>
                        <Button
                          variant="outline"
                          className="border border-primary text-primary hover:bg-primary hover:text-black font-semibold text-xs py-2 h-9 rounded-xl transition-all"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
