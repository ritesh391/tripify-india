const pool = require('./db');

const stays = [
  { name: 'The Leela Palace', city: 'Udaipur', state: 'Rajasthan', type: 'hotel', price: 12500, rating: 4.9, reviews: 1240, amenities: ['Wifi', 'Pool', 'Breakfast', 'Spa'], image_url: null, badge: 'AI Pick' },
  { name: 'Zostel Manali', city: 'Manali', state: 'Himachal Pradesh', type: 'hostel', price: 850, rating: 4.6, reviews: 890, amenities: ['Wifi', 'Breakfast', 'Common Room'], image_url: null, badge: 'Budget Pick' },
  { name: 'Evolve Back Resort', city: 'Coorg', state: 'Karnataka', type: 'resort', price: 18000, rating: 4.9, reviews: 560, amenities: ['Wifi', 'Pool', 'Breakfast', 'Spa', 'AC'], image_url: null, badge: 'Eco Certified' },
  { name: 'Treehouse Hideaway', city: 'Jaipur', state: 'Rajasthan', type: 'villa', price: 6500, rating: 4.7, reviews: 340, amenities: ['Wifi', 'Breakfast', 'AC'], image_url: null, badge: 'Hidden Gem' },
  { name: 'Kerala Houseboat', city: 'Alleppey', state: 'Kerala', type: 'eco', price: 9500, rating: 4.8, reviews: 780, amenities: ['Breakfast', 'AC', 'Wifi'], image_url: null, badge: 'Trending' },
  { name: 'The Postcard Goa', city: 'Goa', state: 'Goa', type: 'resort', price: 15000, rating: 4.8, reviews: 420, amenities: ['Wifi', 'Pool', 'Breakfast', 'Beach Access'], image_url: null, badge: 'Premium' },
  { name: 'Banjara Camp', city: 'Spiti', state: 'Himachal Pradesh', type: 'eco', price: 4500, rating: 4.7, reviews: 290, amenities: ['Breakfast', 'Bonfire'], image_url: null, badge: 'Adventure' },
  { name: 'Old City Homestay', city: 'Varanasi', state: 'Uttar Pradesh', type: 'homestay', price: 1800, rating: 4.6, reviews: 510, amenities: ['Wifi', 'Breakfast'], image_url: null, badge: 'Verified' },
  { name: 'Taj Lake Palace', city: 'Udaipur', state: 'Rajasthan', type: 'hotel', price: 35000, rating: 5.0, reviews: 2100, amenities: ['Wifi', 'Pool', 'Breakfast', 'Spa', 'AC', 'Butler'], image_url: null, badge: 'Luxury' },
  { name: 'The Hosteller Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', type: 'hostel', price: 750, rating: 4.5, reviews: 1100, amenities: ['Wifi', 'Yoga', 'Common Room'], image_url: null, badge: 'Best Value' },
  { name: 'Windflower Resort', city: 'Mysore', state: 'Karnataka', type: 'resort', price: 7500, rating: 4.7, reviews: 380, amenities: ['Wifi', 'Pool', 'Breakfast', 'Spa'], image_url: null, badge: 'AI Pick' },
  { name: 'Snow Valley Resorts', city: 'Shimla', state: 'Himachal Pradesh', type: 'hotel', price: 4200, rating: 4.5, reviews: 620, amenities: ['Wifi', 'Breakfast', 'AC', 'Mountain View'], image_url: null, badge: 'Trending' },
  { name: 'Coconut Creek', city: 'Goa', state: 'Goa', type: 'resort', price: 5800, rating: 4.6, reviews: 450, amenities: ['Wifi', 'Pool', 'Breakfast', 'Beach Access'], image_url: null, badge: 'Eco Certified' },
  { name: 'Ratan Vilas', city: 'Jodhpur', state: 'Rajasthan', type: 'homestay', price: 3200, rating: 4.7, reviews: 280, amenities: ['Wifi', 'Breakfast', 'Heritage Property'], image_url: null, badge: 'Hidden Gem' },
  { name: 'Zostel Goa', city: 'Goa', state: 'Goa', type: 'hostel', price: 950, rating: 4.5, reviews: 760, amenities: ['Wifi', 'Beach Access', 'Common Room'], image_url: null, badge: 'Budget Pick' },
];

const seedStays = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stays (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        state VARCHAR(100),
        type VARCHAR(50),
        price DECIMAL(10,2),
        rating DECIMAL(3,2),
        reviews INTEGER,
        amenities TEXT[],
        image_url VARCHAR(500),
        badge VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query('DELETE FROM stays');
    for (const stay of stays) {
      await pool.query(
        `INSERT INTO stays (name, city, state, type, price, rating, reviews, amenities, image_url, badge)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [stay.name, stay.city, stay.state, stay.type, stay.price, stay.rating, stay.reviews, stay.amenities, stay.image_url, stay.badge]
      );
    }
    console.log(`✅ ${stays.length} stays seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding stays:', error);
    process.exit(1);
  }
};

seedStays();