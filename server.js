const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Enable Express to serve static local folders (images, webp files, HTML, CSS, JS)
app.use(express.static(__dirname));
app.use('/feastables', express.static(path.join(__dirname, 'feastables')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/homeimg', express.static(path.join(__dirname, 'homeimg')));

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/youtube_shop')
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ Connection error:', err));

// 2. Define Schemas
const SlideSchema = new mongoose.Schema({
  image_path: String,
  alt_text: String
});

const CategorySchema = new mongoose.Schema({
  title: String,
  description: String,
  image_path: String,
  page_link: String
});

const ProductSchema = new mongoose.Schema({
  title: String,
  category: String,
  price: String,
  image_path: String,
  description: String,
  buy_url: String
});

const Slide = mongoose.model('Slide', SlideSchema);
const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

// 3. API Endpoints
app.get('/api/slides', async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load slides' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

app.get('/api/products/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 4. Seed Data Endpoint
app.get('/api/seed', async (req, res) => {
  try {
    await Slide.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Home Page Hero Slides
    await Slide.insertMany([
      { image_path: 'feastables/feast.webp', alt_text: 'Feastables Banner' },
      { image_path: 'https://m.media-amazon.com/images/I/61N+649-6fL._SL1500_.jpg', alt_text: 'Prime Hydration' },
      { image_path: 'https://m.media-amazon.com/images/I/71LqK8U2WnL._SL1500_.jpg', alt_text: 'Lunchly Meals' }
    ]);

    // Home Page Categories
    await Category.insertMany([
      { title: 'Prime Drinks', description: 'Hydration powered by Logan Paul & KSI.', image_path: 'https://m.media-amazon.com/images/I/61N+649-6fL._SL1500_.jpg', page_link: 'prime.html' },
      { title: 'Feastables', description: 'Delicious chocolate bars created by MrBeast.', image_path: 'feastables/Chocolate_Milk_60g_Carton.webp', page_link: 'feastables.html' },
      { title: 'Lunchly Meals', description: 'Wholesome and quick YouTuber-inspired meals.', image_path: 'https://m.media-amazon.com/images/I/71LqK8U2WnL._SL1500_.jpg', page_link: 'lunchly.html' }
    ]);

    // Products (Prime & Local Feastables Images)
    await Product.insertMany([
      // --- PRIME FLAVORS ---
      {
        title: 'Cherry Freeze',
        category: 'prime',
        price: '$9.99',
        image_path: 'https://m.media-amazon.com/images/I/61Y-5wD4vGL._SL1500_.jpg',
        description: 'Cool refreshing cherry hydration.',
        buy_url: 'https://drinkprime.com/products/cherry-freeze'
      },
      {
        title: 'Lemon Lime',
        category: 'prime',
        price: '$9.99',
        image_path: 'https://m.media-amazon.com/images/I/51wY4GvU7VL._SL1500_.jpg',
        description: 'Zesty lemon-lime flavor explosion.',
        buy_url: 'https://www.amazon.com/dp/B0B52LW83M'
      },

      // --- FEASTABLES PRODUCTS (Using local downloaded .webp images from your feastables folder) ---
      {
        title: 'Milk Chocolate Bar',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_Milk_60g_Carton.webp',
        description: 'Rich and creamy milk chocolate bar by MrBeast.',
        buy_url: 'https://feastables.com/products/milk-chocolate-bar'
      },
      {
        title: 'Peanut Butter Crunch',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_PB_60g_Carton.webp',
        description: 'Creamy peanut butter with crispy chocolate crunch.',
        buy_url: 'https://feastables.com/products/peanut-butter-bar'
      },
      {
        title: 'Milk Crunch Bar',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_Milk_Crunch.webp',
        description: 'Delicious milk chocolate with puffed rice crunch.',
        buy_url: 'https://feastables.com/products/milk-crunch-bar'
      },
      {
        title: 'Dark Chocolate Bar',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_Dark_60g_Carton.webp',
        description: 'Organic dark chocolate made with simple ingredients.',
        buy_url: 'https://feastables.com/products/dark-chocolate'
      },
      {
        title: 'Cookies & Creme Bar',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_CookiesCreme_60g_Carton.webp',
        description: 'Creamy white chocolate packed with crunchy cookie bits.',
        buy_url: 'https://feastables.com/products/cookies-and-creme'
      },
      {
        title: 'Chocolate Almond Bar',
        category: 'feastables',
        price: '$2.99',
        image_path: 'feastables/Chocolate_Almond_60g_Carton.webp',
        description: 'Rich milk chocolate with roasted almond chunks.',
        buy_url: 'https://feastables.com/products/almond-bar'
      }
    ]);

    res.send('✅ Database populated with local Feastables images!');
  } catch (err) {
    res.status(500).send('❌ Error seeding data: ' + err.message);
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});