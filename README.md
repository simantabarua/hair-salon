# Aurelia Hair Salon & Spa Portal

A premium, production-grade Next.js web application designed for a luxury hair salon and spa. It offers a complete customer portal for viewing services, booking appointments, shopping hair care products with Stripe payments, and a powerful administrative control panel to manage salon operations, track inventory, and view analytics.

---

## 🚀 Key Features

### 📅 Online Booking & Scheduling
- Real-time appointment scheduling for various salon services (Hair Cut, Facials, Keratin Treatment, Shaving, etc.).
- Choice of stylists and customizable durations/pricing.

### 🛍️ E-Commerce Shop & Shopping Cart
- Dynamic shop featuring product categories (e.g., Organic, Face, Equipment) and custom tag filters.
- Robust state management with **Redux Toolkit** handling shopping cart updates, item counters, and pricing calculations.
- Secure, real-time checkout flow powered by **Stripe API**.

### 🔒 User Authentication & Authorization
- Secure registration and login flow utilizing **NextAuth.js** (MongoDB adapter).
- Secure password hashing using **bcryptjs**.
- Role-Based Access Control (RBAC) with user roles: `admin`, `staff`, and `customer`.

### 🛡️ Route Middleware Protection
- Custom Next.js middleware protecting `/admin/:path*`, `/dashboard/:path*`, and `/checkout/:path*`.
- Unauthorized dashboard/staff members attempting to access admin routes are automatically redirected to their client dashboard.

### 📊 Administrative Dashboard
- Comprehensive metrics monitoring with interactive charts built via **Recharts**.
- Complete CRUD management for services, products, blog posts, reviews, and user roles.
- Inventory tracking, automatic low-stock alerts, and SKU tracking.

### ✍️ Salon Blog & Reviews
- Rich-text blogging platform where salon stylists can share grooming tips, styling advice, and current trends.
- Authentic client rating and review system on products and services to drive user engagement.

---

## 🛠️ Technology Stack

| Layer | Technology Used |
| :--- | :--- |
| **Framework** | Next.js 16.2.9 (App Router) / React 19 / TypeScript 5 |
| **Styling** | Tailwind CSS v4, Tailwind Animate, Lucide Icons, Base UI, Shadcn UI, Sonner (Toasts) |
| **Database** | MongoDB & Mongoose ORM |
| **State Management** | Redux Toolkit & React Redux |
| **Authentication** | NextAuth.js (v4) with Custom Credentials and MongoDB Adapter |
| **Payment Gateway** | Stripe API |
| **Storage & Uploads** | Cloudinary API |
| **Analytics/Charts** | Recharts |
| **Validation** | Zod Schema Validation |
| **Sanitization** | Sanitize-HTML |

---

## ⚙️ Environment Variables Setup

Create two environment files in the root directory: `.env.local` (for development) and `.env.production` (for production builds).

```ini
# Database Connection
MONGODB_URI=mongodb://localhost:27017/hair-salon

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_here

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📂 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
Populate your database with default admin users, staff, services (8 varieties), products (12 items), and initial blog posts:

```bash
# Seed development database (uses .env.local)
npm run seed

# Seed production database (uses .env.production)
npm run seed:prod
```

Default seeded credentials:
- **Admin**: `admin@aurelia.com` (Password: `Admin@123`)
- **Staff**: `staff@aurelia.com` (Password: `Staff@123`)
- **Customer**: `customer@aurelia.com` (Password: `Customer@123`)

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Start Production Release
```bash
npm run build
npm run start
```
