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

  // 2. Seed Services (8 services)
  console.log("Seeding services...");
  const services = await Service.insertMany([
    {
      name: "Hair Cut",
      price: 65,
      duration: "45 mins",
      image: "",
      icon: "Scissors",
      description: "Professional hair shaping and styling, customized to your face structure and personal preference.",
    },
    {
      name: "Wedding Package",
      price: 499,
      duration: "180 mins",
      image: "",
      icon: "Sparkles",
      description: "Complete bridal/groom hairstyling, makeup, and relaxation treatments for your special day.",
    },
    {
      name: "Hair Dye",
      price: 120,
      duration: "90 mins",
      image: "",
      icon: "Palette",
      description: "Vibrant coloring treatments including highlights, balayage, and full tints using premium organic dyes.",
    },
    {
      name: "Facial",
      price: 85,
      duration: "60 mins",
      image: "",
      icon: "Sparkles",
      description: "Rejuvenating facial massage, exfoliation, and hydration masks for a glowing, refreshed complexion.",
    },
    {
      name: "Keratin Treatment",
      price: 250,
      duration: "120 mins",
      image: "",
      icon: "Heart",
      description: "Smoothing and straightening treatment that eliminates frizz, restores shine, and strengthens hair fibers.",
    },
    {
      name: "Shaving",
      price: 45,
      duration: "30 mins",
      image: "",
      icon: "User",
      description: "Traditional hot towel straight-razor shave, complete with skin conditioning and post-shave balm.",
    },
    {
      name: "Hair Treatment",
      price: 95,
      duration: "60 mins",
      image: "",
      icon: "Heart",
      description: "Deep conditioning and scalp nourishment therapy targeting dry, damaged, or thinning hair.",
    },
    {
      name: "Hair Removal",
      price: 35,
      duration: "30 mins",
      image: "",
      icon: "Scissors",
      description: "Gentle waxing and threading services for brow shaping, facial grooming, and clean hairlines.",
    },
  ]);
  console.log(`${services.length} services seeded.`);

  // 3. Seed Products (12 products)
  console.log("Seeding products...");
  const products = await Product.insertMany([
    {
      name: "Gold Elixir Face Cream",
      price: 75.00,
      image: "",
      images: [],
      category: "Face",
      description: "Infused with organic extracts and real gold micro-particles to revitalize and hydrate facial skin.",
      tags: ["Cream", "Face", "Organic"],
      stock: 50,
      minStock: 5,
      sku: "GOLD-FACE-CRM",
    },
    {
      name: "Hydrating Botanical Face Wash",
      price: 45.00,
      image: "",
      images: [],
      category: "Face",
      description: "A gentle, foaming face wash formulated with natural aloe vera and chamomile to purify skin.",
      tags: ["Face", "Organic"],
      stock: 60,
      minStock: 5,
      sku: "HYDR-FACE-WSH",
    },
    {
      name: "Restorative Argan Conditioner",
      price: 35.00,
      image: "",
      images: [],
      category: "Organic",
      description: "Deeply moisturizing argan oil conditioner designed to smooth cuticles, detangle, and restore hair shine.",
      tags: ["Organic", "Cream", "Trends"],
      stock: 80,
      minStock: 10,
      sku: "REST-ARG-CON",
    },
    {
      name: "Clarifying Tea Tree Shampoo",
      price: 32.00,
      image: "",
      images: [],
      category: "Organic",
      description: "Invigorating daily shampoo infused with tea tree oil and peppermint to refresh the scalp and remove residue.",
      tags: ["Organic", "Trends"],
      stock: 100,
      minStock: 10,
      sku: "CLAR-TEA-SHM",
    },
    {
      name: "Professional Ionic Hair Straightener",
      price: 120.00,
      image: "",
      images: [],
      category: "Equipment",
      description: "Salon-grade hair straightener featuring ionic technology and ceramic plates for silky-smooth styling.",
      tags: ["Fashion", "Trends"],
      stock: 15,
      minStock: 2,
      sku: "PROF-ION-STR",
    },
    {
      name: "Precision Barber Scissors",
      price: 85.00,
      image: "",
      images: [],
      category: "Equipment",
      description: "Ultra-sharp, Japanese stainless steel shears designed for precision cutting and texturizing.",
      tags: ["Fashion"],
      stock: 20,
      minStock: 3,
      sku: "PREC-BAR-SCI",
    },
    {
      name: "Premium Matte Clay",
      price: 28.00,
      image: "",
      images: [],
      category: "Organic",
      description: "High-hold styling clay with a matte finish. Provides volume and long-lasting texture.",
      tags: ["Cream", "Trends"],
      stock: 45,
      minStock: 5,
      sku: "PREM-MAT-CLY",
    },
    {
      name: "Nourishing Beard Oil",
      price: 24.00,
      image: "",
      images: [],
      category: "Organic",
      description: "Formulated with jojoba and cedarwood oils to soften facial hair and hydrate the underlying skin.",
      tags: ["Organic", "Trends"],
      stock: 70,
      minStock: 5,
      sku: "NOUR-BRD-OIL",
    },
    {
      name: "Luxury Glow Lip Gloss",
      price: 22.00,
      image: "",
      images: [],
      category: "Face",
      description: "High-shine, non-sticky lip gloss with moisturizing oils for a plump, radiant look.",
      tags: ["Gloss", "Make up", "Fashion"],
      stock: 90,
      minStock: 8,
      sku: "LUX-GLW-GLS",
    },
    {
      name: "Matte Perfection Foundation",
      price: 48.00,
      image: "",
      images: [],
      category: "Face",
      description: "Full-coverage, breathable foundation that matches skin tone perfectly with a velvet matte finish.",
      tags: ["Make up", "Face"],
      stock: 40,
      minStock: 5,
      sku: "MAT-PFX-FND",
    },
    {
      name: "Blonde Radiance Toning Shampoo",
      price: 38.00,
      image: "",
      images: [],
      category: "Organic",
      description: "Purple shampoo formulated to eliminate brassy tones and enhance the vibrance of blonde and silver hair.",
      tags: ["Blonde", "Trends"],
      stock: 65,
      minStock: 5,
      sku: "BLND-RAD-TON",
    },
    {
      name: "High-Velocity Professional Blow Dryer",
      price: 150.00,
      image: "",
      images: [],
      category: "Equipment",
      description: "Lightweight blow dryer with advanced ionic flow control for faster drying and reduced heat damage.",
      tags: ["Trends"],
      stock: 12,
      minStock: 2,
      sku: "HIGH-VEL-DRY",
    },
  ]);
  console.log(`${products.length} products seeded.`);

  // 4. Seed Blog Posts (12 posts)
  console.log("Seeding blog posts...");
  const blogs = await BlogPost.insertMany([
    {
      title: "The Ultimate Guide to a Healthy Hair Care Routine",
      excerpt: "Discover the core practices, essential products, and daily habits that form a healthy, radiant hair care routine.",
      content: "<p>A healthy hair care routine is key to maintaining clean, strong, and glowing locks. Frequency of washing depends on your hair type: oily hair may need washing every other day, while dry or curly hair can go longer. Always choose sulfate-free shampoos to avoid stripping natural scalp oils. Follow with a rich conditioner focused on the mid-lengths and ends, and remember to use a heat protectant spray before using blow dryers or straighteners.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Trends",
    },
    {
      title: "5 Essential Facial Care Tips for Glowing Skin",
      excerpt: "Revitalize your skincare routine with these 5 dermatologically approved tips for a brighter, healthier complexion.",
      content: "<p>Beautiful skin starts with consistent care. First, double-cleanse at night to remove makeup and impurities. Second, exfoliate gently twice a week to remove dead skin cells. Third, apply a hydrating serum containing Hyaluronic Acid. Fourth, never skip moisturizing, even if you have oily skin. Finally, apply a broad-spectrum SPF 30+ sunscreen every single morning to prevent premature aging and sun damage.</p>",
      author: "Maria Santos",
      image: "",
      category: "Face",
    },
    {
      title: "Understanding Keratin Treatments: Pros, Cons, and Care",
      excerpt: "Thinking about getting a keratin treatment? Here is everything you need to know about the process and post-treatment maintenance.",
      content: "<p>Keratin treatments are semi-permanent hair smoothing procedures that temporarily seal liquid keratin into the hair cuticle. This eliminates frizz, adds incredible shine, and cuts down blowout time by half. While highly effective, they do involve chemical formulas, so it is crucial to use sulfate-free products post-treatment. Deep conditioning weekly will keep the treatment looking fresh and prolong its lifespan up to five months.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Trends",
    },
    {
      title: "Top Hair Styling Tools Every Professional Needs",
      excerpt: "A review of the must-have salon equipment, from ionic blow dryers to precision ceramic straighteners.",
      content: "<p>The right equipment transforms the styling experience. Professional ionic blow dryers release negative ions to break down water droplets quickly, locking in moisture and reducing heat damage. Ceramic hair straighteners provide even heat distribution to prevent hot spots. Invest in high-carbon Japanese steel shears for clean, precise cuts that prevent split ends and maintain hair integrity.</p>",
      author: "Maria Santos",
      image: "",
      category: "Equipment",
    },
    {
      title: "The Benefits of Using Organic Hair Products",
      excerpt: "Why switching to botanical, chemical-free hair care products is the best decision for your scalp and the environment.",
      content: "<p>Organic hair products utilize natural extracts, essential oils, and plant-derived ingredients instead of harsh chemicals. Sulfates and synthetic parabens can cause scalp irritation, dryness, and long-term hair thinning. Botanical ingredients like argan oil, aloe vera, and lavender soothe the scalp, provide natural nourishment, and are biodegradable, making them safer for both your body and the planet.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Organic",
    },
    {
      title: "Men's Grooming: The Art of the Perfect Shave",
      excerpt: "Master the classic hot-towel straight-razor shave experience at home with our step-by-step grooming guide.",
      content: "<p>Achieving a smooth, irritation-free shave is an art form. Start by warming the skin with a hot towel to open pores and soften facial hair. Apply a pre-shave oil to create a protective barrier. Use a high-quality badger brush to whip up a rich shaving cream lather, then shave in the direction of hair growth. Finish with a cold splash to close pores, and apply a hydrating, alcohol-free post-shave balm to soothe the skin.</p>",
      author: "Maria Santos",
      image: "",
      category: "Trends",
    },
    {
      title: "How to Maintain Vibrant Hair Color After Dyeing",
      excerpt: "Prevent fading and keep your salon-colored hair looking rich and vibrant with these simple maintenance tips.",
      content: "<p>Maintaining color brilliance requires dedication. Always wait at least 72 hours before washing your hair after coloring to allow the cuticles to fully close. When washing, use lukewarm or cool water, as hot water opens the cuticles and lets color molecules escape. Switch to color-safe, sulfate-free shampoos, and apply UV-protective hair sprays to shield color from the sun's fading rays.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Trends",
    },
    {
      title: "Exploring the Hottest Hair Trends of the Season",
      excerpt: "From curtain bangs to textured bobs, we round up the most requested cuts and styles defining this season's fashion.",
      content: "<p>This season is all about effortless texture and custom styling. The modern shag and curtain bangs continue to dominate, offering a low-maintenance yet highly stylish look. For shorter cuts, textured bobs and soft pixies are highly requested. The key is to work with your natural hair texture, using styling clays and sea salt sprays to create organic, touchable hold and movement.</p>",
      author: "Maria Santos",
      image: "",
      category: "Fashion",
    },
    {
      title: "The Science Behind Scalp Massages and Hair Growth",
      excerpt: "Learn how regular scalp stimulation improves blood circulation and promotes thicker, healthier hair growth.",
      content: "<p>Scalp massages do more than just relieve tension. Studies show that regular scalp stimulation dilates blood vessels under the skin, increasing blood flow to the hair follicles. This delivers vital oxygen and nutrients directly to the roots, promoting thicker, stronger hair growth. Try massaging your scalp for five minutes daily using circular motions with a drop of stimulating rosemary or peppermint oil.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Organic",
    },
    {
      title: "Winter Hair Care: Protecting Your Locks from Dry Air",
      excerpt: "Cold weather and indoor heating can dry out your hair. Here is how to lock in moisture during the winter months.",
      content: "<p>Winter dry air can strip hair of its natural moisture, leading to static, frizz, and brittleness. To combat this, reduce washing to twice a week and switch to heavier, oil-based conditioning masks. Apply leave-in conditioners and hair oils to lock in hydration before going outside, and wear a silk-lined hat to protect your strands from friction and cold wind.</p>",
      author: "Maria Santos",
      image: "",
      category: "Trends",
    },
    {
      title: "Transitioning to Blonde: What to Expect at the Salon",
      excerpt: "Going blonde is a journey. Here is a realistic timeline, maintenance guide, and cost estimate for the transition.",
      content: "<p>Achieving the perfect shade of blonde requires patience. Depending on your starting shade, it may take multiple sessions to lift your hair safely without causing structural damage. Be prepared to invest in high-quality purple shampoos to neutralize brassy tones, regular deep conditioning treatments to restore elasticity, and frequent root touch-ups every 6 to 8 weeks.</p>",
      author: "Alex Mercer",
      image: "",
      category: "Fashion",
    },
    {
      title: "Facial Serums: Choosing the Right Active Ingredients",
      excerpt: "Hyaluronic acid, Vitamin C, Retinol—demystifying the most popular active ingredients for your facial skin type.",
      content: "<p>Facial serums contain concentrated active ingredients targeting specific skin concerns. For hydration, choose a serum with Hyaluronic Acid. To brighten skin and fade dark spots, look for Vitamin C, which is best applied in the morning. For anti-aging and skin renewal, Retinol is the gold standard but should only be used at night. Always patch-test new serums and introduce them gradually to avoid irritation.</p>",
      author: "Maria Santos",
      image: "",
      category: "Face",
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
