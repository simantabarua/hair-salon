'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  History, 
  ShoppingBag, 
  User, 
  Award, 
  CreditCard, 
  Clock, 
  UserCheck,
  Trash2, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import PageHeading from '@/components/layout/PageHeading';
import AureliaLogo from '@/components/ui/AureliaLogo';

interface Appointment {
  id: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: string;
  total: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');

  // Dashboard state
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT-9241',
      service: 'Hair Cut & Styling',
      stylist: 'Sarah Peterson',
      date: '2026-06-25',
      time: '10:00 AM',
      price: 45.00,
      status: 'Confirmed',
    },
    {
      id: 'APT-8812',
      service: 'Facial & Skin Care',
      stylist: 'Elena Rostova',
      date: '2026-07-02',
      time: '02:30 PM',
      price: 60.00,
      status: 'Pending',
    },
  ]);

  const [pastVisits] = useState<Appointment[]>([
    {
      id: 'APT-4109',
      service: 'Shaving & Beard Trim',
      stylist: 'Marcus Brody',
      date: '2026-05-18',
      time: '11:00 AM',
      price: 30.00,
      status: 'Confirmed',
    },
    {
      id: 'APT-2051',
      service: 'Hair Dye & Coloring',
      stylist: 'Elena Rostova',
      date: '2026-04-10',
      time: '03:00 PM',
      price: 85.00,
      status: 'Confirmed',
    },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: 'ORD-9831',
      date: '2026-06-12',
      status: 'Shipped',
      items: '1x Hair Conditioner (120ml), 1x Hair Shampoo (120ml)',
      total: 149.00,
    },
    {
      id: 'ORD-9214',
      date: '2026-05-22',
      status: 'Delivered',
      items: '1x Organic Face Wash (120ml)',
      total: 74.50,
    },
  ]);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('(555) 019-2834');
  const [loyaltyPoints] = useState(280);

  // Hair Profile Preferences
  const [hairType, setHairType] = useState('curly');
  const [hairConcerns, setHairConcerns] = useState<string[]>(['dryness', 'frizz']);
  const [preferredStylist, setPreferredStylist] = useState('Sarah Peterson');

  // Reschedule state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-06-26');
  const [newTime, setNewTime] = useState('11:00 AM');

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = () => {
      const storedUser = localStorage.getItem('salon_user');
      if (!storedUser) {
        toast.error('Access Denied. Please log in first.', { duration: 4000 });
        router.replace('/login');
      } else {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setProfileName(parsed.name || '');
          setProfileEmail(parsed.email || '');
          setCheckingAuth(false);
        } catch {
          localStorage.removeItem('salon_user');
          router.replace('/login');
        }
      }
    };

    Promise.resolve().then(verifyAuth);
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('salon_user');
    localStorage.removeItem('salon_remember');
    toast.success('Signed out successfully.');
    router.push('/');
    window.dispatchEvent(new Event('storage'));
  };

  // Appointment Cancellation
  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => 
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'Cancelled' as const } : apt))
    );
    toast.success(`Appointment ${id} has been cancelled successfully.`, {
      description: 'Your refund or schedule release has been processed.',
    });
  };

  // Appointment Rescheduling
  const handleReschedule = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => 
        apt.id === id ? { ...apt, date: newDate, time: newTime, status: 'Pending' as const } : apt
      )
    );
    setReschedulingId(null);
    toast.success(`Rescheduled successfully!`, {
      description: `Your new appointment request for ${newDate} at ${newTime} is pending stylist approval.`,
    });
  };

  // Profile Update Submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      toast.error('Name and Email are required.');
      return;
    }

    // Save back to localStorage
    const updatedUser = { ...user, name: profileName, email: profileEmail };
    localStorage.setItem('salon_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Dispatch storage event to trigger Navbar and header sync
    window.dispatchEvent(new Event('storage'));

    toast.success('Profile settings updated successfully! 🌟');
  };

  // Hair Concern Checklist toggle
  const toggleHairConcern = (concern: string) => {
    setHairConcerns((prev) => 
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  // Profile preferences saving
  const handleSavePreferences = () => {
    toast.success('Hair profile preferences saved!', {
      description: 'Your stylist will review these parameters before your next appointment.',
    });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <AureliaLogo size={48} className="text-primary animate-pulse" />
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-manrope text-sm tracking-widest text-white/50 uppercase">Securing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 md:pb-32 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <PageHeading title="Client Dashboard" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-20 relative z-10">
        
        {/* User Welcome & Loyalty Tier Section */}
        <section className="bg-gradient-to-r from-secondary/30 to-black border border-primary/15 rounded-3xl p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-manrope text-xs font-bold text-primary uppercase tracking-widest">Client Portal</span>
            </div>
            <h1 className="font-cormorant text-4xl md:text-5xl font-bold capitalize">
              Welcome Back, {user?.name}
            </h1>
            <p className="font-manrope text-sm text-white/60">
              Manage your premium bookings, track store orders, and refine your styling preferences.
            </p>
          </div>

          {/* Loyalty Tracker */}
          <div className="bg-secondary/40 border border-primary/20 p-5 rounded-2xl md:min-w-[320px] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-grow space-y-1.5 font-manrope">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-primary">Gold Tier Member</span>
                <span className="text-white/85">{loyaltyPoints} / 500 Pts</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(loyaltyPoints / 500) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-white/40">220 points left to unlock Platinum rewards</p>
            </div>
          </div>
        </section>

        {/* Quick Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          
          <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-5 flex items-center gap-4 font-manrope">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-semibold tracking-wider">Bookings</p>
              <p className="text-2xl font-cormorant font-bold text-white mt-0.5">
                {appointments.filter(a => a.status !== 'Cancelled').length} Active
              </p>
            </div>
          </div>

          <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-5 flex items-center gap-4 font-manrope">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-semibold tracking-wider">Past Visits</p>
              <p className="text-2xl font-cormorant font-bold text-white mt-0.5">{pastVisits.length} Services</p>
            </div>
          </div>

          <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-5 flex items-center gap-4 font-manrope">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-semibold tracking-wider">Product Orders</p>
              <p className="text-2xl font-cormorant font-bold text-white mt-0.5">{orders.length} Placed</p>
            </div>
          </div>

          <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-5 flex items-center gap-4 font-manrope">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-semibold tracking-wider">Gift Balance</p>
              <p className="text-2xl font-cormorant font-bold text-white mt-0.5">$50.00 Active</p>
            </div>
          </div>

        </section>

        {/* Tabs and Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Sidebar navigation tabs */}
          <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-none border-b border-primary/10 lg:border-b-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-manrope text-sm font-semibold whitespace-nowrap transition-all duration-300 w-full justify-start ${
                activeTab === 'overview'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-manrope text-sm font-semibold whitespace-nowrap transition-all duration-300 w-full justify-start ${
                activeTab === 'orders'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Purchase History</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-manrope text-sm font-semibold whitespace-nowrap transition-all duration-300 w-full justify-start ${
                activeTab === 'profile'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            {/* Logout button */}
            <div className="hidden lg:block border-t border-primary/10 mt-6 pt-6">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-manrope text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </aside>

          {/* Right Column: Active Tab Content Panels */}
          <div className="flex-1 w-full min-h-[450px]">
            
            {/* Overview / Appointments Panel */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Upcoming Bookings Card Set */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <h3 className="font-cormorant text-2xl font-bold tracking-wide">Upcoming Appointments</h3>
                    <Link href="/appointment">
                      <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary hover:text-black font-semibold text-xs rounded-lg">
                        Book Another Slot
                      </Button>
                    </Link>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="bg-secondary/10 border border-primary/5 rounded-2xl p-8 text-center font-manrope text-white/50 space-y-3">
                      <p>You have no upcoming appointments scheduled.</p>
                      <Link href="/appointment" className="inline-block text-primary underline underline-offset-2 hover:text-white">
                        Book your style session now
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {appointments.map((apt) => (
                        <div 
                          key={apt.id} 
                          className={`bg-secondary/15 border rounded-2xl p-5 md:p-6 transition-all font-manrope relative overflow-hidden ${
                            apt.status === 'Cancelled' ? 'border-red-950 opacity-60' : 'border-primary/10 hover:border-primary/20'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            {/* Service Details */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">{apt.id}</span>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  apt.status === 'Confirmed' 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                    : apt.status === 'Pending' 
                                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {apt.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3" />}
                                  {apt.status === 'Pending' && <Clock className="w-3 h-3" />}
                                  {apt.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                                  {apt.status}
                                </span>
                              </div>
                              <h4 className="font-cormorant text-2xl font-semibold text-white tracking-wide">{apt.service}</h4>
                              
                              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-white/50">
                                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-primary" /> {apt.stylist}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-primary" /> {apt.date}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> {apt.time}</span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-4 flex-shrink-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                              <div className="text-xl font-cormorant font-bold text-primary">
                                ${apt.price.toFixed(2)}
                              </div>
                              
                              {apt.status !== 'Cancelled' && (
                                <div className="flex items-center gap-2">
                                  <Button 
                                    onClick={() => setReschedulingId(apt.id)} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs hover:bg-white/5 hover:text-white"
                                  >
                                    Reschedule
                                  </Button>
                                  <Button 
                                    onClick={() => handleCancelAppointment(apt.id)} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                                  </Button>
                                </div>
                              )}
                            </div>

                          </div>

                          {/* Reschedule Picker Modal Box inside Card */}
                          {reschedulingId === apt.id && (
                            <div className="mt-5 pt-5 border-t border-primary/20 bg-black/40 p-4 rounded-xl space-y-4">
                              <h5 className="font-cormorant text-lg font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                <RefreshCw className="w-4 h-4 animate-spin-slow text-primary" /> Pick New Time Slot
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1">New Date</label>
                                  <Input 
                                    type="date" 
                                    value={newDate} 
                                    onChange={(e) => setNewDate(e.target.value)} 
                                    className="h-10 bg-secondary border-primary/20 text-white rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-1">New Time</label>
                                  <select 
                                    value={newTime} 
                                    onChange={(e) => setNewTime(e.target.value)} 
                                    className="w-full h-10 px-3 bg-secondary border border-primary/20 text-white rounded-lg font-manrope text-sm focus:border-primary outline-none"
                                  >
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="02:30 PM">02:30 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                  </select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-2 text-xs">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setReschedulingId(null)}
                                  className="h-9 hover:bg-white/5"
                                >
                                  Cancel Selection
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleReschedule(apt.id)}
                                  className="h-9 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg"
                                >
                                  Confirm Request
                                </Button>
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History Table */}
                <div className="space-y-4">
                  <div className="border-b border-primary/10 pb-3">
                    <h3 className="font-cormorant text-2xl font-bold tracking-wide">Visits History</h3>
                  </div>

                  <div className="bg-secondary/10 border border-primary/5 rounded-2xl overflow-hidden font-manrope">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-primary/15 text-[11px] text-white/50 uppercase tracking-widest font-bold bg-secondary/20">
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Stylist</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Cost</th>
                            <th className="py-3 px-4 text-right">Rebook</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-white/5">
                          {pastVisits.map((visit) => (
                            <tr key={visit.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-4 px-4 font-cormorant text-lg font-bold text-white">{visit.service}</td>
                              <td className="py-4 px-4 text-white/70">{visit.stylist}</td>
                              <td className="py-4 px-4 text-white/60">{visit.date}</td>
                              <td className="py-4 px-4 text-primary font-semibold">${visit.price.toFixed(2)}</td>
                              <td className="py-4 px-4 text-right">
                                <Link href="/appointment">
                                  <button className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
                                    Book Again <ChevronRight className="w-3 h-3" />
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Purchase History Panel */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-primary/10 pb-3">
                  <h3 className="font-cormorant text-2xl font-bold tracking-wide">Recent Orders</h3>
                </div>

                <div className="grid gap-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-secondary/15 border border-primary/10 rounded-2xl p-5 md:p-6 font-manrope hover:border-primary/20 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{ord.id}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              ord.status === 'Delivered'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : ord.status === 'Shipped'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-white/40">Ordered on {ord.date}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-white/40">Total Price</p>
                          <p className="text-lg font-cormorant font-bold text-primary">${ord.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="space-y-0.5">
                          <p className="text-xs text-white/40">Items</p>
                          <p className="text-white/80 font-medium line-clamp-1">{ord.items}</p>
                        </div>
                        <Link href={`/shop`}>
                          <button className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex-shrink-0">
                            Track Order
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile & Hair Preferences Panel */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Profile Edit Form */}
                <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-6 md:p-8 font-manrope">
                  <h3 className="font-cormorant text-2xl font-bold tracking-wide mb-6 border-b border-primary/10 pb-3">Personal Details</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Full Name</label>
                        <Input 
                          type="text" 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)} 
                          className="h-11 bg-secondary border-primary/15 rounded-xl text-sm focus:border-primary text-white"
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Email Address</label>
                        <Input 
                          type="email" 
                          value={profileEmail} 
                          onChange={(e) => setProfileEmail(e.target.value)} 
                          className="h-11 bg-secondary border-primary/15 rounded-xl text-sm focus:border-primary text-white"
                          placeholder="Your email address"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Phone Number</label>
                        <Input 
                          type="text" 
                          value={profilePhone} 
                          onChange={(e) => setProfilePhone(e.target.value)} 
                          className="h-11 bg-secondary border-primary/15 rounded-xl text-sm focus:border-primary text-white"
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Preferred Shop Location</label>
                        <select 
                          className="w-full h-11 px-3 bg-secondary border border-primary/15 text-white/80 rounded-xl font-manrope text-sm focus:border-primary outline-none"
                        >
                          <option value="downtown">Downtown Luxury Aurelia (5th Avenue)</option>
                          <option value="uptown">Uptown Heights Suite (Madison Road)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" className="bg-primary hover:bg-primary/95 text-black font-bold uppercase tracking-wider text-xs px-6 h-11 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                        Update Personal Details
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Hair Profile Preferences */}
                <div className="bg-secondary/15 border border-primary/10 rounded-2xl p-6 md:p-8 font-manrope space-y-6">
                  <div>
                    <h3 className="font-cormorant text-2xl font-bold tracking-wide border-b border-primary/10 pb-3">My Styling Profile</h3>
                    <p className="text-xs text-white/50 mt-1">This styling profile helps our specialists prepare customized organic formulas and tools for your sessions.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Hair Type Selector */}
                    <div className="space-y-3">
                      <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Hair Type</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['straight', 'wavy', 'curly', 'coily'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setHairType(type)}
                            className={`py-2 px-3 rounded-xl border text-xs capitalize font-semibold transition-all ${
                              hairType === type
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-secondary/30 border-primary/15 text-white/60 hover:border-primary/45 hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hair Concerns Checklist */}
                    <div className="space-y-3">
                      <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Primary Concerns</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'dryness', label: 'Dryness & Dehydration' },
                          { id: 'frizz', label: 'Frizz Control' },
                          { id: 'volume', label: 'Thinning & Volume Loss' },
                          { id: 'scalp', label: 'Scalp Sensitivity' },
                          { id: 'color', label: 'Color Retention & Bleaching' },
                          { id: 'split-ends', label: 'Damage & Split Ends' },
                        ].map((concern) => (
                          <button
                            key={concern.id}
                            type="button"
                            onClick={() => toggleHairConcern(concern.id)}
                            className="flex items-center gap-3 p-3 rounded-xl border border-primary/10 bg-secondary/20 hover:border-primary/30 transition-all text-left"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              hairConcerns.includes(concern.id) ? 'bg-primary border-primary' : 'border-white/30'
                            }`}>
                              {hairConcerns.includes(concern.id) && (
                                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-xs font-medium text-white/80">{concern.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Stylist */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider text-white/60 font-semibold">Preferred Stylist</label>
                      <select 
                        value={preferredStylist}
                        onChange={(e) => setPreferredStylist(e.target.value)}
                        className="w-full h-11 px-3 bg-secondary border border-primary/15 text-white/80 rounded-xl font-manrope text-sm focus:border-primary outline-none"
                      >
                        <option value="Tranter Jaskulski">Tranter Jaskulski (Founder & Specialist)</option>
                        <option value="Sarah Peterson">Sarah Peterson (Master Hair Stylist)</option>
                        <option value="Marcus Brody">Marcus Brody (Expert Barber)</option>
                        <option value="Elena Rostova">Elena Rostova (Color Specialist)</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button 
                        onClick={handleSavePreferences}
                        className="bg-primary hover:bg-primary/95 text-black font-bold uppercase tracking-wider text-xs px-6 h-11 rounded-xl shadow-lg transition-all active:scale-[0.98]"
                      >
                        Save Styling Preferences
                      </Button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
