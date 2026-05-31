// tripify-backend/src/config/updateImages.js
require('dotenv').config();
const db = require('./db');
const { getDestinationImage } = require('../services/imageService');

const updateMissingImages = async () => {
  try {
    const result = await db.query(
      `SELECT id, name, city, category FROM places WHERE image_url IS NULL OR image_url = ''`
    );

    console.log(`Found ${result.rows.length} places with missing images`);

    for (const place of result.rows) {
      const url = await getDestinationImage(place.name, place.city, place.category);
      await db.query(`UPDATE places SET image_url = $1 WHERE id = $2`, [url, place.id]);
      console.log(`✅ Fixed: ${place.name}`);
      await new Promise(r => setTimeout(r, 300)); // avoid rate limit
    }

    console.log('🎉 All done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

updateMissingImages();