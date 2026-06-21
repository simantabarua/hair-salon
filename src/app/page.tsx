'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { ShoppingBag, ArrowRight, Star, Heart } from 'lucide-react';
import { addToCart } from '@/store/slices/cartSlice';
import { services as mockServices, products as mockProducts, teamMembers as mockTeamMembers, blogPosts as mockBlogPosts, faqItems } from '@/data/salonData';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LucideIcon } from '@/components/ui/LucideIcon';
import { apiClient } from '@/lib/apiClient';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function HomePage() {
  const dispatch = useDispatch();

  const [servicesList, setServicesList] = useState<any[]>(mockServices);
  const [productsList, setProductsList] = useState<any[]>(mockProducts);
  const [teamList, setTeamList] = useState<any[]>(mockTeamMembers);
  const [blogList, setBlogList] = useState<any[]>(mockBlogPosts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [servicesRes, productsRes, teamRes, blogsRes] = await Promise.allSettled([
          apiClient.get<any[]>('/api/v1/services'),
          apiClient.get<any>('/api/v1/products?limit=6'),
          apiClient.get<any[]>('/api/v1/users?role=staff'),
          apiClient.get<any[]>('/api/v1/blogs')
        ]);

        if (servicesRes.status === 'fulfilled' && servicesRes.value && servicesRes.value.length > 0) {
          setServicesList(servicesRes.value);
        }

        if (productsRes.status === 'fulfilled' && productsRes.value) {
          const pVal = productsRes.value;
          if (Array.isArray(pVal.products) && pVal.products.length > 0) {
            setProductsList(pVal.products);
          } else if (Array.isArray(pVal) && pVal.length > 0) {
            setProductsList(pVal);
          }
        }

        if (teamRes.status === 'fulfilled' && teamRes.value && teamRes.value.length > 0) {
          setTeamList(teamRes.value);
        }

        if (blogsRes.status === 'fulfilled' && blogsRes.value && blogsRes.value.length > 0) {
          setBlogList(blogsRes.value);
        }
      } catch (error) {
        console.error('Error fetching dynamic homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="relative w-full">
      {/* 
      ============================
           Hero Section
      ============================
      */}
      <section
        id="hero"
        className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center pt-24 pb-12 md:py-0"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.9) 100%), url("/img/Hero Section/image 2.png")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-8xl w-full mx-auto px-4 md:px-8 flex flex-col items-start justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-semibold font-cormorant max-w-4xl text-white leading-tight">
            Find Your <br/><span className="text-primary font-bold">Signature</span> Look <br className="hidden md:inline" />
            with Our Salon
          </h1>
          <p className="max-w-xl text-sm md:text-base text-white/70 py-6 md:py-8 font-manrope leading-relaxed">
            Discover the art of beautiful hair at our salon. Our skilled
            stylists bring creativity and expertise to every cut, color, and
            style. Step into a world of luxury and leave looking your absolute best.
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/appointment"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-primary text-black hover:bg-primary/80 font-semibold px-6 md:px-10 py-5 md:py-6 rounded-xl transition-all duration-300 h-auto text-center"
              )}
            >
              Appoint Now
            </Link>
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border border-white/40 bg-transparent text-white hover:bg-white hover:text-black font-semibold px-6 md:px-10 py-5 md:py-6 rounded-xl gap-2 transition-all duration-300 h-auto text-center flex items-center justify-center"
              )}
            >
              Our Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-10 md:gap-20 xl:gap-32 pt-16 md:pt-24 text-white">
            <div>
              <h3 className="text-3xl md:text-5xl font-cormorant font-bold text-primary">15 +</h3>
              <p className="text-xs md:text-sm font-manrope text-white/60 uppercase tracking-widest mt-1">Years Experience</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-cormorant font-bold text-primary">137k +</h3>
              <p className="text-xs md:text-sm font-manrope text-white/60 uppercase tracking-widest mt-1">Happy Clients</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-5xl font-cormorant font-bold text-primary">20 +</h3>
              <p className="text-xs md:text-sm font-manrope text-white/60 uppercase tracking-widest mt-1">Expert Stylists</p>
            </div>
          </div>
        </div>
      </section>

      {/* 
      ============================
           About Us Section
      ============================
      */}
      <section id="about-us" className="py-20 md:py-32 bg-secondary/30 border-y border-primary/5">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative h-[300px] sm:h-[450px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
              <Image
                src="/img/About Us Section/adam-winger-VjRpkGtS55w-unsplash 2.png"
                alt="About our salon experience"
                fill
                className="object-cover"
                sizes="(max-w-1024px) 100vw, 40vw"
              />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide leading-tight">
                Crafting Premium Hair Experiences Since 2011
              </h2>
              <div className="text-white/70 font-manrope text-base leading-relaxed space-y-4">
                <p>
                  Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per himenaeos.
                  Curabitur tempus urna at turpis condimentum.
                </p>
                <p>
                  lobortis. Borem ipsum dolor sit amet, consectetur adipiscing
                  elit. Nunc vulputate libero et velit interdum, ac aliquet odio
                  mattis. Class aptent taciti sociosqu ad litora torquent per
                  himenaeos. Curabitur tempus urna at turpis condimentum lobortis.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/about"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "bg-primary text-black hover:bg-primary/80 font-semibold px-8 py-5 rounded-xl transition-all duration-300 h-auto inline-block text-center"
                  )}
                >
                  More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
      ============================
           Services Section
      ============================
      */}
      <section id="services" className="py-20 md:py-32">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Our Services</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">What We Provide</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="group relative flex flex-col items-center text-center p-8 md:p-10 rounded-2xl bg-secondary/40 border border-primary/20 hover:border-primary hover:bg-secondary/70 transition-all duration-300 shadow-xl"
              >
                <div className="relative w-20 h-20 mb-6 flex items-center justify-center bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors border border-primary/10">
                  <LucideIcon name={service.icon} className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-cormorant text-2xl md:text-3xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">
                  {service.name}
                </h4>
                <p className="text-white/60 text-sm font-manrope leading-relaxed mb-6">
                  {service.description}
                </p>
                <div className="mt-auto w-full">
                  <Link
                    href="/appointment"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full bg-primary text-black hover:bg-primary/80 font-semibold py-5 rounded-xl transition-all duration-300 h-auto text-center"
                    )}
                  >
                    Book now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
      ============================
           Shop Section
      ============================
      */}
      <section id="shop" className="py-20 md:py-32 bg-secondary/30 border-y border-primary/5">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Shop Now</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Our Latest Products</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Explore our line of premium hair care and styling products selected by our master barbers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsList.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-secondary/50 border border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
              >
                {/* Product Image Area */}
                <div className="relative aspect-square w-full bg-secondary overflow-hidden">
                  <Image
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-w-768px) 50vw, 33vw"
                  />
                  {/* Hover action overlay */}
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

                {/* Details */}
                <div className="p-6 flex flex-col flex-grow font-manrope">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs tracking-widest text-primary font-semibold uppercase">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      <span className="text-xs text-white/80 font-semibold">{(product.rating ?? 5).toFixed(1)}</span>
                      <span className="text-[10px] text-white/40">({product.ratingCount ?? 0})</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-cormorant font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-white/60 text-sm line-clamp-2 mb-6">
                    {product.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-primary/5 pt-4">
                    <span className="text-2xl font-cormorant font-bold text-white">${product.price.toFixed(2)}</span>
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

          <div className="flex items-center justify-center mt-12 md:mt-16">
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border border-primary text-primary hover:bg-primary hover:text-black font-semibold px-8 py-5 rounded-xl transition-all h-auto text-center"
              )}
            >
              Show all Products
            </Link>
          </div>
        </div>
      </section>

      {/* 
      ============================
           Business Hour Section
      ============================
      */}
      <section id="business-hour" className="py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 space-y-4">
            <span className="text-primary  text-xl tracking-wider font-semibold font-cormorant">Schedule</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Working Hours</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Plan your visit around our weekly operational hours. We recommend booking in advance.
            </p>
          </div>

          <div className="bg-secondary/40 border border-primary/20 rounded-2xl p-6 md:p-12 shadow-2xl">
            <table className="w-full text-base md:text-xl font-manrope">
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 md:py-6 text-white font-semibold">Monday - Friday</td>
                  <td className="py-4 md:py-6 text-primary text-center">:</td>
                  <td className="py-4 md:py-6 text-white/80 text-end">7:30 AM - 8:00 PM</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 md:py-6 text-white font-semibold">Saturday</td>
                  <td className="py-4 md:py-6 text-primary text-center">:</td>
                  <td className="py-4 md:py-6 text-white/80 text-end">7:30 AM - 6:00 PM</td>
                </tr>
                <tr>
                  <td className="py-4 md:py-6 text-white font-semibold">Sunday</td>
                  <td className="py-4 md:py-6 text-primary text-center">:</td>
                  <td className="py-4 md:py-6 text-red-400 font-semibold text-end">Closed</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8 md:mt-12">
            <Link
              href="/appointment"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-primary text-black hover:bg-primary/80 font-semibold px-8 py-5 rounded-xl transition-all h-auto text-center"
              )}
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* 
      ============================
           Team Section
      ============================
      */}
      <section id="team" className="py-20 md:py-32 bg-secondary/30 border-y border-primary/5">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">The Experts</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Meet Our Stylists</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Our award-winning stylists bring style, care, and precision to your grooming.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamList.map((stylist) => (
              <div key={stylist.id} className="group relative flex flex-col bg-secondary/50 border border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
                {/* Photo */}
                <div className="relative h-72 w-full overflow-hidden bg-secondary">
                  <Image
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    src={stylist.image || '/img/Team/team-1.jpg'}
                    alt={stylist.name}
                    fill
                    sizes="(max-w-768px) 50vw, 25vw"
                  />
                  {/* Hover Social Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-300">
                    <a href={stylist.facebook || '#'} className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors">
                      <Star className="w-4 h-4 fill-current" />
                    </a>
                    <a href={stylist.instagram || '#'} className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/80 transition-colors">
                      <Heart className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>

                {/* Info Card offset */}
                <div className="p-6 text-center bg-secondary">
                  <h4 className="text-xl font-cormorant font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                    {stylist.name}
                  </h4>
                  <p className="text-xs text-white/50 font-manrope uppercase tracking-widest">
                    {stylist.role === 'staff' ? 'Hair Stylist' : (stylist.role || 'Stylist')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
      ============================
           Blog Section
      ============================
      */}
      <section id="blog" className="py-20 md:py-32">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold">Latest Trends</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Our Blogs</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Read tips and guides curated by our stylists to maintain your salon-fresh look at home.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogList.map((post) => (
              <div key={post.id} className="group flex flex-col bg-secondary/40 border border-primary/10 hover:border-primary/30 rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
                <div className="relative h-60 w-full overflow-hidden bg-secondary">
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-w-768px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-black font-semibold text-xs px-3 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow font-manrope">
                  <span className="text-xs text-white/55 mb-2">
                    By {post.author} | {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : (post.date || '')}
                  </span>
                  <h4 className="text-xl font-cormorant font-semibold text-white leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.id}`} className="mt-auto text-primary hover:text-primary/80 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12 md:mt-16">
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border border-primary text-primary hover:bg-primary hover:text-black font-semibold px-8 py-5 rounded-xl transition-all h-auto text-center"
              )}
            >
              Load More Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* 
      ============================
           FAQ's Section
      ============================
      */}
      <section id="faqs" className="py-20 md:py-32 bg-secondary/30 border-t border-primary/5">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-primary font-cormorant text-xl tracking-wider font-semibold font-cormorant">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-cormorant font-bold text-white tracking-wide">Frequently Asked Questions</h2>
            <p className="text-white/60 font-manrope text-sm md:text-base">
              Have doubts? Find quick answers to common questions about reservations, cancelation policies, and styling.
            </p>
          </div>

          <Accordion className="space-y-4 w-full">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={`item-${index}`}
                className="border border-primary/20 rounded-xl px-6 md:px-8 bg-secondary/40 data-[state=open]:bg-primary data-[state=open]:text-black hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-lg font-cormorant font-medium text-white hover:no-underline py-4 py-5 data-[state=open]:text-black">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm font-manrope leading-relaxed text-white/70 data-[state=open]:text-black/85 pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
