import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Service } from "../models/Service";
import { Product } from "../models/Product";
import { BlogPost } from "../models/BlogPost";
import { Appointment } from "../models/Appointment";
import { Order } from "../models/Order";
import { Payment } from "../models/Payment";
import { Review } from "../models/Review";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI environment variable is not set.");
  process.exit(1);
}

async function seed() {
  console.log(`Connecting to database: ${MONGODB_URI!.replace(/:([^@]+)@/, ":****@")}...`);
  await mongoose.connect(MONGODB_URI!, { bufferCommands: false });
  console.log("Database connected successfully.");

  // Clear existing collections
  console.log("Clearing existing database collections...");
  await User.deleteMany({});
  await Service.deleteMany({});
  await Product.deleteMany({});
  await BlogPost.deleteMany({});
  await Appointment.deleteMany({});
  await Order.deleteMany({});
  await Payment.deleteMany({});
  await Review.deleteMany({});
  console.log("Collections cleared.");

  // 1. Seed Users (Admin, Staff, Customer)
  console.log("Seeding users...");
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const staffPassword = await bcrypt.hash("Staff@123", 12);
  const customerPassword = await bcrypt.hash("Customer@123", 12);

  const admin = await User.create({
    name: "System Administrator",
    email: "admin@aurelia.com",
    password: adminPassword,
    role: "admin",
  });

  const stylist1 = await User.create({
    name: "Alex Mercer",
    email: "staff@aurelia.com",
    password: staffPassword,
    role: "staff",
  });

  const stylist2 = await User.create({
    name: "Maria Santos",
    email: "maria@aurelia.com",
    password: staffPassword,
    role: "staff",
  });

  const customer = await User.create({
    name: "John Doe",
    email: "customer@aurelia.com",
    password: customerPassword,
    role: "customer",
  });
  console.log(`Users seeded. Admin: ${admin.email}, Staff: ${stylist1.email}, ${stylist2.email}`);

  // 2. Seed Services
  console.log("Seeding services...");
  const services = await Service.insertMany([
    {
      name: "Classic Haircut",
      price: 40,
      duration: "30 min",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600",
      icon: "Scissors",
      description: "A tailored haircut including precision scissor work, styling, and a hot towel finish.",
    },
    {
      name: "Premium Styling",
      price: 60,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600",
      icon: "Sparkles",
      description: "Includes wash, blowout, heat styling, and premium finishing products.",
    },
    {
      name: "Beard Trim & Grooming",
      price: 25,
      duration: "20 min",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600",
      icon: "User",
      description: "Precise beard shaping, mustache trim, lining with foil shaver, and beard oil conditioning.",
    },
    {
      name: "Hair Coloring",
      price: 120,
      duration: "90 min",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600",
      icon: "Palette",
      description: "Full head single-process permanent or semi-permanent color customized to your skin tone.",
    },
    {
      name: "Deep Conditioning Treatment",
      price: 50,
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
      icon: "Heart",
      description: "Intense moisture treatment designed to restore damaged, dry, or chemically processed hair.",
    },
  ]);
  console.log(`${services.length} services seeded.`);

  // 3. Seed Products
  console.log("Seeding products...");
  const products = await Product.insertMany([
    {
      name: "Premium Matte Clay",
      price: 24,
      image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600",
      category: "Styling",
      description: "High hold, matte finish styling clay. Infused with natural minerals for maximum volume and texture.",
      tags: ["matte", "high hold", "clay"],
      stock: 50,
      minStock: 5,
      sku: "MATTE-CLAY-01",
    },
    {
      name: "Nourishing Tea Tree Shampoo",
      price: 18,
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600",
      category: "Haircare",
      description: "Invigorating daily shampoo with tea tree oil, peppermint, and lavender to clarify and refresh the scalp.",
      tags: ["shampoo", "organic", "tea tree"],
      stock: 100,
      minStock: 10,
      sku: "TEA-SHAM-01",
    },
    {
      name: "Hydrating Argan Conditioner",
      price: 20,
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
      category: "Haircare",
      description: "Restorative argan oil conditioner designed to smooth hair cuticles, eliminate frizz, and boost shine.",
      tags: ["conditioner", "argan", "hydrating"],
      stock: 100,
      minStock: 10,
      sku: "ARG-COND-01",
    },
    {
      name: "Classic Styling Pomade",
      price: 15,
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600",
      category: "Styling",
      description: "Medium hold, medium shine water-soluble pomade for classic side parts, pompadours, and slick-backs.",
      tags: ["pomade", "medium hold", "shine"],
      stock: 75,
      minStock: 8,
      sku: "STYL-POM-01",
    },
  ]);
  console.log(`${products.length} products seeded.`);

  // 4. Seed Blog Posts
  console.log("Seeding blog posts...");
  const blogs = await BlogPost.insertMany([
    {
      title: "Top 5 Summer Hair Care Tips",
      excerpt: "Protect your hair from sun, chlorine, and humidity with these expert-approved summer care tips.",
      content: "<p>Summer brings sunshine, beach days, and outdoor fun—but it also brings UV damage, sweat, and humidity. Here are our top tips to keep your locks looking radiant and healthy all season long:</p><h3>1. Protect from UV Rays</h3><p>Just like your skin, your hair needs defense against intense sunlight. Wear a hat or use hair protection sprays with built-in UV blockers.</p><h3>2. Rinse After Swimming</h3><p>Always wash your hair immediately after swimming in chlorinated pools or saltwater. Chlorine strips natural oils, making hair dry and brittle.</p><h3>3. Deep Condition Weekly</h3><p>Integrate a restorative hair mask or deep conditioner into your weekend routine to rehydrate thirsty strands.</p>",
      author: "Alex Mercer",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      category: "Care",
    },
    {
      title: "The Evolution of Modern Styling",
      excerpt: "A deep dive into how styling trends have evolved from classic slick-backs to textured modern crops.",
      content: "<p>Men's and women's hairstyling has undergone massive transformations over the past few decades. Today, natural movement and texture are king.</p><h3>The Return of Texture</h3><p>While slick, high-shine styles dominated the early 2010s, the current landscape values matte products and messy, effortless cuts like textured crops and soft curls.</p><h3>Customized Styling</h3><p>Modern clients prefer cuts that work with their natural hair patterns rather than fighting against them. A great stylist customizes every cut to the client's unique facial features and hair behavior.</p>",
      author: "Maria Santos",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800",
      category: "Trends",
    },
  ]);
  console.log(`${blogs.length} blog posts seeded.`);

  console.log("Seeding process completed successfully!");
}

seed()
  .catch((err) => {
    console.error("Seeding failed with error:", err);
    process.exit(1);
  })
  .finally(() => {
    mongoose.disconnect();
  });
