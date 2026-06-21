export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
  icon: string;
  description: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  tags: string[];
  stock: number;
  minStock: number;
  sku: string;
  rating: number;
  ratingCount: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDTO {
  id: string;
  userId: string;
  stylistId: string | UserDTO;
  serviceIds: string[] | ServiceDTO[];
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  productId: string | ProductDTO;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  items: OrderItemDTO[];
  totalAmount?: number;
  total?: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus?: "processing" | "shipped" | "delivered" | "cancelled";
  status?: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDTO {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  targetType: "product" | "service" | "stylist";
  targetId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDTO {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
