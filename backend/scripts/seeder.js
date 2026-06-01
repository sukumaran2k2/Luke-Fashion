import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import connectDB from '../config/db.js';

dotenv.config();

// Connect to DB (using the path from root)
await connectDB();

const seedUsers = [
  {
    name: 'Luke Admin',
    email: 'admin@lukefashion.com',
    password: 'admin12345',
    isAdmin: true,
  },
  {
    name: 'Jane Buyer',
    email: 'buyer@lukefashion.com',
    password: 'buyer12345',
    isAdmin: false,
  },
];

const seedProducts = [
  {
    name: 'Luke Gold Embroidered Blazer',
    images: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    description: 'Elevate your evening wardrobe with the Luke Gold Embroidered Blazer. Tailored from a premium wool-blend fabrication, it features meticulous hand-stitched gold brocade embroidery on the lapels, double-vented back, and a structured Italian silhouette. Designed to make an unforgettable entrance.',
    price: 349.99,
    countInStock: 8,
    sizes: ['M', 'L', 'XL'],
    colors: ['Black Gold', 'Navy Gold'],
    isFeatured: true,
    rating: 4.8,
    numReviews: 4,
    reviews: [
      { name: 'Arthur Pendragon', rating: 5, comment: 'Absolutely sensational. Fits perfectly and the embroidery is flawless.', user: null },
      { name: 'Victor V.', rating: 4, comment: 'Gorgeous blazer. Wore it to a gala and got tons of compliments.', user: null }
    ]
  },
  {
    name: 'Luke Silk Slip Dress',
    images: [
      'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    description: 'Drafted from 100% pure Mulberry silk, this cowl-neck slip dress floats gracefully around the body. Features adjustable delicate cross-back spaghetti straps, a soft bias-cut hemline that pools elegantly, and a luxurious satin finish. A timeless piece for romantic dinners.',
    price: 199.50,
    countInStock: 12,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald Green', 'Champagne', 'Midnight Black'],
    isFeatured: true,
    rating: 4.9,
    numReviews: 2,
    reviews: [
      { name: 'Isabella R.', rating: 5, comment: 'The silk feels incredibly soft and high quality. The bias cut is very flattering!', user: null }
    ]
  },
  {
    name: 'Luke Minimalist Leather Chelsea Boots',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Men',
    description: 'Crafted in Tuscany from full-grain calfskin leather, these boots offer a sleek, hardware-free profile. Fully leather-lined with a durable, water-resistant Dainite rubber sole, elasticated side panels, and woven pull tabs. A beautiful bridge between casual refinement and formal wear.',
    price: 240.00,
    countInStock: 15,
    sizes: ['8', '9', '10', '11'],
    colors: ['Cognac Tan', 'Obsidian Black'],
    isFeatured: true,
    rating: 4.7,
    numReviews: 1,
    reviews: [
      { name: 'Liam Nees', rating: 5, comment: 'Best Chelsea boots I have owned. Break-in period was minimal, leather is beautiful.', user: null }
    ]
  },
  {
    name: 'Luke Classic Leather Trench Coat',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    description: 'An architectural reinterpretation of the iconic military trench. Tailored in structured nappa leather that softens beautifully over time. Detailed with double-breasted closure, waist-cinching belt, shoulder epaulets, storm flaps, and standard deep utility pockets.',
    price: 499.99,
    countInStock: 5,
    sizes: ['S', 'M', 'L'],
    colors: ['Vintage Tan', 'Carbon Black'],
    isFeatured: true,
    rating: 5.0,
    numReviews: 3,
    reviews: [
      { name: 'Diana Prince', rating: 5, comment: 'Stunning leather trench! Feels empowering and fits like a glove.', user: null }
    ]
  },
  {
    name: 'Luke Oversized Cashmere Hoodie',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Unisex',
    description: 'Luxury meets relaxed utility. Knit from thick, ultra-soft 12-gauge Mongolian cashmere, this unisex hoodie features a double-layered hood, dropped shoulders, hand-warming kangaroo pocket, and ribbed trims. Perfect for luxury lounging or long-haul travel.',
    price: 180.00,
    countInStock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Heather Gray', 'Oatmeal Beige', 'Navy'],
    isFeatured: false,
    rating: 4.6,
    numReviews: 2,
    reviews: []
  },
  {
    name: 'Luke Tailored Linen Trouser',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Women',
    description: 'Perfectly relaxed, lightweight trousers cut from Belgian organic flax linen. Designed with a flattering high-rise waistband, front pleat detailing, a wide-leg cut, and hidden hook-and-bar closure. Breathable, airy, and effortlessly chic.',
    price: 110.00,
    countInStock: 10,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pure White', 'Sand Beige'],
    isFeatured: false,
    rating: 4.5,
    numReviews: 1,
    reviews: []
  },
  {
    name: 'Luke Knit Wool Scarf',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Accessories',
    description: 'A cozy, statement scarf knit from extra-fine Merino wool. Oversized construction allows for multiple styling options, while the thick ribbed design provides unbeatable insulation against cold winter drafts.',
    price: 65.00,
    countInStock: 30,
    sizes: ['One Size'],
    colors: ['Forest Green', 'Burnt Orange', 'Charcoal'],
    isFeatured: false,
    rating: 4.8,
    numReviews: 8,
    reviews: []
  },
  {
    name: 'Luke Aviator Sunglasses',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Accessories',
    description: 'A structural take on the timeless aviator shape. Crafted from lightweight, high-grade titanium with an ultra-thin double bridge, flexible hinges, and 100% UVA/UVB polarized protective lenses. Finished with custom branding.',
    price: 135.00,
    countInStock: 25,
    sizes: ['One Size'],
    colors: ['Gold / Green Lens', 'Black / Black Lens'],
    isFeatured: false,
    rating: 4.9,
    numReviews: 12,
    reviews: []
  }
];

const importData = async () => {
  try {
    // Clear Existing Database
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Database cleared!');

    // Import Users
    const createdUsers = await User.create(seedUsers);
    const adminUser = createdUsers[0]._id;

    // Attach Admin User ID to Reviews
    const sampleProducts = seedProducts.map((product) => {
      const p = { ...product, user: adminUser };
      p.reviews = p.reviews.map((r) => ({ ...r, user: adminUser }));
      return p;
    });

    // Import Products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
