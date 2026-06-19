export interface Comment {
  id: string;
  author: string;
  email: string;
  date: string;
  content: string;
  avatar: string;
  replies?: Comment[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  quote: string;
  author: string;
  date: string;
  category: 'Face' | 'Equipment' | 'Organic';
  tags: string[];
  image: string;
  readTime: string;
  comments: Comment[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'practices-healthy-hair-care-routine',
    title: 'Discover the practices that form a healthy hair care routine.',
    excerpt: 'Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.',
    content: [
      'Maintaining healthy hair doesn\'t happen overnight. It requires a consistent routine tailored to your specific hair type, texture, and individual scalp needs. A proper daily and weekly regimen cleanses, hydrates, and protects your locks from heat, environmental pollution, and styling stress.',
      'One of the fundamental pillars of healthy hair is scalp care. Your scalp is an extension of your skin, containing hair follicles that require hydration and gentle exfoliation. Over-washing can strip natural sebum, while under-washing can lead to buildup. Finding the right balance with sulfate-free shampoos is key.',
      'Conditioning is another essential step. It seals the hair cuticle, locks in moisture, and restores proteins lost during styling. Applying a deep conditioning mask once a week can dramatically improve hair elasticity and shine, preventing breakage and split ends over time.'
    ],
    quote: 'PROIN GRAVIDA NIBH VEL VELIT AUCTOR ALIQUET. AENEAN SOLLICITUDIN, LOREM QUIS BIBENDUMRE AUTORE NISI ELIT CONSEQUAT IPSUM, NEC SAGITTIS SEM NIBH ID ELIT.',
    author: 'John Doe',
    date: 'April 10, 2023',
    category: 'Organic',
    tags: ['Organic', 'Trends', 'Cream'],
    image: '/img/Blog Section/Image.png',
    readTime: '5 min read',
    comments: [
      {
        id: 'c1',
        author: 'Sarah Peterson',
        email: 'sarah@example.com',
        date: '12 days ago',
        content: 'This is a fantastic guide! I started using organic deep conditioners weekly, and the change in my hair texture is remarkable.',
        avatar: '/img/Team Members Images/team-4.png',
        replies: [
          {
            id: 'c1r1',
            author: 'John Doe',
            email: 'john@example.com',
            date: '10 days ago',
            content: 'Thank you Sarah! Consistency is key when transitioning to organic hair products.',
            avatar: '/img/Team Members Images/team-1.png'
          }
        ]
      },
      {
        id: 'c2',
        author: 'Marcus Brody',
        email: 'marcus@example.com',
        date: '8 days ago',
        content: 'Excellent tips on scalp hydration. Most people focus only on the hair strands and forget where it grows from!',
        avatar: '/img/Team Members Images/team-3.png'
      }
    ]
  },
  {
    slug: 'unlock-secrets-perfect-close-shave',
    title: 'Unlock the secrets to the perfect close shave without irritation.',
    excerpt: 'Learn the techniques and premium products needed to achieve a razor-sharp look while keeping your skin calm.',
    content: [
      'For many, shaving is a daily necessity, but it doesn\'t have to be a source of skin irritation, redness, or razor bumps. Transforming your shave from a chore into a premium grooming ritual is all about prep, technique, and post-shave care.',
      'The secret starts with heat and hydration. Shaving immediately after a warm shower or using a hot towel opens up pores and softens the beard hair, making it significantly easier to cut. Applying a pre-shave oil adds a layer of lubrication, allowing the razor to glide effortlessly across the skin.',
      'Always shave in the direction of hair growth (with the grain) using a clean, sharp blade. Applying excessive pressure is a common mistake; instead, let the weight of the razor do the work. Finish with a cold rinse to close the pores and apply an alcohol-free, soothing aftershave balm.'
    ],
    quote: 'A QUALITY SHAVE IS NOT JUST ABOUT THE SHARPNESS OF THE BLADE, BUT THE PREPARATION OF THE CANVAS AND THE SOOTHING AFTERCARE.',
    author: 'Marcus Brody',
    date: 'April 12, 2023',
    category: 'Face',
    tags: ['Face', 'Gloss', 'Cream'],
    image: '/img/Blog Section/Image-1.png',
    readTime: '4 min read',
    comments: [
      {
        id: 'c3',
        author: 'David Miller',
        email: 'david@example.com',
        date: '5 days ago',
        content: 'Pre-shave oil was a game changer for me. Completely eliminated my neck razor burn!',
        avatar: '/img/Team Members Images/team-3.png'
      }
    ]
  },
  {
    slug: 'top-hair-color-trends-season',
    title: 'Top hair color trends of this season you should try now.',
    excerpt: 'From honey blondes to rich chocolate balayages, discover the hottest hues to refresh your style.',
    content: [
      'A new season is the perfect excuse for a color refresh. Whether you want to make a bold statement with a vibrant fashion color or enhance your natural locks with soft, hand-painted highlights, this season\'s color palette offers something for everyone.',
      'Warmth is making a major comeback. We are seeing a shift away from icy ash tones toward buttery honey blondes, copper reds, and rich chestnut browns. Balayage remains highly popular because of its low-maintenance, lived-in aesthetic that grows out beautifully.',
      'If you decide to color your hair, investing in color-safe haircare is non-negotiable. Use sulfate-free shampoos, wash with cool water, and apply color-protecting masks to keep your hue vibrant and prevent premature fading.'
    ],
    quote: 'HAIR COLOR IS THE ULTIMATE MODE OF SELF-EXPRESSION. IT LIGHTS UP YOUR SKIN, ENHANCES YOUR EYES, AND REVEALS YOUR PERSONALITY.',
    author: 'Elena Rostova',
    date: 'April 15, 2023',
    category: 'Organic',
    tags: ['Blonde', 'Trends', 'Fashion'],
    image: '/img/Blog Section/Image-2.png',
    readTime: '6 min read',
    comments: []
  },
  {
    slug: 'professional-salon-equipment-benefits',
    title: 'Why professional salon equipment makes a massive difference.',
    excerpt: 'Take a peek behind the scenes to see how high-end styling tools protect hair integrity and elevate results.',
    content: [
      'Have you ever wondered why your hair looks and feels so much better when styled at a salon compared to at home? It is not just the expertise of the stylist—the tools we use play an equally critical role.',
      'Professional hairdryers, flat irons, and curling wands are engineered with advanced heating elements, such as ceramic, tourmaline, and ionic technology. These materials distribute heat evenly, seal the hair cuticle, and reduce static, which minimizes thermal damage and boosts shine.',
      'Additionally, professional tools feature precise temperature controls. Salon-grade blowdryers operate with powerful airflow rather than extreme heat, drying the hair faster without boiling the moisture inside the hair shaft. Upgrading your home tools can make a significant difference in long-term hair health.'
    ],
    quote: 'EXCELLENT STYLING IS A FUSION OF ARTISTIC VISION AND PRECISION ENGINEERING. INVESTING IN YOUR TOOLS IS INVESTING IN YOUR HAIR HEALTH.',
    author: 'Tranter Jaskulski',
    date: 'April 18, 2023',
    category: 'Equipment',
    tags: ['Equipment', 'Trends', 'Fashion'],
    image: '/img/Blog Grid View/Image-3.png',
    readTime: '5 min read',
    comments: []
  },
  {
    slug: 'organic-skincare-essentials-face',
    title: 'Organic skincare essentials for a glowing face.',
    excerpt: 'Clean beauty is more than a trend. Discover the powerful botanical ingredients that restore your natural glow.',
    content: [
      'Your face is your first impression, and caring for it with organic, clean ingredients ensures long-term radiance and vitality. Chemical-heavy skincare products can offer quick fixes but often cause irritation and weaken the skin barrier over time.',
      'Botanical extracts like chamomile, green tea, rosewater, and aloe vera are rich in antioxidants, vitamins, and minerals that nourish the skin naturally. They calm redness, fight free radical damage, and provide deep, non-greasy hydration.',
      'A simple, effective organic skincare routine involves three key steps: a gentle cream cleanser, a refreshing botanical toner, and a rich, cold-pressed facial oil or moisturizer. Nourishing your skin with pure ingredients lets its natural beauty shine through.'
    ],
    quote: 'FEED YOUR SKIN WITH THE SAME NUTRITIONAL RESPECT YOU FEED YOUR BODY. NATURE HOLDS THE ULTIMATE RECIPE FOR GLOWING HEALTH.',
    author: 'Sarah Peterson',
    date: 'April 20, 2023',
    category: 'Organic',
    tags: ['Cream', 'Face', 'Organic'],
    image: '/img/Blog Grid View/Image-1.png',
    readTime: '4 min read',
    comments: []
  },
  {
    slug: 'makeup-tips-flawless-evening-look',
    title: 'Pro makeup tips to achieve a flawless evening look.',
    excerpt: 'Step-by-step guidance on creating a stunning, long-lasting look for your next special night out.',
    content: [
      'Prepping for an evening event is the perfect time to elevate your makeup game. An evening look calls for products with higher pigment and longevity, and techniques that enhance your features under dim or artificial lighting.',
      'The secret to long-lasting makeup is base preparation. Start with a hydrating primer to smooth skin texture and keep foundation in place. Use a medium-to-full coverage foundation, blending down the neck, and spot-conceal any blemishes or under-eye darkness.',
      'For the eyes, define your brows and build depth in the crease with warm neutral shadows. Add a touch of shimmer to the center of the lid, apply water-resistant eyeliner, and finish with volumizing mascara. A bold lip or a subtle gloss adds the perfect finishing touch.'
    ],
    quote: 'MAKEUP IS NOT A MASK THAT CONCEALS YOUR BEAUTY; IT IS AN ACCENT THAT HIGHLIGHTS THE UNIQUE REFINEMENT OF YOUR FEATURES.',
    author: 'Elena Rostova',
    date: 'April 22, 2023',
    category: 'Face',
    tags: ['Make up', 'Gloss', 'Trends'],
    image: '/img/Blog Grid View/Image-2.png',
    readTime: '5 min read',
    comments: []
  },
  {
    slug: 'choosing-correct-shampoo-hair-type',
    title: 'Choosing the correct shampoo for your hair type.',
    excerpt: 'Understand shampoo labels and ingredients to select the perfect formula for your specific hair needs.',
    content: [
      'Walking down the haircare aisle can be overwhelming with hundreds of shampoo bottles promising various results. Choosing the wrong formula can leave your hair flat, greasy, or dry. The secret is matching the shampoo to your scalp type and hair condition.',
      'If you have an oily scalp, look for clarifying or balancing shampoos with ingredients like tea tree oil or citrus extracts. Avoid heavy moisturizing formulas. For dry or chemically treated hair, opt for creamy, sulfate-free shampoos enriched with argan oil, keratin, or shea butter.',
      'Fine hair benefits from volumizing shampoos that gently cleanse without weighing down the roots, while curly hair requires deep hydration and frizz-control formulas. Check the ingredients label and prioritize sulfate-free, organic options.'
    ],
    quote: 'THE MAIN GOAL OF SHAMPOO IS TO CLEANSE THE SCALP, NOT JUST THE HAIR. MATCH THE SHAMPOO TO YOUR SCALP TYPE AND THE CONDITIONER TO YOUR ENDS.',
    author: 'Tranter Jaskulski',
    date: 'April 25, 2023',
    category: 'Organic',
    tags: ['Organic', 'Cream', 'Trends'],
    image: '/img/Blog Grid View/Image-4.png',
    readTime: '4 min read',
    comments: []
  },
  {
    slug: 'evolution-hair-styling-technology',
    title: 'The fascinating evolution of hair styling technology.',
    excerpt: 'From heated metal tongs to intelligent heat control sensors, see how styling tools have transformed over the decades.',
    content: [
      'Hair styling tools have come a long way since the early days of heated metal tongs placed over open flames. Today\'s tools feature advanced microprocessors, intelligent heat sensors, and aerodynamic engineering designed to style hair with minimal thermal impact.',
      'In the mid-20th century, hair dryers were bulky, loud, and ran extremely hot, causing significant hair damage. The introduction of ceramic and tourmaline elements in the late 90s revolutionized the industry by emitting far-infrared heat and negative ions, which dry hair from the inside out.',
      'Modern innovations focus on smart sensors that measure airflow temperature up to 40 times per second, ensuring the heat never exceeds safe limits. As technology continues to evolve, the future of styling lies in maintaining absolute hair health.'
    ],
    quote: 'TECHNOLOGY IN STYLING HAS MOVED FROM RAW FORCE TO INTELLIGENT CARE. PROPER TOOLS EMPOWER BEAUTIFUL RESULTS WITHOUT COMPROMISE.',
    author: 'Tranter Jaskulski',
    date: 'April 28, 2023',
    category: 'Equipment',
    tags: ['Equipment', 'Trends', 'Fashion'],
    image: '/img/Blog Grid View/Image-5.png',
    readTime: '6 min read',
    comments: []
  }
];
