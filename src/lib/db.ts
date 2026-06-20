'use client';

import { services as defaultServices, products as defaultProducts, teamMembers as defaultTeam, blogPosts as defaultBlogs, BlogPost, Service, Product, TeamMember } from '@/data/salonData';

export interface Appointment {
  id: string;
  userEmail: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Order {
  id: string;
  userEmail: string;
  customerName: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: string;
  total: number;
}

// Helper to check if window is defined (SSR safety)
const isClient = typeof window !== 'undefined';

const KEYS = {
  SERVICES: 'aurelia_services',
  PRODUCTS: 'aurelia_products',
  TEAM: 'aurelia_team',
  BLOGS: 'aurelia_blogs',
  APPOINTMENTS: 'aurelia_appointments',
  ORDERS: 'aurelia_orders',
};

// Initialize localStorage if keys do not exist
export function initDB() {
  if (!isClient) return;

  if (!localStorage.getItem(KEYS.SERVICES)) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(defaultServices));
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem(KEYS.TEAM)) {
    localStorage.setItem(KEYS.TEAM, JSON.stringify(defaultTeam));
  }
  if (!localStorage.getItem(KEYS.BLOGS)) {
    localStorage.setItem(KEYS.BLOGS, JSON.stringify(defaultBlogs));
  }
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    const dummyAppointments: Appointment[] = [
      {
        id: 'APT-9241',
        userEmail: 'demo@aurelia.com',
        service: 'Hair Cut',
        stylist: 'Sarah Peterson',
        date: '2026-06-25',
        time: '10:00 AM',
        price: 45.00,
        status: 'Confirmed',
      },
      {
        id: 'APT-8812',
        userEmail: 'demo@aurelia.com',
        service: 'Facial',
        stylist: 'Elena Rostova',
        date: '2026-07-02',
        time: '02:30 PM',
        price: 60.00,
        status: 'Pending',
      },
      {
        id: 'APT-4109',
        userEmail: 'demo@aurelia.com',
        service: 'Shaving',
        stylist: 'Marcus Brody',
        date: '2026-05-18',
        time: '11:00 AM',
        price: 30.00,
        status: 'Confirmed',
      },
    ];
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(dummyAppointments));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    const dummyOrders: Order[] = [
      {
        id: 'ORD-9831',
        userEmail: 'demo@aurelia.com',
        customerName: 'Demo User',
        date: '2026-06-12',
        status: 'Shipped',
        items: '1x Hair Conditioner (120ml), 1x Hair Shampoo (120ml)',
        total: 149.00,
      },
      {
        id: 'ORD-9214',
        userEmail: 'demo@aurelia.com',
        customerName: 'Demo User',
        date: '2026-05-22',
        status: 'Delivered',
        items: '1x Organic Face Wash (120ml)',
        total: 74.50,
      },
    ];
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(dummyOrders));
  }
}

