'use client';

import React, { useState } from 'react';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Check, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  rating: number;
  service: string;
  date: string;
  text: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Eleanor Vance',
    rating: 5,
    service: 'Balayage & Coloring',
    date: '2026-06-18',
    text: 'Sarah is absolutely incredible! She listened to exactly what I wanted and the color came out even better than the reference pictures. The scalp massage during wash was pure heaven. Will definitely be coming back!',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Marcus Brody',
    rating: 5,
    service: 'Precision Fade & Beard Grooming',
    date: '2026-06-15',
    text: 'Tranter is the master barber. The precision on the skin fade is unmatched, and the hot towel shave treatment was relaxing and left my skin smooth. A truly premium grooming experience.',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Genevieve Gray',
    rating: 4,
    service: 'Keratin Nourishing Therapy',
    date: '2026-06-10',
    text: 'Great experience! My hair feels incredibly soft and silky after the treatment. The salon is beautiful and the team is welcoming. Giving 4 stars only because they were running 10 minutes late, but they made up for it.',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Nicholas Wilde',
    rating: 5,
    service: 'Classic Pompadour Cut',
    date: '2026-06-08',
    text: 'Highly recommend David Miller. He has a great understanding of texture and style. Gave excellent tips on how to style my pompadour at home. Very professional.',
    verified: true,
  },
];

const SERVICES = [
  'Precision Haircut',
  'Beard Trim & Grooming',
  'Balayage & Coloring',
  'Blowout & Styling',
  'Keratin Therapy',
  'Scalp Treatment & Massage',
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    rating: 5,
    text: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.service || !formData.text) {
      toast.error('Please fill out all required fields.');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: formData.name,
      rating: formData.rating,
      service: formData.service,
      date: new Date().toISOString().split('T')[0],
      text: formData.text,
      verified: true,
    };

    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    toast.success('Thank you for sharing your experience!');

    // Reset Form
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        service: '',
        rating: 5,
        text: '',
      });
    }, 1500);
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-primary">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-primary' : 'text-white/20'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full pb-24 text-white font-manrope">
      {/* Page Heading */}
      <PageHeading title="Client Reviews" breadcrumbs={[{ label: 'Reviews', href: '/reviews' }]} />

      {/* Ratings Summary Dashboard */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Aggregate Rating Score Card */}
          <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <h3 className="font-cormorant text-2xl font-bold mb-4">Overall Styling Rating</h3>
            <span className="font-cormorant text-7xl font-bold text-primary mb-2">4.9</span>
            <div className="flex gap-1 text-primary mb-3">
              <Star className="w-6 h-6 fill-primary" />
              <Star className="w-6 h-6 fill-primary" />
              <Star className="w-6 h-6 fill-primary" />
              <Star className="w-6 h-6 fill-primary" />
              <Star className="w-6 h-6 fill-primary" />
            </div>
            <p className="text-white/50 text-xs tracking-wider uppercase font-semibold">
              Based on {reviews.length + 120} Verified Bookings
            </p>
          </div>

          {/* Rating Breakdown Bars */}
          <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-8 flex flex-col justify-center shadow-2xl lg:col-span-2">
            <h4 className="font-cormorant text-xl font-bold mb-4 text-left">Rating Distribution</h4>
            <div className="space-y-3">
              {/* 5 Stars */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/60 font-semibold w-12">5 Star</span>
                <div className="flex-grow h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                </div>
                <span className="text-xs text-white/50 w-8 text-right">92%</span>
              </div>
              {/* 4 Stars */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/60 font-semibold w-12">4 Star</span>
                <div className="flex-grow h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '6%' }}></div>
                </div>
                <span className="text-xs text-white/50 w-8 text-right">6%</span>
              </div>
              {/* 3 Stars */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/60 font-semibold w-12">3 Star</span>
                <div className="flex-grow h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '2%' }}></div>
                </div>
                <span className="text-xs text-white/50 w-8 text-right">2%</span>
              </div>
              {/* 2 Stars / 1 Star */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/60 font-semibold w-12">2 Star</span>
                <div className="flex-grow h-2.5 bg-secondary/80 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
                </div>
                <span className="text-xs text-white/50 w-8 text-right">0%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Grid: Reviews List and Write Form */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-20 md:mt-28">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Reviews Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4">
              <h3 className="font-cormorant text-2xl font-bold">What Clients Say</h3>
              <span className="text-xs text-white/40">{reviews.length} reviews shown</span>
            </div>

            <div className="space-y-6">
              {reviews.map(review => (
                <div 
                  key={review.id} 
                  className="bg-secondary/20 border border-primary/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-cormorant text-lg font-bold text-white mb-0.5">{review.name}</h4>
                      <p className="text-[11px] text-primary/80 font-semibold uppercase tracking-wider">{review.service}</p>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <span className="text-[10px] text-white/30 block mt-1">{review.date}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-3">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {review.verified && (
                    <div className="flex items-center gap-1.5 text-[10px] text-primary/70 font-semibold uppercase tracking-wider">
                      <span className="w-3.5 h-3.5 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                      Verified styling client
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Write a Review Form */}
          <div>
            <div className="sticky top-24 bg-secondary/35 border border-primary/15 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h3 className="font-cormorant text-2xl font-bold mb-2">Write a Review</h3>
              <p className="text-white/50 text-xs mb-6">
                Share your personal styling transformation details with our community.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Rating Selection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 pl-0.5">
                    Your Rating *
                  </label>
                  <div className="flex gap-1.5 items-center py-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="text-primary hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= formData.rating ? 'fill-primary' : 'text-white/20'}`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-white/50 ml-2 font-semibold">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 pl-0.5">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 rounded-xl focus:border-primary focus-visible:ring-0"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 pl-0.5">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/20 h-11 rounded-xl focus:border-primary focus-visible:ring-0"
                  />
                </div>

                {/* Service Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 pl-0.5">
                    Service Received *
                  </label>
                  
                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="w-full bg-secondary/45 text-left text-white border border-primary/35 rounded-xl h-11 px-3 focus:border-primary focus:outline-none transition-colors text-xs cursor-pointer flex items-center justify-between"
                  >
                    <span className={formData.service ? "text-white" : "text-white/40"}>
                      {formData.service || "Select a styling service"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-4 h-4 text-primary transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Hidden native select for form validation/accessibility */}
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="sr-only"
                    tabIndex={-1}
                  >
                    <option value="" disabled>Select a styling service</option>
                    {SERVICES.map(service => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>

                  {/* Custom Dropdown Menu */}
                  {isSelectOpen && (
                    <>
                      {/* Overlay to close when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsSelectOpen(false)}
                      />
                      
                      <div className="absolute left-0 right-0 mt-1 bg-[#1a1510] border border-primary/30 rounded-xl shadow-2xl z-20 overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in-50 slide-in-from-top-2 duration-200">
                        {SERVICES.map(service => (
                          <button
                            key={service}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, service }));
                              setIsSelectOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-primary hover:text-secondary block ${
                              formData.service === service 
                                ? 'bg-primary/20 text-primary font-semibold' 
                                : 'text-white/80'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Review Text */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/40 pl-0.5">
                    Your Review *
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="How was your haircut, color, or overall experience?"
                    className="w-full bg-secondary/45 text-white border border-primary/35 placeholder:text-white/20 rounded-xl p-3 focus:border-primary focus:outline-none transition-colors text-xs leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={submitted}
                    className="w-full btn-primary h-12 rounded-xl font-bold font-manrope text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitted ? (
                      <>
                        <Check className="w-4 h-4" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Review <MessageSquare className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
