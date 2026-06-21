'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import {
  Calendar,
  Users,
  Scissors,
  ShoppingBag,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ShoppingBag as OrderIcon,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Settings,
  ChevronRight,
  Menu,
  Bell,
  LogOut,
  ChevronDown,
  Package
} from 'lucide-react';
import { Appointment, Order } from '@/lib/db';
import { Service, Product, TeamMember, BlogPost } from '@/data/salonData';
import { apiClient } from '@/lib/apiClient';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

type TabType = 'overview' | 'appointments' | 'orders' | 'services' | 'products' | 'inventory' | 'stylists' | 'blogs';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = status === 'loading' ? null : (session?.user?.role === 'admin' ? true : false);
  const userProfile = session?.user ? { name: session.user.name || 'Admin', email: session.user.email || '' } : null;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Appointment', desc: 'Sasha Colette booked Balayage with Marcus.', time: '5m ago', read: false },
    { id: 2, title: 'Inventory Warning', desc: 'Hydrating Conditioner is running low on stock.', time: '2h ago', read: false },
    { id: 3, title: 'Order Completed', desc: 'Order #ORD-8492 has been dispatched.', time: '5h ago', read: true },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const clickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  // Database States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit / Add States
  const [editingItem, setEditingItem] = useState<{
    type: 'service' | 'product' | 'team' | 'blog';
    data: Service | Product | TeamMember | BlogPost;
  } | null>(null);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  // Form States
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({});
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({});
  const [apptForm, setApptForm] = useState<Partial<Appointment>>({});

  // Inventory UI and Update States
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All');
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [inventoryForm, setInventoryForm] = useState<{ stock: number; minStock: number; sku: string } | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [apptsRes, ordersRes, servicesRes, productsRes, usersRes, blogsRes] = await Promise.all([
        apiClient.get<any>('/api/v1/appointments'),
        apiClient.get<any>('/api/v1/orders'),
        apiClient.get<any>('/api/v1/services'),
        apiClient.get<any>('/api/v1/products'),
        apiClient.get<any>('/api/v1/users?role=staff'),
        apiClient.get<any>('/api/v1/blogs'),
      ]);

      const apptsData = apptsRes.appointments || apptsRes || [];
      setAppointments(apptsData.map((a: any) => ({
        id: a.id || a._id,
        userEmail: a.userId?.email || 'N/A',
        service: a.serviceIds?.map((s: any) => s.name).join(', ') || 'N/A',
        stylist: a.stylistId?.name || 'N/A',
        date: a.date,
        time: a.time,
        price: a.price,
        status: a.status
      })));

      const ordersData = ordersRes.orders || ordersRes || [];
      setOrders(ordersData.map((o: any) => ({
        id: o.id || o._id,
        customerName: o.customerName || (o.userId?.name || 'N/A'),
        userEmail: o.userId?.email || 'N/A',
        items: o.items?.map((item: any) => `${item.quantity}x ${item.name}`).join(', ') || 'N/A',
        total: o.total,
        status: o.status
      })));

      const servicesData = servicesRes.services || servicesRes || [];
      setServices(servicesData.map((s: any) => ({
        id: s.id || s._id,
        name: s.name,
        price: s.price,
        duration: s.duration,
        image: s.image,
        icon: s.icon,
        description: s.description || '',
      })));

      const productsData = productsRes.products || productsRes || [];
      setProducts(productsData.map((p: any) => ({
        id: p.id || p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: p.rating || 5,
        ratingCount: p.ratingCount || 1,
        description: p.description || '',
        tags: p.tags || [],
        stock: p.stock ?? 0,
        minStock: p.minStock ?? 0,
        sku: p.sku || '',
      })));

      setTeam((usersRes || []).map((u: any) => ({
        id: u.id || u._id,
        name: u.name,
        role: u.role || 'staff',
        image: u.image || '/img/About Section/Team-1.png',
        facebook: u.facebook || '#',
        instagram: u.instagram || '#',
        tiktok: u.tiktok || '#',
        bio: u.bio || '',
        specialties: u.specialties || [],
        achievements: u.achievements || [],
        schedule: u.schedule || '',
      })));

      const blogsData = blogsRes.posts || blogsRes || [];
      setBlogs(blogsData.map((b: any) => ({
        id: b.id || b._id,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        author: b.author,
        date: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        image: b.image,
        category: b.category,
      })));
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast.error("Failed to load administration data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === true) {
      fetchAllData();
    } else if (isAdmin === false) {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleInventorySubmit = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!inventoryForm) return;
    try {
      await apiClient.put(`/api/v1/products/${productId}`, {
        stock: inventoryForm.stock,
        minStock: inventoryForm.minStock,
        sku: inventoryForm.sku
      });
      setEditingInventoryId(null);
      setInventoryForm(null);
      toast.success('Inventory settings updated successfully.');
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update inventory.');
    }
  };

  const adjustStock = async (productId: string, amount: number) => {
    const item = products.find(p => p.id === productId);
    if (!item) return;
    
    const newStock = Math.max(0, (item.stock ?? 0) + amount);
    try {
      await apiClient.put(`/api/v1/products/${productId}`, {
        stock: newStock
      });
      toast.success(`Stock adjusted for ${item.name}.`);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to adjust stock.');
    }
  };

  // Loading Screen
  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-white/60 font-manrope">Authenticating secure administrative session...</p>
      </div>
    );
  }

  // Access Denied Screen
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-secondary border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500" />
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-2xl font-playfair font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60 font-manrope text-sm mb-8 leading-relaxed">
            This workspace contains private configuration files and customer databases. You do not possess the required digital credentials to access the Aurelia Salon Management portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="px-6 py-2.5 bg-primary text-black font-manrope font-bold rounded-xl text-sm hover:bg-primary/90 transition-all">
              Sign In with Admin Account
            </Link>
            <Link href="/" className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-manrope font-semibold rounded-xl text-sm hover:bg-white/10 transition-all">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- STATS HELPER ---
  const totalRevenue = appointments.reduce((sum, a) => a.status === 'Confirmed' ? sum + a.price : sum, 0) + 
                       orders.reduce((sum, o) => o.status === 'Delivered' ? sum + o.total : sum, 0);

  // --- CHART DATA STRUCTURES ---
  const revenueTrendData = [
    { name: 'Mon', revenue: 3200 },
    { name: 'Tue', revenue: 2800 },
    { name: 'Wed', revenue: 7100 },
    { name: 'Thu', revenue: 5400 },
    { name: 'Fri', revenue: 9200 },
    { name: 'Sat', revenue: 8600 },
    { name: 'Sun', revenue: 12400 },
  ];

  const treatmentShareData = services.slice(0, 4).map((s, idx) => {
    const baseShares = [45, 30, 15, 10];
    return {
      name: s.name,
      value: baseShares[idx] || 10,
    };
  });

  const stylistLoadData = team.slice(0, 4).map((member, idx) => {
    const loads = [85, 65, 40, 25];
    return {
      name: member.name,
      load: loads[idx] || 20,
    };
  });

  const dispatchData = [
    { name: 'Completed', value: 72, color: '#cea561' },
    { name: 'Remaining', value: 28, color: 'rgba(255, 255, 255, 0.05)' },
  ];

  const satisfactionData = [
    { name: 'Completed', value: 90, color: '#4ade80' },
    { name: 'Remaining', value: 10, color: 'rgba(255, 255, 255, 0.05)' },
  ];

  // --- CRUD ACTIONS ---

  // Service Handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price || !serviceForm.duration) {
      toast.error('Please complete all mandatory fields.');
      return;
    }
    try {
      const payload = {
        name: serviceForm.name,
        price: Number(serviceForm.price),
        duration: serviceForm.duration,
        image: serviceForm.image || '',
        icon: serviceForm.icon || '',
        description: serviceForm.description || '',
      };

      if (serviceForm.id) {
        await apiClient.put(`/api/v1/services/${serviceForm.id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await apiClient.post('/api/v1/services', payload);
        toast.success('New service created successfully');
      }
      setServiceForm({});
      setIsAdding(null);
      setEditingItem(null);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save service.');
    }
  };

  const handleServiceDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await apiClient.delete(`/api/v1/services/${id}`);
        toast.success('Service deleted.');
        await fetchAllData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete service.');
      }
    }
  };

  // Product Handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('Please complete all mandatory fields.');
      return;
    }
    try {
      const payload: any = {
        name: productForm.name,
        price: Number(productForm.price),
        image: productForm.image || '',
        category: productForm.category,
        description: productForm.description || '',
        tags: typeof productForm.tags === 'string'
          ? (productForm.tags as string).split(',').map(t => t.trim())
          : (productForm.tags || []),
      };

      if (productForm.id) {
        await apiClient.put(`/api/v1/products/${productForm.id}`, payload);
        toast.success('Product updated successfully');
      } else {
        payload.sku = 'PRD-' + Math.random().toString(36).substring(2, 11).toUpperCase();
        payload.stock = 0;
        payload.minStock = 0;
        await apiClient.post('/api/v1/products', payload);
        toast.success('Product catalog updated successfully');
      }
      setProductForm({});
      setIsAdding(null);
      setEditingItem(null);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product.');
    }
  };

  const handleProductDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`/api/v1/products/${id}`);
        toast.success('Product deleted.');
        await fetchAllData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete product.');
      }
    }
  };

  // Stylist Handlers
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role) {
      toast.error('Please enter name and role.');
      return;
    }
    try {
      const payload: any = {
        name: teamForm.name,
        role: teamForm.role,
        image: teamForm.image || '',
        facebook: teamForm.facebook || '#',
        instagram: teamForm.instagram || '#',
        tiktok: teamForm.tiktok || '#',
        bio: teamForm.bio || '',
        specialties: typeof teamForm.specialties === 'string'
          ? (teamForm.specialties as string).split(',').map(s => s.trim())
          : (teamForm.specialties || []),
        achievements: typeof teamForm.achievements === 'string'
          ? (teamForm.achievements as string).split(',').map(a => a.trim())
          : (teamForm.achievements || []),
        schedule: teamForm.schedule || '9:00 AM - 6:00 PM',
      };

      if (teamForm.id) {
        await apiClient.put(`/api/v1/users/${teamForm.id}`, payload);
        toast.success('Stylist profile updated');
      } else {
        payload.email = teamForm.name.toLowerCase().replace(/\s+/g, '') + '@aurelia.com';
        payload.password = 'Stylist123!';
        await apiClient.post('/api/v1/users', payload);
        toast.success('Stylist hired successfully');
      }
      setTeamForm({});
      setIsAdding(null);
      setEditingItem(null);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save stylist.');
    }
  };

  const handleTeamDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await apiClient.delete(`/api/v1/users/${id}`);
        toast.success('Stylist removed.');
        await fetchAllData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to remove stylist.');
      }
    }
  };

  // Blog Handlers
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) {
      toast.error('Please write title, excerpt, and body content.');
      return;
    }
    try {
      const payload = {
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        content: blogForm.content,
        author: blogForm.author || 'Aurelia Editorial',
        image: blogForm.image || '',
        category: blogForm.category || 'Styling Tips',
      };

      if (blogForm.id) {
        await apiClient.put(`/api/v1/blogs/${blogForm.id}`, payload);
        toast.success('Blog article revised');
      } else {
        await apiClient.post('/api/v1/blogs', payload);
        toast.success('New article published successfully');
      }
      setBlogForm({});
      setIsAdding(null);
      setEditingItem(null);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish article.');
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await apiClient.delete(`/api/v1/blogs/${id}`);
        toast.success('Article deleted.');
        await fetchAllData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete article.');
      }
    }
  };

  // Appointment Status Updates
  const handleApptStatus = async (id: string, status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    try {
      await apiClient.put(`/api/v1/appointments/${id}`, { status });
      toast.success(`Appointment status set to ${status}`);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update appointment status.');
    }
  };

  // Order Status Updates
  const handleOrderStatus = async (id: string, status: 'Processing' | 'Shipped' | 'Delivered') => {
    try {
      await apiClient.put(`/api/v1/orders/${id}`, { status });
      toast.success(`Order set to ${status}`);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order status.');
    }
  };

  // Manual Appointment creation
  const handleApptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptForm.userEmail || !apptForm.service || !apptForm.stylist || !apptForm.date || !apptForm.time || !apptForm.price) {
      toast.error('Fill in all fields for the manual appointment booking.');
      return;
    }
    const selectedService = services.find(s => s.name === apptForm.service);
    const selectedStylist = team.find(t => t.name === apptForm.stylist);
    
    if (!selectedService || !selectedStylist) {
      toast.error('Selected service or stylist not found.');
      return;
    }

    try {
      const payload = {
        userEmail: apptForm.userEmail,
        serviceIds: [selectedService.id],
        stylistId: selectedStylist.id,
        date: apptForm.date,
        time: apptForm.time,
        price: Number(apptForm.price),
        status: apptForm.status || 'Confirmed',
      };

      await apiClient.post('/api/v1/appointments', payload);
      toast.success('Appointment created manually');
      setApptForm({});
      setIsAdding(null);
      await fetchAllData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to book appointment.');
    }
  };

  const handleApptDelete = async (id: string) => {
    if (confirm('Delete this booking?')) {
      try {
        await apiClient.delete(`/api/v1/appointments/${id}`);
        toast.success('Booking deleted.');
        await fetchAllData();
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete booking.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row font-manrope">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0b0b0b] border-r border-white/5 h-screen sticky top-0 shrink-0 justify-between">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-cormorant text-primary text-xl font-bold">
                A
              </div>
              <div>
                <h2 className="font-playfair text-sm font-bold text-white tracking-wide">Aurelia Salon</h2>
                <span className="text-[9px] text-primary tracking-widest uppercase font-semibold">Admin Suite</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {(['overview', 'appointments', 'orders', 'services', 'products', 'inventory', 'stylists', 'blogs'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsAdding(null);
                    setEditingItem(null);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-semibold capitalize flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-primary text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.15)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'overview' && <Settings className="w-4 h-4" />}
                  {tab === 'appointments' && <Calendar className="w-4 h-4" />}
                  {tab === 'orders' && <OrderIcon className="w-4 h-4" />}
                  {tab === 'services' && <Scissors className="w-4 h-4" />}
                  {tab === 'products' && <ShoppingBag className="w-4 h-4" />}
                  {tab === 'inventory' && <Package className="w-4 h-4" />}
                  {tab === 'stylists' && <Users className="w-4 h-4" />}
                  {tab === 'blogs' && <BookOpen className="w-4 h-4" />}
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Live Website</span>
          </Link>
          <div className="px-4 py-2 text-[10px] text-white/30 border-t border-white/5 pt-3">
            Authenticated Admin
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          {/* Sliding Menu */}
          <aside className="relative flex flex-col w-64 h-full bg-[#0b0b0b] border-r border-white/5 p-6 justify-between animate-in slide-in-from-left duration-250">
            <div className="flex flex-col flex-1 min-h-0">
              {/* Header with Close */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center font-cormorant text-primary text-lg font-bold">
                    A
                  </div>
                  <div>
                    <h2 className="font-playfair text-xs font-bold text-white tracking-wide">Aurelia Salon</h2>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                {(['overview', 'appointments', 'orders', 'services', 'products', 'inventory', 'stylists', 'blogs'] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsAdding(null);
                        setEditingItem(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-xs font-semibold capitalize flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-primary text-black font-bold shadow-[0_4px_20px_rgba(212,175,55,0.15)]'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab === 'overview' && <Settings className="w-4 h-4" />}
                      {tab === 'appointments' && <Calendar className="w-4 h-4" />}
                      {tab === 'orders' && <OrderIcon className="w-4 h-4" />}
                      {tab === 'services' && <Scissors className="w-4 h-4" />}
                      {tab === 'products' && <ShoppingBag className="w-4 h-4" />}
                      {tab === 'inventory' && <Package className="w-4 h-4" />}
                      {tab === 'stylists' && <Users className="w-4 h-4" />}
                      {tab === 'blogs' && <BookOpen className="w-4 h-4" />}
                      {tab}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer Area */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Live Website</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Unified Dashboard Header Bar */}
        <header className="bg-[#0b0b0b]/90 border-b border-white/5 px-6 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="lg:hidden w-6 h-6 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center font-cormorant text-primary text-sm font-bold">
                A
              </div>
              {/* Breadcrumbs for desktop, simple title for mobile */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/40">
                <span>Admin Suite</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary font-bold capitalize">{activeTab}</span>
              </div>
              <span className="sm:hidden font-playfair text-sm font-bold text-white tracking-wide capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-all focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-white/40">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex items-start gap-3 ${!n.read ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex-1 space-y-0.5">
                            <p className="text-xs font-bold text-white flex items-center justify-between">
                              {n.title}
                              <span className="text-[9px] text-white/30 font-normal">{n.time}</span>
                            </p>
                            <p className="text-[11px] text-white/60 leading-relaxed">{n.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 px-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all text-left focus:outline-none"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-cormorant text-primary text-sm font-bold uppercase">
                  {userProfile?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block">
                  <p className="text-[11px] font-bold text-white truncate max-w-[100px] leading-tight">
                    {userProfile?.name || 'Admin'}
                  </p>
                  <p className="text-[9px] text-white/40 leading-none">Owner</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/40" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-white/5">
                    <p className="text-xs font-bold text-white truncate">{userProfile?.name || 'Admin User'}</p>
                    <p className="text-[10px] text-white/40 truncate">{userProfile?.email || 'admin@aureliasalon.com'}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-white/40" />
                      <span>Back to Site</span>
                    </Link>
                    <button 
                    onClick={async () => {
                        localStorage.removeItem('salon_user');
                        localStorage.removeItem('salon_remember');
                        await signOut({ redirect: false });
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body Container */}
        <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto w-full max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary/10 pb-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-manrope font-semibold text-xs tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Aurelia Executive Salon Suite
              </div>
              <h1 className="text-3xl font-playfair font-bold text-white mt-1 capitalize">{activeTab} Manager</h1>
              <p className="text-white/40 mt-1 text-xs">
                {activeTab === 'overview' && 'Review overall operational logs, transaction totals, and database status.'}
                {activeTab === 'appointments' && 'Manage guest booking slots, modify times, and confirm appointments.'}
                {activeTab === 'orders' && 'Process orders, update delivery status, and coordinate shipments.'}
                {activeTab === 'services' && 'Modify the treatment menu list, styling service names, and prices.'}
                {activeTab === 'products' && 'Edit retail catalog state, inventory items, categorizations, and ratings.'}
                {activeTab === 'inventory' && 'Track shop inventory, manage stock levels, monitor alerts, and review product valuation.'}
                {activeTab === 'stylists' && 'Manage specialist stylist credentials, hiring profiles, and details.'}
                {activeTab === 'blogs' && 'Create editorial articles, manage hair care content, and tips.'}
              </p>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 min-h-[500px] shadow-2xl relative overflow-hidden backdrop-blur-md">

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h2 className="text-xl font-playfair font-bold text-white">System Overview</h2>
                <p className="text-white/40 text-xs mt-1">Review operational statistics, dynamic charts, and guest bookings.</p>
              </div>

              {/* Operational Statistics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#0e0e0e]/60 border border-primary/15 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-wider font-manrope">Gross Salon Revenue</div>
                  <div className="text-2xl font-bold font-playfair text-primary mt-2">${totalRevenue.toFixed(2)}</div>
                  <div className="text-[10px] text-green-400/80 mt-1 flex items-center gap-1 font-semibold font-manrope">
                    Completed bookings & orders
                  </div>
                </div>
                <div className="bg-[#0e0e0e]/60 border border-primary/15 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-wider font-manrope">Booked Slots</div>
                  <div className="text-2xl font-bold font-playfair text-white mt-2">{appointments.length}</div>
                  <div className="text-[10px] text-white/30 mt-1 font-manrope">
                    {appointments.filter(a => a.status === 'Pending').length} pending approval
                  </div>
                </div>
                <div className="bg-[#0e0e0e]/60 border border-primary/15 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-wider font-manrope">E-Commerce Orders</div>
                  <div className="text-2xl font-bold font-playfair text-white mt-2">{orders.length}</div>
                  <div className="text-[10px] text-white/30 mt-1 font-manrope">
                    {orders.filter(o => o.status === 'Processing').length} to package
                  </div>
                </div>
                <div className="bg-[#0e0e0e]/60 border border-primary/15 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-wider font-manrope">Total Services</div>
                  <div className="text-2xl font-bold font-playfair text-white mt-2">{services.length}</div>
                  <div className="text-[10px] text-white/30 mt-1 font-manrope">Active treatment list</div>
                </div>
                <div className="bg-[#0e0e0e]/60 border border-primary/15 rounded-xl p-5 shadow-lg flex flex-col justify-between col-span-2 lg:col-span-1">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-wider font-manrope">Active Staff</div>
                  <div className="text-2xl font-bold font-playfair text-white mt-2">{team.length}</div>
                  <div className="text-[10px] text-white/30 mt-1 font-manrope">Stylists and specialists</div>
                </div>
              </div>

              {/* Analytical Charts and Performance Bars */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Area Chart for Revenue Trend */}
                <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-xl p-6 shadow-xl lg:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-playfair text-sm font-bold text-white">Revenue & Engagement Trend</h3>
                        <p className="text-[10px] text-white/40 mt-0.5 font-manrope">Daily salon bookings performance ledger</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-manrope">
                        +24.5% Weekly
                      </span>
                    </div>
                    {/* Recharts Area Chart */}
                    <div className="h-44 w-full mt-4">
                      {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#cea561" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#cea561" stopOpacity={0.0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              stroke="rgba(255,255,255,0.35)" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              fontFamily="Manrope"
                            />
                            <YAxis 
                              stroke="rgba(255,255,255,0.35)" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              fontFamily="Manrope"
                              tickFormatter={(v) => `$${v}`}
                            />
                            <ChartTooltip
                              contentStyle={{
                                backgroundColor: '#0a0a0a',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                                fontFamily: 'Manrope',
                                fontSize: '11px',
                              }}
                              itemStyle={{ color: '#cea561' }}
                              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="#cea561" 
                              strokeWidth={2.5} 
                              fillOpacity={1} 
                              fill="url(#areaGradient)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full w-full bg-white/5 rounded-lg animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Recharts Bar Chart for Service share */}
                <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-playfair text-sm font-bold text-white mb-1">Treatment Share</h3>
                    <p className="text-[10px] text-white/40 mb-4 font-manrope">Bookings share per hair care service</p>
                  </div>
                  <div className="h-44 w-full">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={treatmentShareData} 
                          layout="vertical"
                          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            stroke="rgba(255,255,255,0.7)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            width={75}
                            fontFamily="Manrope"
                          />
                          <ChartTooltip
                            contentStyle={{
                              backgroundColor: '#0a0a0a',
                              borderColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontFamily: 'Manrope',
                              fontSize: '11px',
                            }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={8}>
                            {treatmentShareData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#cea561' : 'rgba(206, 165, 97, 0.35)'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-white/5 rounded-lg animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Stylists Load and secondary stats row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 3. Recharts Stylist Load Bar Chart */}
                <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-playfair text-sm font-bold text-white mb-1">Stylist Schedule Load</h3>
                    <p className="text-[10px] text-white/40 mb-4 font-manrope">Assigned salon bookings per specialist</p>
                  </div>
                  <div className="h-44 w-full">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={stylistLoadData} 
                          layout="vertical"
                          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                        >
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            stroke="rgba(255,255,255,0.7)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            width={90}
                            fontFamily="Manrope"
                          />
                          <ChartTooltip
                            contentStyle={{
                              backgroundColor: '#0a0a0a',
                              borderColor: 'rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: '#fff',
                              fontFamily: 'Manrope',
                              fontSize: '11px',
                            }}
                          />
                          <Bar dataKey="load" radius={[0, 4, 4, 0]} barSize={8}>
                            {stylistLoadData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill="rgba(255, 255, 255, 0.45)" 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full bg-white/5 rounded-lg animate-pulse" />
                    )}
                  </div>
                </div>

                {/* 4. Product Sales Target Progress using Recharts Donut charts */}
                <div className="bg-[#0e0e0e]/60 border border-white/5 rounded-xl p-6 shadow-xl flex flex-col justify-between lg:col-span-2">
                  <div>
                    <h3 className="font-playfair text-sm font-bold text-white mb-1">E-Commerce Target Fulfilled</h3>
                    <p className="text-[10px] text-white/40 mb-4 font-manrope">Monthly retail volume and delivery dispatch benchmarks</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-auto">
                    {/* Ring indicator 1 */}
                    <div className="flex items-center gap-4">
                      {mounted ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={dispatchData}
                                cx="50%"
                                cy="50%"
                                innerRadius={22}
                                outerRadius={28}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                              >
                                {dispatchData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white font-manrope">72%</div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
                      )}
                      <div className="font-manrope">
                        <h4 className="text-xs font-bold text-white">Dispatch Clearance</h4>
                        <p className="text-[10px] text-white/40 mt-0.5">72% target shipments shipped</p>
                      </div>
                    </div>

                    {/* Ring indicator 2 */}
                    <div className="flex items-center gap-4">
                      {mounted ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={satisfactionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={22}
                                outerRadius={28}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                              >
                                {satisfactionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white font-manrope">90%</div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
                      )}
                      <div className="font-manrope">
                        <h4 className="text-xs font-bold text-white">Customer Satisfaction</h4>
                        <p className="text-[10px] text-white/40 mt-0.5">Based on retail feedback loop</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Diagnostics Tables/Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Bookings Panel */}
                <div className="border border-white/5 bg-black/35 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-3">
                    <span className="font-playfair text-sm font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" /> Incoming Appointments
                    </span>
                    <button onClick={() => setActiveTab('appointments')} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                      Manage all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {appointments.slice(-4).reverse().map(a => (
                      <div key={a.id} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-primary/10">
                        <div>
                          <p className="font-semibold text-white">{a.service}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">With {a.stylist} on {a.date} at {a.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">${a.price}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            a.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                            a.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{a.status}</span>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && <p className="text-white/30 text-xs italic text-center py-6">No appointments booked.</p>}
                  </div>
                </div>

                {/* Recent Orders Panel */}
                <div className="border border-white/5 bg-black/35 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4 border-b border-primary/10 pb-3">
                    <span className="font-playfair text-sm font-bold text-white flex items-center gap-1.5">
                      <OrderIcon className="w-4 h-4 text-primary" /> Shop Order Bookings
                    </span>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                      Manage all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(-4).reverse().map(o => (
                      <div key={o.id} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-primary/10">
                        <div>
                          <p className="font-semibold text-white">{o.customerName}</p>
                          <p className="text-[10px] text-white/40 mt-0.5 max-w-[200px] truncate">{o.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">${o.total.toFixed(2)}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            o.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                            o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-white/30 text-xs italic text-center py-6">No shop orders processed yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-playfair font-bold text-white">Treatment Bookings</h2>
                  <p className="text-white/40 text-xs mt-1">Review active time slots, modify status, or manual schedule slots.</p>
                </div>
                <button
                  onClick={() => setIsAdding(isAdding === 'appt' ? null : 'appt')}
                  className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Book Appointment Manually
                </button>
              </div>

              {/* Add form */}
              {isAdding === 'appt' && (
                <form onSubmit={handleApptSubmit} className="bg-white/5 border border-primary/20 rounded-xl p-5 space-y-4 max-w-2xl">
                  <div className="text-sm font-bold text-primary pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>Manual Reservation Entry</span>
                    <button type="button" onClick={() => setIsAdding(null)}><X className="w-4 h-4 text-white/50 hover:text-white" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Customer Email</label>
                      <input
                        type="email"
                        value={apptForm.userEmail || ''}
                        onChange={e => setApptForm({...apptForm, userEmail: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="customer@domain.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Select Service</label>
                      <select
                        value={apptForm.service || ''}
                        onChange={e => setApptForm({...apptForm, service: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        required
                      >
                        <option value="">-- Choose Treatment --</option>
                        {services.map(s => <option key={s.id} value={s.name}>{s.name} (${s.price})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Stylist / Team Member</label>
                      <select
                        value={apptForm.stylist || ''}
                        onChange={e => setApptForm({...apptForm, stylist: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        required
                      >
                        <option value="">-- Choose Stylist --</option>
                        {team.map(t => <option key={t.id} value={t.name}>{t.name} ({t.role})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={apptForm.price || ''}
                        onChange={e => setApptForm({...apptForm, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="45"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Date</label>
                      <input
                        type="date"
                        value={apptForm.date || ''}
                        onChange={e => setApptForm({...apptForm, date: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Time</label>
                      <input
                        type="text"
                        value={apptForm.time || ''}
                        onChange={e => setApptForm({...apptForm, time: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="11:30 AM"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-lg hover:bg-primary/95 transition-all">
                    Register Reservation
                  </button>
                </form>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/5 text-white/40 font-semibold border-b border-white/10">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Client Email</th>
                      <th className="p-3.5">Treatment</th>
                      <th className="p-3.5">Stylist</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appointments.map(a => (
                      <tr key={a.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3.5 font-mono text-white/60">{a.id}</td>
                        <td className="p-3.5">{a.userEmail}</td>
                        <td className="p-3.5 font-semibold text-white">{a.service}</td>
                        <td className="p-3.5 text-white/70">{a.stylist}</td>
                        <td className="p-3.5">{a.date} @ {a.time}</td>
                        <td className="p-3.5 text-primary font-semibold">${a.price}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                            a.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{a.status}</span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {a.status !== 'Confirmed' && (
                            <button onClick={() => handleApptStatus(a.id, 'Confirmed')} className="p-1 bg-green-500/10 text-green-400 hover:bg-green-500/25 rounded transition-all" title="Confirm Appointment">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {a.status !== 'Cancelled' && (
                            <button onClick={() => handleApptStatus(a.id, 'Cancelled')} className="p-1 bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded transition-all" title="Cancel Appointment">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleApptDelete(a.id)} className="p-1 bg-white/5 text-white/50 hover:bg-red-500/25 hover:text-red-400 rounded transition-all" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-white/30 italic">No appointments registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-playfair font-bold text-white">E-Commerce Orders</h2>
                <p className="text-white/40 text-xs mt-1">Fulfill product purchase orders and configure shipment steps.</p>
              </div>

              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/5 text-white/40 font-semibold border-b border-white/10">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Client Name</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Products</th>
                      <th className="p-3.5">Total Paid</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3.5 font-mono text-white/60">{o.id}</td>
                        <td className="p-3.5 font-semibold text-white">{o.customerName}</td>
                        <td className="p-3.5">{o.userEmail}</td>
                        <td className="p-3.5 max-w-xs truncate text-white/70">{o.items}</td>
                        <td className="p-3.5 text-primary font-semibold">${o.total.toFixed(2)}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                            o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>{o.status}</span>
                        </td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          {o.status === 'Processing' && (
                            <button onClick={() => handleOrderStatus(o.id, 'Shipped')} className="px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-all text-[10px]">
                              Mark Shipped
                            </button>
                          )}
                          {o.status === 'Shipped' && (
                            <button onClick={() => handleOrderStatus(o.id, 'Delivered')} className="px-2 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded transition-all text-[10px]">
                              Mark Delivered
                            </button>
                          )}
                          <span className="text-white/20 text-[10px]">Active</span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-white/30 italic">No shop orders processed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-playfair font-bold text-white">Treatment Offerings</h2>
                  <p className="text-white/40 text-xs mt-1">Review, append, or modify active styling catalog packages.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(isAdding === 'service' ? null : 'service');
                    setServiceForm({});
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Treatment Service
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAdding === 'service' || editingItem?.type === 'service') && (
                <form onSubmit={handleServiceSubmit} className="bg-white/5 border border-primary/20 rounded-xl p-5 space-y-4 max-w-2xl">
                  <div className="text-sm font-bold text-primary pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>{editingItem ? 'Revise Treatment' : 'Draft New Treatment'}</span>
                    <button type="button" onClick={() => { setIsAdding(null); setEditingItem(null); }}><X className="w-4 h-4 text-white/50 hover:text-white" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Service Name</label>
                      <input
                        type="text"
                        value={serviceForm.name || ''}
                        onChange={e => setServiceForm({...serviceForm, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Deep Conditioning"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={serviceForm.price || ''}
                        onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="80"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Duration</label>
                      <input
                        type="text"
                        value={serviceForm.duration || ''}
                        onChange={e => setServiceForm({...serviceForm, duration: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="45 min"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Image Path</label>
                      <input
                        type="text"
                        value={serviceForm.image || ''}
                        onChange={e => setServiceForm({...serviceForm, image: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="/img/Services Section/Image-1.png"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Description</label>
                      <textarea
                        value={serviceForm.description || ''}
                        onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none h-20 resize-none"
                        placeholder="Detailed explanation of the treatment benefits..."
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-lg hover:bg-primary/95 transition-all">
                    {editingItem ? 'Apply Revisions' : 'Launch Service'}
                  </button>
                </form>
              )}

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(s => (
                  <div key={s.id} className="bg-secondary/20 border border-white/5 hover:border-primary/20 rounded-xl p-5 flex flex-col justify-between transition-all group">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="p-2 bg-primary/10 rounded-lg text-primary text-xs font-semibold">
                          {s.duration}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingItem({ type: 'service', data: s });
                              setServiceForm(s);
                              setIsAdding(null);
                            }}
                            className="p-1.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded text-white/60 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleServiceDelete(s.id)}
                            className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded text-white/60 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-base font-playfair font-bold text-white mt-4">{s.name}</h3>
                      <p className="text-white/40 text-xs mt-1 line-clamp-3 leading-relaxed">{s.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 mt-4 pt-4">
                      <span className="text-[10px] text-white/30 uppercase font-mono">ID: {s.id}</span>
                      <span className="text-lg font-bold font-playfair text-primary">${s.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-playfair font-bold text-white">Product Catalog</h2>
                  <p className="text-white/40 text-xs mt-1">Configure shop catalog, price tags, categories, and inventory tags.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(isAdding === 'product' ? null : 'product');
                    setProductForm({});
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Shop Product
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAdding === 'product' || editingItem?.type === 'product') && (
                <form onSubmit={handleProductSubmit} className="bg-white/5 border border-primary/20 rounded-xl p-5 space-y-4 max-w-2xl">
                  <div className="text-sm font-bold text-primary pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>{editingItem ? 'Update Catalog Product' : 'Introduce New Shop Product'}</span>
                    <button type="button" onClick={() => { setIsAdding(null); setEditingItem(null); }}><X className="w-4 h-4 text-white/50 hover:text-white" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name || ''}
                        onChange={e => setProductForm({...productForm, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Rejuvenating Hair Mask"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={productForm.price || ''}
                        onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="35"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Category</label>
                      <input
                        type="text"
                        value={productForm.category || ''}
                        onChange={e => setProductForm({...productForm, category: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Hair Care"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Tags (Comma Separated)</label>
                      <input
                        type="text"
                        value={typeof productForm.tags === 'string' ? productForm.tags : (productForm.tags || []).join(', ')}
                        onChange={e => setProductForm({...productForm, tags: e.target.value as unknown as string[]})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="organic, nourishing, vegan"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Image Path</label>
                      <input
                        type="text"
                        value={productForm.image || ''}
                        onChange={e => setProductForm({...productForm, image: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="/img/Products Section/conditioner.png"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Product Description</label>
                      <textarea
                        value={productForm.description || ''}
                        onChange={e => setProductForm({...productForm, description: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none h-20 resize-none"
                        placeholder="Enter the detailed specifications and usage instructions..."
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-lg hover:bg-primary/95 transition-all">
                    {editingItem ? 'Update Catalog' : 'Publish Product'}
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto border border-white/5 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/5 text-white/40 font-semibold border-b border-white/10">
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Rating (Count)</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all">
                        <td className="p-3.5 font-mono text-white/60">{p.id}</td>
                        <td className="p-3.5 font-semibold text-white">{p.name}</td>
                        <td className="p-3.5">{p.category}</td>
                        <td className="p-3.5 text-primary font-semibold">${p.price}</td>
                        <td className="p-3.5 text-white/70">⭐ {p.rating} ({p.ratingCount} reviews)</td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingItem({ type: 'product', data: p });
                              setProductForm(p);
                              setIsAdding(null);
                            }}
                            className="p-1 bg-white/5 text-white/50 hover:bg-primary/25 hover:text-primary rounded transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleProductDelete(p.id)} className="p-1 bg-white/5 text-white/50 hover:bg-red-500/25 hover:text-red-400 rounded transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-white/30 italic">No products listed.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. STYLISTS TAB */}
          {activeTab === 'stylists' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-playfair font-bold text-white">Stylist Directory</h2>
                  <p className="text-white/40 text-xs mt-1">Hire new experts, adjust specialization roles, or delete stylist entries.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(isAdding === 'team' ? null : 'team');
                    setTeamForm({});
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Recruit Stylist
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAdding === 'team' || editingItem?.type === 'team') && (
                <form onSubmit={handleTeamSubmit} className="bg-white/5 border border-primary/20 rounded-xl p-5 space-y-4 max-w-2xl">
                  <div className="text-sm font-bold text-primary pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>{editingItem ? 'Edit Profile' : 'Onboard Stylist'}</span>
                    <button type="button" onClick={() => { setIsAdding(null); setEditingItem(null); }}><X className="w-4 h-4 text-white/50 hover:text-white" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Stylist Name</label>
                      <input
                        type="text"
                        value={teamForm.name || ''}
                        onChange={e => setTeamForm({...teamForm, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Marcus Brody"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Specialization / Role</label>
                      <input
                        type="text"
                        value={teamForm.role || ''}
                        onChange={e => setTeamForm({...teamForm, role: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Master Barber"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Profile Photo Path</label>
                      <input
                        type="text"
                        value={teamForm.image || ''}
                        onChange={e => setTeamForm({...teamForm, image: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="/img/About Section/Team-1.png"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={teamForm.instagram || ''}
                        onChange={e => setTeamForm({...teamForm, instagram: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="#"
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-lg hover:bg-primary/95 transition-all">
                    {editingItem ? 'Save Profile' : 'Confirm Recruitment'}
                  </button>
                </form>
              )}

              {/* Stylists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {team.map(member => (
                  <div key={member.id} className="bg-secondary/20 border border-white/5 rounded-xl p-5 flex flex-col justify-between relative group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-primary/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-playfair font-bold text-white text-sm">{member.name}</h3>
                          <p className="text-[10px] text-primary font-semibold">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingItem({ type: 'team', data: member });
                            setTeamForm(member);
                            setIsAdding(null);
                          }}
                          className="p-1 bg-white/5 hover:bg-primary/20 hover:text-primary rounded text-white/50 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTeamDelete(member.id)}
                          className="p-1 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded text-white/50 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-[9px] text-white/30 font-mono mt-4 pt-2 border-t border-white/5">
                      ID: {member.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. BLOGS TAB */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-playfair font-bold text-white">Editorial Articles</h2>
                  <p className="text-white/40 text-xs mt-1">Publish editorial content, write hair care guides, or delete posts.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAdding(isAdding === 'blog' ? null : 'blog');
                    setBlogForm({});
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Publish Blog Post
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAdding === 'blog' || editingItem?.type === 'blog') && (
                <form onSubmit={handleBlogSubmit} className="bg-white/5 border border-primary/20 rounded-xl p-5 space-y-4 max-w-2xl">
                  <div className="text-sm font-bold text-primary pb-2 border-b border-white/5 flex items-center justify-between">
                    <span>{editingItem ? 'Edit Article' : 'Draft New Article'}</span>
                    <button type="button" onClick={() => { setIsAdding(null); setEditingItem(null); }}><X className="w-4 h-4 text-white/50 hover:text-white" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Article Title</label>
                      <input
                        type="text"
                        value={blogForm.title || ''}
                        onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Top 5 Hair Trends for Summer 2026"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Author Name</label>
                      <input
                        type="text"
                        value={blogForm.author || ''}
                        onChange={e => setBlogForm({...blogForm, author: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Elena Rostova"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Category</label>
                      <input
                        type="text"
                        value={blogForm.category || ''}
                        onChange={e => setBlogForm({...blogForm, category: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="Hairstyle Advice"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Short Excerpt (Teaser)</label>
                      <input
                        type="text"
                        value={blogForm.excerpt || ''}
                        onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none"
                        placeholder="A teaser description shown in lists..."
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Article Content (Markdown / HTML / Text)</label>
                      <textarea
                        value={blogForm.content || ''}
                        onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-primary outline-none h-44 resize-none"
                        placeholder="Write the full post contents here..."
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-black font-manrope font-bold text-xs rounded-lg hover:bg-primary/95 transition-all">
                    {editingItem ? 'Publish Updates' : 'Launch Article'}
                  </button>
                </form>
              )}

              {/* Blogs List */}
              <div className="space-y-4">
                {blogs.map(b => (
                  <div key={b.id} className="bg-secondary/20 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded">
                          {b.category}
                        </span>
                        <span className="text-[10px] text-white/30">{b.date}</span>
                      </div>
                      <h3 className="font-playfair font-bold text-white text-base mt-2">{b.title}</h3>
                      <p className="text-white/40 text-xs mt-1 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingItem({ type: 'blog', data: b });
                          setBlogForm(b);
                          setIsAdding(null);
                        }}
                        className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded text-white/60 transition-all text-xs"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBlogDelete(b.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded text-white/60 transition-all text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Total Items */}
                <div className="bg-secondary/20 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Package className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Inventory Items</p>
                  <h3 className="text-2xl font-playfair font-bold text-white mt-1">
                    {products.reduce((acc, p) => acc + (p.stock ?? 0), 0)}
                  </h3>
                  <p className="text-[10px] text-primary mt-2">Across {products.length} catalog products</p>
                </div>

                {/* Metric 2: Total Valuation */}
                <div className="bg-secondary/20 border border-white/5 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <ShoppingBag className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Total Valuation</p>
                  <h3 className="text-2xl font-playfair font-bold text-white mt-1">
                    ${products.reduce((acc, p) => acc + (p.price * (p.stock ?? 0)), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-primary mt-2">Based on current retail prices</p>
                </div>

                {/* Metric 3: Low Stock Alerts */}
                {(() => {
                  const lowStockCount = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= (p.minStock ?? 5)).length;
                  return (
                    <div className={`bg-secondary/20 border rounded-xl p-5 backdrop-blur-md relative overflow-hidden transition-all ${
                      lowStockCount > 0 ? 'border-amber-500/20 bg-amber-500/5' : 'border-white/5'
                    }`}>
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <AlertTriangle className="w-16 h-16 text-amber-500" />
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Low Stock Alerts</p>
                      <h3 className={`text-2xl font-playfair font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                        {lowStockCount}
                      </h3>
                      <p className={`text-[10px] mt-2 ${lowStockCount > 0 ? 'text-amber-400' : 'text-white/40'}`}>
                        {lowStockCount > 0 ? 'Action required soon' : 'All thresholds healthy'}
                      </p>
                    </div>
                  );
                })()}

                {/* Metric 4: Out of Stock */}
                {(() => {
                  const outOfStockCount = products.filter(p => (p.stock ?? 0) === 0).length;
                  return (
                    <div className={`bg-secondary/20 border rounded-xl p-5 backdrop-blur-md relative overflow-hidden transition-all ${
                      outOfStockCount > 0 ? 'border-red-500/20 bg-red-500/5' : 'border-white/5'
                    }`}>
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <AlertTriangle className="w-16 h-16 text-red-500" />
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Out of Stock</p>
                      <h3 className={`text-2xl font-playfair font-bold mt-1 ${outOfStockCount > 0 ? 'text-red-400 font-extrabold' : 'text-white'}`}>
                        {outOfStockCount}
                      </h3>
                      <p className={`text-[10px] mt-2 ${outOfStockCount > 0 ? 'text-red-400' : 'text-white/40'}`}>
                        {outOfStockCount > 0 ? 'Urgent reorder needed' : 'Zero items depleted'}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Filters & Search Control Bar */}
              <div className="bg-secondary/10 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    placeholder="Search by name, SKU, or category..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:border-primary outline-none transition-all"
                  />
                  <Package className="w-4 h-4 text-white/30 absolute left-3 top-2.5" />
                  {inventorySearch && (
                    <button onClick={() => setInventorySearch('')} className="absolute right-3 top-2.5 text-white/40 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Category:</span>
                    <select
                      value={inventoryCategoryFilter}
                      onChange={e => setInventoryCategoryFilter(e.target.value)}
                      className="bg-black border border-white/10 text-xs text-white rounded-lg p-1.5 focus:border-primary outline-none"
                    >
                      <option value="All">All Categories</option>
                      {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Status:</span>
                    <select
                      value={inventoryStatusFilter}
                      onChange={e => setInventoryStatusFilter(e.target.value)}
                      className="bg-black border border-white/10 text-xs text-white rounded-lg p-1.5 focus:border-primary outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Healthy">Healthy Stock</option>
                      <option value="Low">Low Stock</option>
                      <option value="Out">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Main Inventory Table */}
              <div className="border border-white/5 rounded-xl overflow-hidden bg-secondary/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-[10px] text-white/40 uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">SKU</th>
                        <th className="py-3 px-4 font-semibold">Product</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold text-center">Stock Level</th>
                        <th className="py-3 px-4 font-semibold text-center">Threshold</th>
                        <th className="py-3 px-4 font-semibold text-center">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-white/80">
                      {(() => {
                        const filtered = products.filter(p => {
                          const searchStr = `${p.name} ${p.sku || ''} ${p.category || ''}`.toLowerCase();
                          const matchesSearch = searchStr.includes(inventorySearch.toLowerCase());
                          
                          const matchesCategory = inventoryCategoryFilter === 'All' || p.category === inventoryCategoryFilter;
                          
                          const stockNum = p.stock ?? 0;
                          const threshold = p.minStock ?? 5;
                          let matchesStatus = true;
                          if (inventoryStatusFilter === 'Low') {
                            matchesStatus = stockNum > 0 && stockNum <= threshold;
                          } else if (inventoryStatusFilter === 'Out') {
                            matchesStatus = stockNum === 0;
                          } else if (inventoryStatusFilter === 'Healthy') {
                            matchesStatus = stockNum > threshold;
                          }
                          
                          return matchesSearch && matchesCategory && matchesStatus;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-white/30 text-xs font-medium">
                                No inventory items match current filter criteria.
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map(p => {
                          const isEditing = editingInventoryId === p.id;
                          const stockNum = p.stock ?? 0;
                          const threshold = p.minStock ?? 5;
                          
                          let statusLabel = 'Healthy';
                          let statusClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                          if (stockNum === 0) {
                            statusLabel = 'Out of Stock';
                            statusClass = 'bg-red-500/10 text-red-400 border border-red-500/20';
                          } else if (stockNum <= threshold) {
                            statusLabel = 'Low Stock';
                            statusClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                          }

                          return (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              {/* SKU */}
                              <td className="py-3.5 px-4 font-mono text-[10px] text-white/50 tracking-wider">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={inventoryForm?.sku ?? ''}
                                    onChange={e => setInventoryForm(f => f ? { ...f, sku: e.target.value } : null)}
                                    className="bg-black border border-white/20 rounded px-2 py-1 text-[10px] text-white font-mono w-28 outline-none focus:border-primary"
                                    required
                                  />
                                ) : (
                                  p.sku || '-'
                                )}
                              </td>

                              {/* Product Info */}
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">{p.name}</div>
                                <div className="text-[10px] text-white/40 mt-0.5">${p.price.toFixed(2)} / unit</div>
                              </td>

                              {/* Category */}
                              <td className="py-3.5 px-4 text-white/60">
                                {p.category}
                              </td>

                              {/* Stock Level with Fast Incrementor */}
                              <td className="py-3.5 px-4">
                                {isEditing ? (
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="number"
                                      value={inventoryForm?.stock ?? 0}
                                      onChange={e => setInventoryForm(f => f ? { ...f, stock: Math.max(0, parseInt(e.target.value) || 0) } : null)}
                                      className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-white text-center w-16 outline-none focus:border-primary"
                                      min={0}
                                      required
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-3">
                                    <button
                                      onClick={() => adjustStock(p.id, -1)}
                                      className="w-5 h-5 rounded bg-white/5 hover:bg-primary/20 text-white/60 hover:text-primary transition-all flex items-center justify-center font-bold"
                                      title="Decrement 1"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold w-6 text-center">{stockNum}</span>
                                    <button
                                      onClick={() => adjustStock(p.id, 1)}
                                      className="w-5 h-5 rounded bg-white/5 hover:bg-primary/20 text-white/60 hover:text-primary transition-all flex items-center justify-center font-bold"
                                      title="Increment 1"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Threshold */}
                              <td className="py-3.5 px-4 text-center">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={inventoryForm?.minStock ?? 5}
                                    onChange={e => setInventoryForm(f => f ? { ...f, minStock: Math.max(0, parseInt(e.target.value) || 0) } : null)}
                                    className="bg-black border border-white/20 rounded px-2 py-1 text-xs text-white text-center w-14 outline-none focus:border-primary"
                                    min={0}
                                    required
                                  />
                                ) : (
                                  <span className="text-white/40">{threshold} units</span>
                                )}
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${statusClass}`}>
                                  {statusLabel}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={(e) => handleInventorySubmit(e, p.id)}
                                      className="p-1.5 bg-primary/20 text-primary border border-primary/30 rounded hover:bg-primary/30 transition-all"
                                      title="Save Changes"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingInventoryId(null);
                                        setInventoryForm(null);
                                      }}
                                      className="p-1.5 bg-white/5 text-white/40 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-all"
                                      title="Cancel"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditingInventoryId(p.id);
                                      setInventoryForm({
                                        stock: p.stock ?? 0,
                                        minStock: p.minStock ?? 5,
                                        sku: p.sku ?? ''
                                      });
                                    }}
                                    className="px-2.5 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 text-[10px] font-bold text-white/80 hover:text-primary transition-all rounded-lg inline-flex items-center gap-1"
                                  >
                                    <Edit2 className="w-3 h-3" /> Adjust
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
      </div>
    </div>
  );
}
