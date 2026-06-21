'use client';

import React, { useState, useEffect } from 'react';
import { Clock, User, Star, ShieldCheck, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';
import Image from 'next/image';
import { LucideIcon } from '@/components/ui/LucideIcon';
import PageHeading from '@/components/layout/PageHeading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { apiClient } from '@/lib/apiClient';
import { ServiceDTO, UserDTO, AppointmentDTO } from '@/types/api';

export default function AppointmentPage() {
  const { data: session } = useSession();
  const [servicesList, setServicesList] = useState<ServiceDTO[]>([]);
  const [stylistsList, setStylistsList] = useState<UserDTO[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; availableStylists: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  
  // Selection states
  const [selectedService, setSelectedService] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  
  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Success dialog state
  const [isBooked, setIsBooked] = useState(false);

  // Auto-populate user details from session
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name ?? '',
        email: session.user.email ?? ''
      }));
    }
  }, [session]);

  // Load initial services & stylists
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [servicesData, stylistsData] = await Promise.all([
          apiClient.get<ServiceDTO[]>('/api/v1/services'),
          apiClient.get<UserDTO[]>('/api/v1/users?role=staff')
        ]);
        setServicesList(servicesData);
        setStylistsList(stylistsData);
        if (servicesData.length > 0) {
          setSelectedService(servicesData[0].id);
        }
        if (stylistsData.length > 0) {
          setSelectedStylist(stylistsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load booking data:', err);
        toast.error('Failed to load salon services or stylists. Please refresh the page.');
      } finally {
        setLoading(false);
        setMounted(true);
      }
    };
    loadInitialData();
  }, []);

  const dateStr = selectedDay 
    ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : '';

  // Load slots dynamically
  useEffect(() => {
    if (!dateStr) return;

    let active = true;
    let url = `/api/v1/appointments/slots?date=${dateStr}`;
    if (selectedStylist) {
      url += `&stylistId=${selectedStylist}`;
    }

    apiClient.get<Array<{ time: string; availableStylists: string[] }>>(url)
      .then((data) => {
        if (!active) return;
        setAvailableSlots(data);
        
        // Find if there is any available slots
        const validSlots = data.filter(s => s.availableStylists.length > 0);
        if (validSlots.length > 0) {
          const stillValid = validSlots.some(s => s.time === selectedTimeSlot);
          if (!stillValid) {
            setSelectedTimeSlot(validSlots[0].time);
          }
        } else {
          setSelectedTimeSlot('');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch available slots:', err);
        if (!active) return;
        setAvailableSlots([]);
        setSelectedTimeSlot('');
        toast.error('Failed to fetch available time slots for the selected date.');
      });

    return () => {
      active = false;
    };
  }, [dateStr, selectedStylist]);

  // Month navigation helpers
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const yearName = currentDate.getFullYear();
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDayIndex = getFirstDayIndex(currentDate.getFullYear(), currentDate.getMonth());

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startDayIndex }, () => null);
  const combinedDays = [...blanksArray, ...daysArray];

  const handleMonthPrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleMonthNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedServiceDetails = servicesList.find(s => s.id === selectedService);
  const selectedStylistDetails = stylistsList.find(s => s.id === selectedStylist);

  const handleBookNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please log in to book an appointment.');
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill out all required fields marked with *');
      return;
    }
    if (!selectedDay) {
      toast.error('Please select a date from the calendar');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select an available time slot');
      return;
    }

    try {
      const payload = {
        stylistId: selectedStylist,
        serviceIds: [selectedService],
        date: dateStr,
        time: selectedTimeSlot,
        notes: formData.notes
      };

      await apiClient.post<AppointmentDTO>('/api/v1/appointments', payload);
      setIsBooked(true);
      toast.success('Appointment booked successfully!');
    } catch (err: any) {
      console.error('Booking failed:', err);
      toast.error(err.message || 'Failed to book appointment. Please try again.');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-24 text-white">
      <PageHeading title="Appointment" breadcrumbs={[{ label: 'Appointment', href: '/appointment' }]} />

      {/* Services Showcase */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-xs block mb-3 font-manrope">Our Expertise</span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold mb-4">Salon Service Catalog</h2>
          <p className="text-white/60 font-manrope text-sm leading-relaxed">
            Select one of our specialized salon services for booking. All services are performed using organic, high-performance hair care products.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {servicesList.map((service) => {
            const isSelected = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex flex-col items-center p-6 rounded-2xl border text-center transition-all duration-300 group ${
                  isSelected
                    ? 'bg-secondary border-primary shadow-lg shadow-primary/10'
                    : 'bg-secondary/20 border-primary/10 hover:border-primary/30 hover:bg-secondary/40'
                }`}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-secondary/80 rounded-xl border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                  <LucideIcon name={service.icon || 'Scissors'} className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-cormorant text-2xl font-bold mb-1">{service.name}</h4>
                <p className="text-primary font-bold font-manrope text-sm">${service.price}</p>
                <p className="text-white/40 text-xs mt-1 font-manrope">{service.duration}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Booking Orchestrator Split Layout */}
      <section className="max-w-8xl mx-auto px-4 md:px-8 mt-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Scheduler Panel */}
          <div className="lg:col-span-8 bg-secondary/20 border border-primary/10 rounded-3xl p-6 md:p-8 space-y-8">
            <h3 className="font-cormorant text-3xl font-bold text-white border-b border-primary/10 pb-4">
              1. Select Date &amp; Time
            </h3>

            {/* Dynamic React Calendar */}
            <div className="bg-secondary/40 border border-primary/15 rounded-2xl p-5 shadow-inner">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold font-cormorant tracking-wide uppercase text-primary">
                  {monthName} {yearName}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleMonthPrev}
                    className="p-2 bg-secondary border border-primary/20 hover:border-primary text-white rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    onClick={handleMonthNext}
                    className="p-2 bg-secondary border border-primary/20 hover:border-primary text-white rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-primary" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-white/40 mb-3 font-manrope">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {combinedDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="p-3"></div>;
                  }

                  const isSelected = selectedDay === day;
                  const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = checkDate < today;
                  
                  return (
                    <button
                      key={`day-${day}`}
                      disabled={isPast}
                      onClick={() => setSelectedDay(day)}
                      className={`p-3 font-manrope font-semibold rounded-xl text-sm transition-all ${
                        isPast
                          ? 'text-white/10 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary text-secondary font-bold shadow-md shadow-primary/20 scale-105'
                          : 'bg-secondary/60 hover:bg-primary/20 text-white/80 border border-primary/5 hover:border-primary/25'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-4">
              <h4 className="font-cormorant text-2xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Select Available Time Slot
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    const isAvailable = slot.availableStylists.length > 0;
                    return (
                      <button
                        key={slot.time}
                        disabled={!isAvailable}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`relative p-3 rounded-xl border text-xs font-semibold font-manrope transition-all text-center overflow-hidden ${
                          !isAvailable
                            ? 'bg-secondary/10 border-red-500/10 text-white/20 line-through decoration-red-500/30 bg-[linear-gradient(135deg,transparent_45%,rgba(239,68,68,0.15)_49%,rgba(239,68,68,0.15)_51%,transparent_55%)] cursor-not-allowed'
                            : isSelected
                            ? 'bg-primary text-secondary border-primary font-bold shadow-md shadow-primary/20 scale-105'
                            : 'bg-secondary/40 border-primary/10 hover:border-primary/30 text-white/70'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })
                ) : (
                  <p className="col-span-4 text-sm text-white/40 italic text-center py-4">
                    No time slots available for the selected date/stylist.
                  </p>
                )}
              </div>
            </div>

            {/* Stylist Selector */}
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <h4 className="font-cormorant text-2xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Select Stylist / Professional
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stylistsList.map((stylist) => {
                  const isSelected = selectedStylist === stylist.id;
                  return (
                    <button
                      key={stylist.id}
                      onClick={() => setSelectedStylist(stylist.id)}
                      className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-secondary border-primary shadow-lg'
                          : 'bg-secondary/20 border-primary/10 hover:border-primary/20'
                      }`}
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3 border border-primary/10">
                        <Image src={stylist.image || '/img/Team/team-1.jpg'} alt={stylist.name} fill sizes="64px" className="object-cover object-top" />
                      </div>
                      <span className="font-semibold text-sm text-center leading-tight line-clamp-1">{stylist.name}</span>
                      <span className="text-[10px] text-white/50 mt-0.5 line-clamp-1">{stylist.role}</span>
                      <div className="flex items-center gap-1 text-[10px] text-primary mt-1 font-bold">
                        <Star className="w-2.5 h-2.5 fill-primary" /> 4.9
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Info & Submission Form */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Booking Details Recap Card */}
            <div className="bg-secondary/35 border border-primary/15 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="font-cormorant text-2xl font-bold text-white border-b border-primary/10 pb-3">
                Booking Details
              </h3>
              
              <div className="space-y-4 font-manrope text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Service</span>
                  <span className="font-semibold text-white">{selectedServiceDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Duration</span>
                  <span className="font-semibold text-white">{selectedServiceDetails?.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Stylist</span>
                  <span className="font-semibold text-white">{selectedStylistDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Date</span>
                  <span className="font-semibold text-white">
                    {selectedDay ? `${monthName} ${selectedDay}, ${yearName}` : 'No date selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Time Slot</span>
                  <span className="font-semibold text-white">{selectedTimeSlot}</span>
                </div>
                <div className="border-t border-primary/10 pt-4 flex justify-between items-center text-base">
                  <span className="font-bold text-white">Service Price</span>
                  <span className="font-bold text-primary text-lg">${selectedServiceDetails?.price}</span>
                </div>
              </div>
            </div>

            {/* Submission Form Card */}
            <div className="bg-secondary/20 border border-primary/10 rounded-3xl p-6 md:p-8">
              <h3 className="font-cormorant text-2xl font-bold text-white border-b border-primary/10 pb-3 mb-6">
                2. Your Information
              </h3>

              <form onSubmit={handleBookNow} className="space-y-4 font-manrope">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 pl-1">
                    Your Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your full name"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 pl-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your email"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 pl-1">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. +1 (555) 000-0000"
                    className="bg-secondary/45 text-white border-primary/35 placeholder:text-white/30 h-12 rounded-xl focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2 pl-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Let us know if you have specific requests..."
                    className="w-full bg-secondary/45 text-white border border-primary/35 placeholder:text-white/30 rounded-xl p-3 focus:border-primary focus:outline-none transition-colors text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  className="btn-primary w-full h-14 rounded-xl font-bold text-base mt-2 transition-transform duration-100 active:scale-98 shadow-lg shadow-primary/10"
                >
                  Book Appointment Now
                </Button>
              </form>
            </div>
            
          </div>
        </div>
      </section>

      {/* Booking Success Dialog Overlay */}
      {isBooked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-secondary border border-primary/30 max-w-md w-full rounded-3xl p-8 text-center space-y-6 shadow-2xl relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/20">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <h3 className="font-cormorant text-3xl font-bold text-white">Booking Confirmed!</h3>
            
            <div className="font-manrope text-sm space-y-3 bg-secondary/40 border border-primary/5 p-4 rounded-2xl text-left">
              <p className="text-white/60">We&apos;ve reserved your session. Here details:</p>
              <div className="text-white font-medium space-y-1.5 pt-1">
                <div>• <span className="text-primary">Service:</span> {selectedServiceDetails?.name}</div>
                <div>• <span className="text-primary">Stylist:</span> {selectedStylistDetails?.name}</div>
                <div>• <span className="text-primary">Time:</span> {monthName} {selectedDay} at {selectedTimeSlot}</div>
                <div>• <span className="text-primary">Customer:</span> {formData.name}</div>
              </div>
            </div>

            <p className="text-white/50 text-xs font-manrope">
              A confirmation email has been sent to <span className="text-white font-medium">{formData.email}</span>. If you need to reschedule, call us.
            </p>

            <Button
              onClick={() => setIsBooked(false)}
              className="btn-primary w-full h-12 rounded-xl font-bold"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
