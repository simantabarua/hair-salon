export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  category: string;
  description: string;
  tags: string[];
  stock?: number;
  minStock?: number;
  sku?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  image: string;
  icon: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  bio?: string;
  specialties?: string[] | string;
  achievements?: string[] | string;
  schedule?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const services: Service[] = [
  {
    id: 'haircut',
    name: 'Hair Cut',
    price: 45,
    duration: '30 min',
    image: '/img/Services Section/Image-1.png',
    icon: '/img/Icons/HairCut.svg',
    description: 'Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
  },
  {
    id: 'shaving',
    name: 'Shaving',
    price: 30,
    duration: '20 min',
    image: '/img/Services Section/Image-2.png',
    icon: '/img/Icons/Shaving.svg',
    description: 'Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
  },
  {
    id: 'hairdye',
    name: 'Hair Dye',
    price: 85,
    duration: '60 min',
    image: '/img/Services Section/Image-3.png',
    icon: '/img/Icons/Hair Dye.svg',
    description: 'Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
  },
  {
    id: 'facial',
    name: 'Facial',
    price: 60,
    duration: '45 min',
    image: '/img/Services Section/Image-4.png',
    icon: '/img/Icons/Facial.svg',
    description: 'Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
  },
];

export const products: Product[] = [
  {
    id: 'beauty-case',
    name: 'Beauty Case',
    price: 74.5,
    image: '/img/Products Images/product-2.png',
    rating: 5,
    ratingCount: 234,
    category: 'Accessories',
    description: 'A stylish and durable beauty case designed to store and transport your cosmetics and skincare essentials safely.',
    tags: ['Fashion', 'Make up'],
    stock: 12,
    minStock: 5,
    sku: 'AURE-ACC-01',
  },
  {
    id: 'face-wash',
    name: 'Face Wash',
    price: 74.5,
    image: '/img/Products Images/product-3.png',
    rating: 5,
    ratingCount: 234,
    category: 'Skincare',
    description: 'Gently cleanses and refreshes your skin, removing dirt, oil, and impurities without stripping away essential moisture.',
    tags: ['Face', 'Organic', 'Cream'],
    stock: 4,
    minStock: 8,
    sku: 'AURE-SKN-02',
  },
  {
    id: 'conditioner',
    name: 'Conditioner',
    price: 74.5,
    image: '/img/Products Images/product-4.png',
    rating: 5,
    ratingCount: 234,
    category: 'Haircare',
    description: 'Formulated to nourish and hydrate your hair, leaving it soft, smooth, shiny, and easy to style.',
    tags: ['Shampoo', 'Gloss', 'Organic'],
    stock: 0,
    minStock: 10,
    sku: 'AURE-HAC-03',
  },
  {
    id: 'face-scrub',
    name: 'Face Scrub',
    price: 74.5,
    image: '/img/Products Images/product-5.png',
    rating: 5,
    ratingCount: 234,
    category: 'Skincare',
    description: 'Exfoliating wash that buff away dead skin cells to reveal a brighter, smoother, and healthier-looking complexion.',
    tags: ['Face', 'Cream', 'Organic'],
    stock: 25,
    minStock: 5,
    sku: 'AURE-SKN-04',
  },
  {
    id: 'shampoo',
    name: 'Shampoo',
    price: 74.5,
    image: '/img/Products Images/product-1.png',
    rating: 5,
    ratingCount: 234,
    category: 'Haircare',
    description: 'Cleanse and revitalize your scalp and hair, promoting healthy growth and vibrant shine.',
    tags: ['Shampoo', 'Gloss', 'Organic', 'Spray'],
    stock: 15,
    minStock: 8,
    sku: 'AURE-HAC-05',
  },
  {
    id: 'hair-straightener',
    name: 'Hair Straightener',
    price: 74.5,
    image: '/img/Products Images/product-6.png',
    rating: 5,
    ratingCount: 234,
    category: 'Styling Tools',
    description: 'Professional-grade flat iron designed to straighten, curl, or wave hair smoothly and efficiently.',
    tags: ['Trends', 'Fashion'],
    stock: 7,
    minStock: 3,
    sku: 'AURE-TLS-06',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'stylist-1',
    name: 'Tranter Jaskulski',
    role: 'Founder & Specialist',
    image: '/img/Team Members Images/team-1.png',
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  },
  {
    id: 'stylist-2',
    name: 'Sarah Peterson',
    role: 'Master Hair Stylist',
    image: '/img/Team Members Images/team-4.png',
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  },
  {
    id: 'stylist-3',
    name: 'Marcus Brody',
    role: 'Expert Barber',
    image: '/img/Team Members Images/team-3.png',
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  },
  {
    id: 'stylist-4',
    name: 'Elena Rostova',
    role: 'Color Specialist',
    image: '/img/Team Members Images/team-2.png',
    facebook: '#',
    instagram: '#',
    tiktok: '#',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'hair-care-tips',
    title: 'Discover the practices that form a healthy hair care routine.',
    excerpt: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    content: 'Hair care is an overall term for hygiene and cosmetology involving the hair which grows from the human scalp, and to a lesser extent facial, pubic and other body hair. Hair care routines differ according to an individual\'s culture and the physical characteristics of one\'s hair. Hair may be colored, trimmed, shaved, plucked, or otherwise removed with treatments such as waxing, sugaring, and threading.',
    author: 'John',
    date: 'April 10, 2023',
    image: '/img/Blog Section/Image.png',
    category: 'Haircare',
  },
  {
    id: 'shaving-secrets',
    title: 'Unlock the secrets to the perfect close shave without irritation.',
    excerpt: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    content: 'Shaving is the removal of hair, by using a razor or any other kind of bladed implement, to slice it down to the level of the skin, or otherwise. Shaving is most commonly practiced by men to remove their facial hair and by women to remove their leg and underarm hair.',
    author: 'John',
    date: 'April 12, 2023',
    image: '/img/Blog Section/Image-1.png',
    category: 'Shaving',
  },
  {
    id: 'color-trends',
    title: 'Top hair color trends of this season you should try now.',
    excerpt: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    content: 'Hair coloring, or hair dyeing, is the practice of changing the hair color. The main reasons for this are cosmetic: to cover gray or white hair, to change to a color regarded as more fashionable or desirable, or to restore the original hair color after it has been bleached by hairdressing processes or sun bleaching.',
    author: 'John',
    date: 'April 15, 2023',
    image: '/img/Blog Section/Image-2.png',
    category: 'Styling',
  },
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Would I get a full refund If I cancel a reservation?',
    answer: 'We offers a variety of billing options, including monthly and annual subscription plans, as well as pay-as-you-go pricing for certain services. Payment is typically made through a credit card or other secure online payment method.',
  },
  {
    id: 'faq-2',
    question: 'How do I choose the right stylist for my hair type?',
    answer: 'All of our stylists are trained across multiple hair profiles, but some specialize in specific textures, coloring techniques, or styles. You can read their Bios on our Team page or contact us for advice.',
  },
  {
    id: 'faq-3',
    question: 'What premium products do you use in your treatments?',
    answer: 'We use our in-house certified organic shampoos, conditioners, and styling clays. You can buy these exact products from our online shop to maintain your hair between visits.',
  },
];
