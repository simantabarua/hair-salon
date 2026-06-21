'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { addToCart } from '@/store/slices/cartSlice';
import { getProducts } from '@/lib/db';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { ProductDTO, ReviewDTO } from '@/types/api';

export default function ProductDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  const id = params?.id as string;

  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [productList, setProductList] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prodData = await apiClient.get<ProductDTO>(`/api/v1/products/${id}`);
        setProduct(prodData);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        // Fallback
        const fallbackList = getProducts() as any[];
        const found = fallbackList.find((p) => p.id === id);
        setProduct(found || null);
      }

      try {
        const listData = await apiClient.get<any>('/api/v1/products?limit=100');
        if (listData && Array.isArray(listData.products)) {
          setProductList(listData.products);
        } else if (Array.isArray(listData)) {
          setProductList(listData);
        } else {
          setProductList([]);
        }
      } catch (err) {
        console.error('Failed to fetch related products:', err);
        setProductList(getProducts() as any[]);
      }

      try {
        const fetchedReviews = await apiClient.get<ReviewDTO[]>(`/api/v1/reviews?targetType=product&targetId=${id}`);
        if (fetchedReviews && fetchedReviews.length > 0) {
          const mappedReviews = fetchedReviews.map((rev) => ({
            name: rev.userName,
            date: new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            rating: rev.rating,
            image: '/img/Team Members Images/team-4.png',
            text: rev.comment,
          }));
          setReviewsList(mappedReviews);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Gallery main image state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeThumbnail, setActiveThumbnail] = useState<number>(0);
  const [lastProductId, setLastProductId] = useState<string>('');

  if (product && product.id !== lastProductId) {
    setLastProductId(product.id);
    setSelectedImage(null);
    setActiveThumbnail(0);
  }

  const currentImage = selectedImage ?? product?.image ?? '';

  // Quantity state
  const [quantity, setQuantity] = useState<number>(1);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'description' | 'info' | 'reviews'>('description');

  // Review Form State
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewEmail, setReviewEmail] = useState<string>('');
  const [reviewMessage, setReviewMessage] = useState<string>('');
  const [reviewsList, setReviewsList] = useState([
    {
      name: 'John Doe',
      date: '12 days ago',
      rating: 5,
      image: '/img/Team Members Images/team-4.png',
      text: 'This product transformed my hair completely. After just two weeks of use, my hair feels softer, looks shinier, and the frizz I have been fighting for years is almost entirely gone. Absolutely worth every penny — I have already ordered a second bottle.',
    },
    {
      name: 'Sarah H.',
      date: '17 days ago',
      rating: 5,
      image: '/img/Team Members Images/team-3.png',
      text: 'I have tried so many hair care products over the years, but nothing comes close to this. The organic formula is gentle enough for daily use, and the scent is absolutely luxurious. My stylist even noticed the improvement at my last appointment!',
    },
    {
      name: 'Alex Ha.',
      date: '20 days ago',
      rating: 5,
      image: '/img/Team Members Images/team-2.png',
      text: 'Great packaging, fast delivery, and most importantly — it delivers on its promises. My scalp feels healthier, and my hair has noticeably more volume. Highly recommend to anyone dealing with dryness or breakage.',
    },
  ]);

  // Auto-populate name and email if session is available
  useEffect(() => {
    if (session?.user) {
      setReviewName(session.user.name || '');
      setReviewEmail(session.user.email || '');
    }
  }, [session]);

  if (!mounted || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-white space-y-4 px-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin"></div>
        </div>
        <p className="text-white/60 font-manrope text-sm animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-white space-y-4 px-4">
        <h2 className="font-cormorant text-4xl md:text-6xl font-bold">Product Not Found</h2>
        <p className="text-white/60 font-manrope">The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop">
          <Button className="btn-primary flex items-center gap-2 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  // Thumbnails: main image, and two other images
  const thumbnails = [
    product.image,
    '/img/Products Images/product-3.png',
    '/img/Products Images/product-4.png',
  ];

  const handleQuantityChange = (val: number) => {
    setQuantity(Math.max(1, val));
  };

  const handleAddToCartClick = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    );
    // Visual feedback
    toast.success(`Successfully added ${quantity} x ${product.name} to your cart!`);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast.error('You must be logged in to leave a review.');
      return;
    }
    if (!reviewMessage.trim()) {
      toast.error('Please enter a review message.');
      return;
    }

    try {
      await apiClient.post('/api/v1/reviews', {
        rating: ratingInput,
        comment: reviewMessage,
        targetType: 'product',
        targetId: product.id,
      });

      const newReview = {
        name: session?.user?.name || 'You',
        date: 'Just now',
        rating: ratingInput,
        image: '/img/Team Members Images/team-1.png',
        text: reviewMessage,
      };

      // Check if we are currently displaying only mock reviews (e.g. if reviewsList matches the initial mock reviews).
      // If the first item in reviewsList is "John Doe" (our mock review), let's replace the whole array with our new review
      // so we don't mix mock reviews with real reviews once a real review is posted.
      setReviewsList((prev) => {
        const isShowingMockOnly = prev.length === 3 && prev[0].name === 'John Doe' && prev[1].name === 'Sarah H.';
        if (isShowingMockOnly) {
          return [newReview];
        }
        return [newReview, ...prev];
      });

      setReviewMessage('');
      toast.success('Thank you for your review!');
    } catch (err: any) {
      console.error('Failed to submit review:', err);
      toast.error(err.message || 'Failed to submit review. Make sure you purchased this product.');
    }
  };

  // Filter out the current product from related products
  const relatedProducts = productList
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="relative w-full pb-20 md:pb-32 text-white">
      {/* Page Heading */}
      <PageHeading title="Shop Details" breadcrumbs={[{ label: 'Shop', href: '/shop' }, { label: product.name, href: `/shop/${product.id}` }]} />

      {/* Product Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Gallery Left Column */}
          <div className="flex-1 space-y-6">
            {/* Main Preview Container */}
            <div className="relative w-full aspect-square md:max-h-[38rem] rounded-2xl overflow-hidden border border-primary/10 bg-secondary/30">
              {currentImage && (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover object-top transition-all duration-300"
                  sizes="(max-w-768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            
            {/* Thumbnail Selectors Grid */}
            <div className="grid grid-cols-3 gap-4">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(thumb);
                    setActiveThumbnail(idx);
                  }}
                  className={`relative aspect-square w-full rounded-xl overflow-hidden bg-secondary border transition-all ${
                    activeThumbnail === idx
                      ? 'border-primary scale-[0.98] ring-1 ring-primary/40'
                      : 'border-primary/15 hover:border-primary/50'
                  }`}
                >
                  <Image src={thumb} alt={`Thumbnail ${idx + 1}`} fill className="object-cover object-top" sizes="200px" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Right Column */}
          <div className="flex-1 flex flex-col justify-center font-manrope">
            {/* Category Breadcrumb/Tag */}
            <span className="text-xs md:text-sm font-bold tracking-widest text-primary uppercase mb-3">{product.category}</span>
            
            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-cormorant font-bold mb-4 tracking-wide">
              {product.name}
            </h1>

            {/* Price */}
            <div className="text-2xl md:text-4xl font-cormorant font-semibold text-primary mb-5">
              ${product.price.toFixed(2)}
            </div>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= product.rating
                        ? 'fill-primary stroke-primary'
                        : 'fill-transparent stroke-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-white/50">({product.ratingCount} Customer Reviews)</span>
            </div>

            {/* Product Short Description */}
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 border-b border-white/10 pb-8">
              {product.description} Beautifully crafted organic formula designed specifically for professional results and hair-care enthusiasts. Nourishes scalp, protects shafts and delivers an elegant natural glow.
            </p>

            {/* Quantity Selector & Add to Cart Container */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              {/* Quantity Changer */}
              <div className="flex items-center bg-secondary border border-primary/30 rounded-xl overflow-hidden w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex items-center justify-center w-14 h-14 hover:bg-primary/10 text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <Input
                  type="text"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-14 bg-transparent border-0 text-center font-bold text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex items-center justify-center w-14 h-14 hover:bg-primary/10 text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCartClick}
                className="btn-primary w-full sm:w-auto h-14 px-8 rounded-xl flex items-center justify-center gap-2.5 font-bold text-base shadow-lg transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </Button>
            </div>

            {/* Additional Metadata */}
            <div className="space-y-2.5 text-xs md:text-sm border-t border-white/10 pt-8 font-medium">
              <p className="text-white/60">
                <span className="text-white font-bold mr-2">Serial No:</span> AQ{product.id.slice(0, 4).toUpperCase()}5157
              </p>
              <p className="text-white/60">
                <span className="text-white font-bold mr-2">Category:</span> {product.category}, Face Care, Organic Styling
              </p>
              <p className="text-white/60">
                <span className="text-white font-bold mr-2">Tags:</span> Hair, Beauty, Trends, Premium Care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-28">
        {/* Tab Headers */}
        <div className="border-b border-white/15 flex gap-6 md:gap-10 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('description')}
            className={`font-cormorant text-xl md:text-2xl font-semibold pb-4 relative transition-all whitespace-nowrap ${
              activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`font-cormorant text-xl md:text-2xl font-semibold pb-4 relative transition-all whitespace-nowrap ${
              activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            Additional Info
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`font-cormorant text-xl md:text-2xl font-semibold pb-4 relative transition-all whitespace-nowrap ${
              activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab Content Display Area */}
        <div className="bg-secondary/20 border border-primary/5 rounded-2xl p-6 md:p-8 font-manrope text-sm md:text-base leading-relaxed text-white/70">
          
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>
                This product has been carefully developed using a blend of cold-pressed botanical oils, keratin-strengthening proteins, and plant-derived actives that work together to restore hair&apos;s natural vitality. Unlike synthetic alternatives, our formula penetrates deep into the hair shaft — repairing damage from heat styling, chemical treatments, and environmental exposure. The result is hair that not only looks healthier, but genuinely is.
              </p>
              <p>
                Our formulation features natural components sourced globally from leading organic farms. Perfect for all skin types, it works to naturally elevate standard look parameters while providing deep dermis conditioning and cell protection. Use daily for best results.
              </p>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-4 font-bold text-white w-1/3">Product Name</td>
                    <td className="py-4">{product.name}</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 font-bold text-white">Brand</td>
                    <td className="py-4">Aurelia Beauty & Salon Care</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 font-bold text-white">Volume / Net Weight</td>
                    <td className="py-4">120 ml / 4.2 fl. oz</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 font-bold text-white">Benefits</td>
                    <td className="py-4">Hydrates, Brightens, Evens tone and supports natural scalp vitality</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-12">
              {/* Existing Reviews List */}
              <div className="space-y-6">
                {reviewsList.map((rev, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 items-start bg-secondary/30 p-5 rounded-2xl border border-primary/5">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
                      <Image src={rev.image} alt={rev.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h5 className="font-semibold text-white text-base">{rev.name}</h5>
                          <span className="text-xs text-white/40">{rev.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating
                                  ? 'fill-primary stroke-primary'
                                  : 'fill-transparent stroke-white/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-white/70">{rev.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <div className="border-t border-white/10 pt-8 space-y-6">
                <h4 className="font-cormorant text-2xl md:text-3xl font-bold text-white">Add a Review</h4>
                <form onSubmit={handleAddReview} className="space-y-6">
                  {/* Rating Selector */}
                  <div className="bg-secondary/40 p-4 rounded-xl max-w-xs border border-primary/10">
                    <label className="block text-sm font-bold text-white mb-2">Your Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="focus:outline-none transition-transform active:scale-95"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= ratingInput
                                ? 'fill-primary stroke-primary'
                                : 'fill-transparent stroke-white/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Enter Your Name *"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      disabled={status === 'authenticated'}
                      className="bg-secondary/50 border-primary/20 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Input
                      type="email"
                      placeholder="Enter Your Email *"
                      required
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      disabled={status === 'authenticated'}
                      className="bg-secondary/50 border-primary/20 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <textarea
                    placeholder="Your Message"
                    required
                    rows={6}
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    className="w-full bg-secondary/50 border border-primary/20 text-white placeholder:text-white/30 rounded-xl p-4 focus:border-primary focus:ring-0 focus:outline-none text-sm"
                  ></textarea>

                  <label htmlFor="save-browser" className="flex items-start gap-3 text-xs text-white/60 select-none cursor-pointer hover:text-white transition-colors">
                    <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
                      <input
                        type="checkbox"
                        id="save-browser"
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border flex items-center justify-center transition-all bg-transparent border-white/30 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black hover:border-primary/60 cursor-pointer">
                        <svg className="w-3 h-3 text-black hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span>
                      Save my name, email and website in this browser for the next time I comment.
                    </span>
                  </label>

                  {status !== 'authenticated' ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary/20 border border-primary/10 p-5 rounded-xl">
                      <p className="text-white/60 text-sm">You must be logged in to leave a review.</p>
                      <Link href="/login">
                        <Button type="button" className="btn-primary text-xs px-6 py-2 h-10 rounded-xl">Log In</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button type="submit" className="btn-primary px-8 h-12 rounded-xl font-semibold shadow-lg">
                      Submit Review
                    </Button>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-20 md:mt-32">
        <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-center mb-10 md:mb-16">
          Related Products
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((prod) => (
            <div key={prod.id} className="group flex flex-col bg-secondary/30 border border-primary/10 rounded-2xl overflow-hidden shadow-xl">
              {/* Product Image preview */}
              <div className="relative aspect-square w-full bg-secondary overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 50vw, 33vw"
                />
                
                {/* Action hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      dispatch(addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, quantity: 1 }));
                      toast.success(`Successfully added ${prod.name} to cart!`);
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-black hover:bg-primary/80 transition-colors shadow-lg"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <Link
                    href={`/shop/${prod.id}`}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 transition-colors shadow-lg"
                    title="View Details"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 text-center font-manrope">
                <Link href={`/shop/${prod.id}`}>
                  <h4 className="text-xl font-cormorant font-bold text-white hover:text-primary transition-colors line-clamp-1 mb-2">
                    {prod.name}
                  </h4>
                </Link>
                <p className="text-primary font-bold text-lg">${prod.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