// Generic Getter
function getItem<T>(key: string, defaultValue: T[]): T[] {
  if (!isClient) return defaultValue;
  initDB();
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Generic Setter
function setItem<T>(key: string, value: T[]) {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Services CRUD
export function getServices(): Service[] {
  return getItem<Service>(KEYS.SERVICES, defaultServices);
}
export function saveService(service: Service) {
  const list = getServices();
  const index = list.findIndex((s) => s.id === service.id);
  if (index > -1) {
    list[index] = service;
  } else {
    list.push(service);
  }
  setItem(KEYS.SERVICES, list);
  window.dispatchEvent(new Event('storage'));
}
export function deleteService(id: string) {
  const list = getServices().filter((s) => s.id !== id);
  setItem(KEYS.SERVICES, list);
  window.dispatchEvent(new Event('storage'));
}

// Products CRUD
export function getProducts(): Product[] {
  const items = getItem<Product>(KEYS.PRODUCTS, defaultProducts);
  let hasUpdates = false;
  const migrated = items.map((p, idx) => {
    let updated = false;
    let pStock = p.stock;
    let pMinStock = p.minStock;
    let pSku = p.sku;
    
    const def = defaultProducts.find(d => d.id === p.id);
    
    if (pStock === undefined) {
      pStock = def?.stock ?? 10;
      updated = true;
    }
    if (pMinStock === undefined) {
      pMinStock = def?.minStock ?? 5;
      updated = true;
    }
    if (pSku === undefined) {
      pSku = def?.sku ?? `AURE-${p.category?.substring(0, 3).toUpperCase() ?? 'GEN'}-${idx + 1}`;
      updated = true;
    }
    
    if (updated) {
      hasUpdates = true;
      return { ...p, stock: pStock, minStock: pMinStock, sku: pSku };
    }
    return p;
  });
  
  if (hasUpdates) {
    setItem(KEYS.PRODUCTS, migrated);
  }
  return migrated;
}
export function saveProduct(product: Product) {
  const list = getProducts();
  const index = list.findIndex((p) => p.id === product.id);
  if (index > -1) {
    list[index] = product;
  } else {
    list.push(product);
  }
  setItem(KEYS.PRODUCTS, list);
  window.dispatchEvent(new Event('storage'));
}
export function deleteProduct(id: string) {
  const list = getProducts().filter((p) => p.id !== id);
  setItem(KEYS.PRODUCTS, list);
  window.dispatchEvent(new Event('storage'));
}

// Team Members CRUD
export function getTeamMembers(): TeamMember[] {
  return getItem<TeamMember>(KEYS.TEAM, defaultTeam);
}
export function saveTeamMember(member: TeamMember) {
  const list = getTeamMembers();
  const index = list.findIndex((t) => t.id === member.id);
  if (index > -1) {
    list[index] = member;
  } else {
    list.push(member);
  }
  setItem(KEYS.TEAM, list);
  window.dispatchEvent(new Event('storage'));
}
export function deleteTeamMember(id: string) {
  const list = getTeamMembers().filter((t) => t.id !== id);
  setItem(KEYS.TEAM, list);
  window.dispatchEvent(new Event('storage'));
}

// Blog Posts CRUD
export function getBlogPosts(): BlogPost[] {
  return getItem<BlogPost>(KEYS.BLOGS, defaultBlogs);
}
export function saveBlogPost(blog: BlogPost) {
  const list = getBlogPosts();
  const index = list.findIndex((b) => b.id === blog.id);
  if (index > -1) {
    list[index] = blog;
  } else {
    list.push(blog);
  }
  setItem(KEYS.BLOGS, list);
  window.dispatchEvent(new Event('storage'));
}
export function deleteBlogPost(id: string) {
  const list = getBlogPosts().filter((b) => b.id !== id);
  setItem(KEYS.BLOGS, list);
  window.dispatchEvent(new Event('storage'));
}

// Appointments CRUD
export function getAppointments(): Appointment[] {
  return getItem<Appointment>(KEYS.APPOINTMENTS, []);
}
export function saveAppointment(appointment: Appointment) {
  const list = getAppointments();
  const index = list.findIndex((a) => a.id === appointment.id);
  if (index > -1) {
    list[index] = appointment;
  } else {
    list.push(appointment);
  }
  setItem(KEYS.APPOINTMENTS, list);
  window.dispatchEvent(new Event('storage'));
}
export function deleteAppointment(id: string) {
  const list = getAppointments().filter((a) => a.id !== id);
  setItem(KEYS.APPOINTMENTS, list);
  window.dispatchEvent(new Event('storage'));
}

// Orders CRUD
export function getOrders(): Order[] {
  return getItem<Order>(KEYS.ORDERS, []);
}
export function saveOrder(order: Order) {
  const list = getOrders();
  const index = list.findIndex((o) => o.id === order.id);
  if (index > -1) {
    list[index] = order;
  } else {
    list.push(order);
  }
  setItem(KEYS.ORDERS, list);
  window.dispatchEvent(new Event('storage'));
}

