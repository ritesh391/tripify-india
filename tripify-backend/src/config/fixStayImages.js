require('dotenv').config();
const pool = require('./db');

const getStayImage = async (name, city, type) => {
  const queries = [
    `${city} ${type} India hotel travel`,
    `${city} India accommodation`,
    `${city} India travel`,
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    } catch (error) {
      console.error(`Failed for "${query}"`);
    }
  }

  // Fallback by type
  const fallbacks = {
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    resort: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    hostel: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    homestay: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    villa: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    eco: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
  };

  return fallbacks[type] || fallbacks.hotel;
};

const fixStayImages = async () => {
  const result = await pool.query(`SELECT id, name, city, type FROM stays WHERE image_url IS NULL OR image_url = ''`);
  console.log(`Found ${result.rows.length} stays with missing images`);

  for (const stay of result.rows) {
    const url = await getStayImage(stay.name, stay.city, stay.type);
    await pool.query(`UPDATE stays SET image_url = $1 WHERE id = $2`, [url, stay.id]);
    console.log(`✅ Fixed: ${stay.name} → ${url}`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('🎉 All done!');
  process.exit(0);
};

fixStayImages();