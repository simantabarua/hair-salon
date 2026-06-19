'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  User, 
  Clock, 
  X, 
  Filter 
} from 'lucide-react';
import PageHeading from '@/components/layout/PageHeading';
import { blogPosts } from '@/data/blogData';

const ITEMS_PER_PAGE = 6;

function BlogListContent() {
  const searchParams = useSearchParams();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    if (search !== null) {
      setSearchQuery(search);
    }
    if (category !== null) {
      setSelectedCategory(category);
    }
    if (tag !== null) {
      setSelectedTag(tag);
    }
    setCurrentPage(1);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams]);

  // Categories & Tags Extracted
  const categories = ['Face', 'Equipment', 'Organic'];
  const allTags = ['Cream', 'Face', 'Blonde', 'Make up', 'Organic', 'Gloss', 'Trends', 'Fashion'];

  // Latest 3 posts for the sidebar
  const recentPosts = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, []);

  // Filter & Search Logic
  const filteredPosts = useMemo(() => {
    let result = blogPosts;

    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter(post => post.tags.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.some(paragraph => paragraph.toLowerCase().includes(q))
      );
    }

    return result;
  }, [selectedCategory, selectedTag, searchQuery]);

  // Reset pagination when filters change
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    // clamp page
    const page = Math.min(currentPage, totalPages);
    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="relative w-full pb-20 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title="Blog" breadcrumbs={[{ label: 'Blog', href: '/blog' }]} />

      <section className="w-full max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
            
            {/* Top Toolbar / Filter Navbar */}
            <div className="flex items-center justify-between bg-secondary/40 border border-primary/10 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg border border-primary/20 hover:border-primary transition-colors text-sm font-semibold"
                >
                  <Filter className="w-4 h-4 text-primary" />
                  Filters
                </button>
                <p className="text-sm text-white/60 hidden sm:block">
                  Showing {filteredPosts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} Results
                </p>
              </div>

              {/* Layout Switch & Reset */}
              <div className="flex items-center gap-4">
                {(selectedCategory || selectedTag || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}

                <div className="flex items-center bg-black rounded-lg border border-primary/20 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-black' : 'text-white/60 hover:text-white'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-primary/15">
                <Search className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <h3 className="font-cormorant text-2xl font-semibold mb-2">No Articles Found</h3>
                <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
                  We couldn&apos;t find any blog posts matching your search query or filters. Try adjusting your selections.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/80 transition-colors text-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Blog Posts Display */}
            {viewMode === 'grid' ? (
              /* Grid Layout */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedPosts.map((post) => (
                  <article 
                    key={post.slug} 
                    className="group flex flex-col bg-secondary/25 border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <Link href={`/blog/${post.slug}`} className="relative h-60 w-full overflow-hidden block">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-w-7xl) 100vw, 33vw"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {post.category}
                      </div>
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                          By {post.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-2xl font-semibold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-3">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:text-primary/70 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300"
                        >
                          Read More &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* List Layout */
              <div className="flex flex-col gap-8">
                {paginatedPosts.map((post) => (
                  <article 
                    key={post.slug} 
                    className="group flex flex-col md:flex-row bg-secondary/25 border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <Link href={`/blog/${post.slug}`} className="relative h-64 md:h-auto md:w-[35%] min-h-[220px] overflow-hidden block">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-w-7xl) 100vw, 30vw"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {post.category}
                      </div>
                    </Link>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-primary" />
                          By {post.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-white group-hover:text-primary transition-colors leading-tight mb-4">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-white/5 text-white/60 px-2.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-primary hover:text-primary/70 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300"
                        >
                          Read More &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/20 hover:border-primary disabled:opacity-40 disabled:hover:border-primary/20 transition-all text-primary"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-12 h-12 rounded-xl font-bold border transition-all text-sm ${
                      currentPage === page
                        ? 'bg-primary border-primary text-black'
                        : 'border-primary/20 text-white hover:border-primary'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-primary/20 hover:border-primary disabled:opacity-40 disabled:hover:border-primary/20 transition-all text-primary"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Filter Sidebar */}
          <aside className="w-full lg:w-80 space-y-8 hidden lg:block shrink-0">
            {/* Search widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Search Articles</h4>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search here..."
                  className="w-full pl-4 pr-10 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/40"
                />
                <Search className="absolute right-3.5 w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Categories widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const count = blogPosts.filter(p => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat ? null : cat);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary text-black font-semibold'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-black/20 text-black' : 'bg-white/5 text-white/55'}`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Recent Posts</h4>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.slug} 
                    className="flex gap-4 group items-center"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-primary uppercase font-semibold mb-1 tracking-wider">{post.category}</p>
                      <h5 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags widget */}
            <div className="bg-secondary/40 border border-primary/10 rounded-2xl p-6">
              <h4 className="font-cormorant text-xl font-bold mb-4 border-b border-primary/20 pb-2">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3.5 py-2 rounded-xl transition-all border ${
                      selectedTag === tag
                        ? 'bg-primary border-primary text-black font-semibold'
                        : 'bg-black border-primary/20 text-white/70 hover:border-primary hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile Drawer Filter Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 bg-black/60 backdrop-blur-sm lg:hidden ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-secondary overflow-y-auto p-6 shadow-2xl transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-primary/20 pb-4 mb-6">
            <h3 className="font-cormorant text-2xl font-bold text-primary">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-white/70 hover:text-white bg-black/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Search */}
            <div>
              <h4 className="font-cormorant text-lg font-bold mb-3">Search</h4>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search here..."
                  className="w-full pl-4 pr-10 py-3 text-sm bg-black border border-primary/20 focus:border-primary focus:outline-none rounded-xl text-white placeholder-white/40"
                />
                <Search className="absolute right-3.5 w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-cormorant text-lg font-bold mb-3">Categories</h4>
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const count = blogPosts.filter(p => p.category === cat).length;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat ? null : cat);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary text-black font-semibold'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat ? 'bg-black/20 text-black' : 'bg-white/5 text-white/55'}`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-cormorant text-lg font-bold mb-3">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      selectedTag === tag
                        ? 'bg-primary border-primary text-black font-semibold'
                        : 'bg-black border-primary/20 text-white/70 hover:border-primary'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white/50">Loading blog...</div>}>
      <BlogListContent />
    </Suspense>
  );
}
