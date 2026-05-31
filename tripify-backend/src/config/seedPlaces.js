const pool = require('./db');

const places = [
  // GOA
  { name: 'Baga Beach', city: 'Goa', state: 'Goa', description: 'Popular beach with water sports, shacks and nightlife', category: 'Beach', rating: 4.5 },
  { name: 'Anjuna Beach', city: 'Goa', state: 'Goa', description: 'Famous beach with flea markets and trance parties', category: 'Beach', rating: 4.4 },
  { name: 'Palolem Beach', city: 'Goa', state: 'Goa', description: 'Stunning crescent shaped beach in South Goa', category: 'Beach', rating: 4.7 },
  { name: 'Dudhsagar Falls', city: 'Goa', state: 'Goa', description: 'Magnificent four-tiered waterfall on Goa-Karnataka border', category: 'Nature', rating: 4.8 },
  { name: 'Basilica of Bom Jesus', city: 'Old Goa', state: 'Goa', description: 'UNESCO World Heritage baroque church', category: 'Heritage', rating: 4.6 },

  // RAJASTHAN
  { name: 'Amber Fort', city: 'Jaipur', state: 'Rajasthan', description: 'Magnificent hilltop fort with stunning architecture', category: 'Fort', rating: 4.7 },
  { name: 'Hawa Mahal', city: 'Jaipur', state: 'Rajasthan', description: 'Palace of Winds with unique honeycomb facade', category: 'Palace', rating: 4.6 },
  { name: 'City Palace Jaipur', city: 'Jaipur', state: 'Rajasthan', description: 'Royal palace complex in the heart of Jaipur', category: 'Palace', rating: 4.7 },
  { name: 'Mehrangarh Fort', city: 'Jodhpur', state: 'Rajasthan', description: 'Massive fort rising above the blue city', category: 'Fort', rating: 4.8 },
  { name: 'Umaid Bhawan Palace', city: 'Jodhpur', state: 'Rajasthan', description: 'One of the world\'s largest private residences', category: 'Palace', rating: 4.7 },
  { name: 'Lake Pichola', city: 'Udaipur', state: 'Rajasthan', description: 'Stunning artificial lake with island palaces', category: 'Nature', rating: 4.8 },
  { name: 'City Palace Udaipur', city: 'Udaipur', state: 'Rajasthan', description: 'Majestic palace complex on the banks of Lake Pichola', category: 'Palace', rating: 4.8 },
  { name: 'Jaisalmer Fort', city: 'Jaisalmer', state: 'Rajasthan', description: 'Living fort rising from the Thar Desert', category: 'Fort', rating: 4.7 },
  { name: 'Sam Sand Dunes', city: 'Jaisalmer', state: 'Rajasthan', description: 'Golden sand dunes perfect for camel safari', category: 'Adventure', rating: 4.6 },
  { name: 'Pushkar Lake', city: 'Pushkar', state: 'Rajasthan', description: 'Sacred lake surrounded by 52 ghats and temples', category: 'Spiritual', rating: 4.6 },
  { name: 'Ranthambore National Park', city: 'Sawai Madhopur', state: 'Rajasthan', description: 'Famous tiger reserve with ancient fort ruins', category: 'Nature', rating: 4.7 },

  // KERALA
  { name: 'Alleppey Backwaters', city: 'Alleppey', state: 'Kerala', description: 'Famous network of canals, rivers and lakes with houseboats', category: 'Nature', rating: 4.9 },
  { name: 'Munnar Tea Gardens', city: 'Munnar', state: 'Kerala', description: 'Lush green tea plantations in the Western Ghats', category: 'Nature', rating: 4.8 },
  { name: 'Varkala Beach', city: 'Varkala', state: 'Kerala', description: 'Stunning cliff beach with mineral water springs', category: 'Beach', rating: 4.7 },
  { name: 'Periyar Wildlife Sanctuary', city: 'Thekkady', state: 'Kerala', description: 'Scenic wildlife sanctuary around Periyar Lake', category: 'Nature', rating: 4.7 },
  { name: 'Kovalam Beach', city: 'Kovalam', state: 'Kerala', description: 'Crescent shaped beach with lighthouse and Ayurveda centers', category: 'Beach', rating: 4.5 },
  { name: 'Fort Kochi', city: 'Kochi', state: 'Kerala', description: 'Historic port area with Chinese fishing nets and colonial heritage', category: 'Heritage', rating: 4.6 },
  { name: 'Wayanad Wildlife Sanctuary', city: 'Wayanad', state: 'Kerala', description: 'Dense forests with elephants, tigers and ancient caves', category: 'Nature', rating: 4.7 },

  // HIMACHAL PRADESH
  { name: 'Rohtang Pass', city: 'Manali', state: 'Himachal Pradesh', description: 'High mountain pass with snow and stunning views', category: 'Adventure', rating: 4.7 },
  { name: 'Solang Valley', city: 'Manali', state: 'Himachal Pradesh', description: 'Beautiful valley with skiing and adventure sports', category: 'Adventure', rating: 4.6 },
  { name: 'Hadimba Temple', city: 'Manali', state: 'Himachal Pradesh', description: 'Ancient cave temple surrounded by cedar forest', category: 'Temple', rating: 4.5 },
  { name: 'Shimla Ridge', city: 'Shimla', state: 'Himachal Pradesh', description: 'Famous promenade with colonial architecture and Himalayan views', category: 'Landmark', rating: 4.5 },
  { name: 'Kufri', city: 'Shimla', state: 'Himachal Pradesh', description: 'Hill station with skiing and Himalayan wildlife park', category: 'Adventure', rating: 4.4 },
  { name: 'Spiti Valley', city: 'Spiti', state: 'Himachal Pradesh', description: 'Cold desert mountain valley with ancient monasteries', category: 'Adventure', rating: 4.9 },
  { name: 'Dharamshala', city: 'Dharamshala', state: 'Himachal Pradesh', description: 'Home of Dalai Lama with Tibetan culture and Himalayan views', category: 'Spiritual', rating: 4.7 },

  // UTTARAKHAND
  { name: 'Kedarnath Temple', city: 'Kedarnath', state: 'Uttarakhand', description: 'Sacred Shiva temple at 3583m in the Himalayas', category: 'Temple', rating: 4.9 },
  { name: 'Badrinath Temple', city: 'Badrinath', state: 'Uttarakhand', description: 'One of the Char Dham pilgrimage sites', category: 'Temple', rating: 4.9 },
  { name: 'Valley of Flowers', city: 'Chamoli', state: 'Uttarakhand', description: 'UNESCO World Heritage site with alpine flowers', category: 'Nature', rating: 4.9 },
  { name: 'Jim Corbett National Park', city: 'Ramnagar', state: 'Uttarakhand', description: 'India\'s oldest national park famous for Bengal tigers', category: 'Nature', rating: 4.7 },
  { name: 'Nainital Lake', city: 'Nainital', state: 'Uttarakhand', description: 'Pear shaped lake surrounded by hills', category: 'Nature', rating: 4.6 },
  { name: 'Rishikesh', city: 'Rishikesh', state: 'Uttarakhand', description: 'Yoga capital of world with rafting and Ganga aarti', category: 'Spiritual', rating: 4.8 },
  { name: 'Haridwar Ghat', city: 'Haridwar', state: 'Uttarakhand', description: 'Sacred city with famous Ganga aarti at Har Ki Pauri', category: 'Spiritual', rating: 4.8 },

  // TAMIL NADU
  { name: 'Meenakshi Temple', city: 'Madurai', state: 'Tamil Nadu', description: 'Ancient Hindu temple with stunning Dravidian architecture', category: 'Temple', rating: 4.8 },
  { name: 'Brihadeeswarar Temple', city: 'Thanjavur', state: 'Tamil Nadu', description: 'UNESCO World Heritage Chola temple', category: 'Temple', rating: 4.8 },
  { name: 'Marina Beach', city: 'Chennai', state: 'Tamil Nadu', description: 'Second longest urban beach in the world', category: 'Beach', rating: 4.3 },
  { name: 'Ooty Botanical Garden', city: 'Ooty', state: 'Tamil Nadu', description: 'Beautiful gardens in the Nilgiri Hills', category: 'Nature', rating: 4.5 },
  { name: 'Kodaikanal Lake', city: 'Kodaikanal', state: 'Tamil Nadu', description: 'Star shaped lake in the Princess of Hill Stations', category: 'Nature', rating: 4.6 },
  { name: 'Rameswaram Temple', city: 'Rameswaram', state: 'Tamil Nadu', description: 'Sacred island temple and Char Dham pilgrimage site', category: 'Temple', rating: 4.8 },

  // KARNATAKA
  { name: 'Hampi Ruins', city: 'Hampi', state: 'Karnataka', description: 'UNESCO World Heritage ruins of Vijayanagara Empire', category: 'Heritage', rating: 4.9 },
  { name: 'Mysore Palace', city: 'Mysore', state: 'Karnataka', description: 'Magnificent royal palace with Indo-Saracenic architecture', category: 'Palace', rating: 4.7 },
  { name: 'Coorg Coffee Plantations', city: 'Coorg', state: 'Karnataka', description: 'Scotland of India with coffee and spice plantations', category: 'Nature', rating: 4.7 },
  { name: 'Jog Falls', city: 'Shimoga', state: 'Karnataka', description: 'Second highest waterfall in India', category: 'Nature', rating: 4.7 },
  { name: 'Badami Caves', city: 'Badami', state: 'Karnataka', description: 'Ancient rock-cut cave temples from 6th century', category: 'Heritage', rating: 4.6 },
  { name: 'Gokarna Beach', city: 'Gokarna', state: 'Karnataka', description: 'Pristine beaches with spiritual significance', category: 'Beach', rating: 4.7 },

  // MAHARASHTRA
  { name: 'Ajanta Caves', city: 'Aurangabad', state: 'Maharashtra', description: 'UNESCO World Heritage Buddhist cave monuments', category: 'Heritage', rating: 4.8 },
  { name: 'Ellora Caves', city: 'Aurangabad', state: 'Maharashtra', description: 'UNESCO rock-cut temples of Hindu, Buddhist and Jain faiths', category: 'Heritage', rating: 4.8 },
  { name: 'Gateway of India', city: 'Mumbai', state: 'Maharashtra', description: 'Iconic monument overlooking the Arabian Sea', category: 'Landmark', rating: 4.5 },
  { name: 'Marine Drive', city: 'Mumbai', state: 'Maharashtra', description: 'Iconic seafront promenade known as Queens Necklace', category: 'Landmark', rating: 4.6 },
  { name: 'Lonavala', city: 'Lonavala', state: 'Maharashtra', description: 'Popular hill station with waterfalls and caves', category: 'Nature', rating: 4.4 },
  { name: 'Mahabaleshwar', city: 'Mahabaleshwar', state: 'Maharashtra', description: 'Hill station famous for strawberries and viewpoints', category: 'Nature', rating: 4.5 },

  // DELHI
  { name: 'India Gate', city: 'Delhi', state: 'Delhi', description: 'War memorial and iconic landmark of India', category: 'Monument', rating: 4.7 },
  { name: 'Qutub Minar', city: 'Delhi', state: 'Delhi', description: 'Tallest brick minaret in the world', category: 'Monument', rating: 4.6 },
  { name: 'Red Fort', city: 'Delhi', state: 'Delhi', description: 'Mughal fort and UNESCO World Heritage site', category: 'Fort', rating: 4.6 },
  { name: 'Humayun Tomb', city: 'Delhi', state: 'Delhi', description: 'First garden-tomb in the Indian subcontinent', category: 'Monument', rating: 4.7 },
  { name: 'Lotus Temple', city: 'Delhi', state: 'Delhi', description: 'Stunning Bahai House of Worship shaped like a lotus', category: 'Temple', rating: 4.6 },
  { name: 'Chandni Chowk', city: 'Delhi', state: 'Delhi', description: 'Historic market with street food and old Delhi vibes', category: 'Heritage', rating: 4.4 },

  // UTTAR PRADESH
  { name: 'Taj Mahal', city: 'Agra', state: 'Uttar Pradesh', description: 'Iconic white marble mausoleum and UNESCO World Heritage site', category: 'Monument', rating: 4.9 },
  { name: 'Agra Fort', city: 'Agra', state: 'Uttar Pradesh', description: 'Massive Mughal fort overlooking the Taj Mahal', category: 'Fort', rating: 4.6 },
  { name: 'Varanasi Ghats', city: 'Varanasi', state: 'Uttar Pradesh', description: 'Ancient ghats on the banks of sacred river Ganga', category: 'Spiritual', rating: 4.8 },
  { name: 'Sarnath', city: 'Varanasi', state: 'Uttar Pradesh', description: 'Where Buddha gave his first sermon', category: 'Spiritual', rating: 4.6 },
  { name: 'Fatehpur Sikri', city: 'Agra', state: 'Uttar Pradesh', description: 'Abandoned Mughal city UNESCO World Heritage site', category: 'Heritage', rating: 4.6 },

  // PUNJAB & AMRITSAR
  { name: 'Golden Temple', city: 'Amritsar', state: 'Punjab', description: 'Holiest shrine of Sikhism with stunning golden structure', category: 'Temple', rating: 4.9 },
  { name: 'Wagah Border', city: 'Amritsar', state: 'Punjab', description: 'Famous border ceremony between India and Pakistan', category: 'Landmark', rating: 4.6 },
  { name: 'Jallianwala Bagh', city: 'Amritsar', state: 'Punjab', description: 'Historic garden and memorial of 1919 massacre', category: 'Heritage', rating: 4.5 },

  // JAMMU & KASHMIR
  { name: 'Dal Lake', city: 'Srinagar', state: 'Jammu & Kashmir', description: 'Beautiful lake famous for houseboats and shikaras', category: 'Nature', rating: 4.8 },
  { name: 'Gulmarg', city: 'Gulmarg', state: 'Jammu & Kashmir', description: 'Meadow of flowers with Asia\'s highest gondola', category: 'Adventure', rating: 4.8 },
  { name: 'Pahalgam', city: 'Pahalgam', state: 'Jammu & Kashmir', description: 'Valley of shepherds with stunning mountain scenery', category: 'Nature', rating: 4.7 },
  { name: 'Sonamarg', city: 'Sonamarg', state: 'Jammu & Kashmir', description: 'Meadow of Gold with glaciers and mountain streams', category: 'Nature', rating: 4.8 },

  // NORTHEAST
  { name: 'Kaziranga National Park', city: 'Kaziranga', state: 'Assam', description: 'UNESCO site home to two-thirds of world\'s one-horned rhinos', category: 'Nature', rating: 4.8 },
  { name: 'Majuli Island', city: 'Majuli', state: 'Assam', description: 'World\'s largest river island with Vaishnavite culture', category: 'Heritage', rating: 4.6 },
  { name: 'Tawang Monastery', city: 'Tawang', state: 'Arunachal Pradesh', description: 'Largest monastery in India at 10000ft altitude', category: 'Spiritual', rating: 4.8 },
  { name: 'Cherrapunji', city: 'Cherrapunji', state: 'Meghalaya', description: 'One of the wettest places on earth with living root bridges', category: 'Nature', rating: 4.7 },
  { name: 'Shillong', city: 'Shillong', state: 'Meghalaya', description: 'Scotland of the East with waterfalls and lakes', category: 'Nature', rating: 4.6 },

  // ANDHRA & TELANGANA
  { name: 'Tirupati Temple', city: 'Tirupati', state: 'Andhra Pradesh', description: 'Most visited religious site in the world', category: 'Temple', rating: 4.9 },
  { name: 'Araku Valley', city: 'Visakhapatnam', state: 'Andhra Pradesh', description: 'Scenic valley with coffee plantations and tribal culture', category: 'Nature', rating: 4.6 },
  { name: 'Charminar', city: 'Hyderabad', state: 'Telangana', description: 'Iconic mosque and monument in the heart of Hyderabad', category: 'Monument', rating: 4.5 },
  { name: 'Golconda Fort', city: 'Hyderabad', state: 'Telangana', description: 'Medieval fort famous for its acoustic system', category: 'Fort', rating: 4.6 },

  // GUJARAT
  { name: 'Rann of Kutch', city: 'Kutch', state: 'Gujarat', description: 'Largest salt desert in the world stunning under moonlight', category: 'Nature', rating: 4.8 },
  { name: 'Somnath Temple', city: 'Somnath', state: 'Gujarat', description: 'First of 12 Jyotirlinga shrines on Arabian Sea coast', category: 'Temple', rating: 4.7 },
  { name: 'Gir National Park', city: 'Junagadh', state: 'Gujarat', description: 'Only home of Asiatic lions in the world', category: 'Nature', rating: 4.7 },
  { name: 'Dwarka Temple', city: 'Dwarka', state: 'Gujarat', description: 'Ancient temple city on the Arabian Sea', category: 'Temple', rating: 4.7 },

  // MADHYA PRADESH
  { name: 'Khajuraho Temples', city: 'Khajuraho', state: 'Madhya Pradesh', description: 'UNESCO World Heritage temples with erotic sculptures', category: 'Heritage', rating: 4.7 },
  { name: 'Bandhavgarh National Park', city: 'Umaria', state: 'Madhya Pradesh', description: 'Highest density of Bengal tigers in India', category: 'Nature', rating: 4.8 },
  { name: 'Sanchi Stupa', city: 'Sanchi', state: 'Madhya Pradesh', description: 'UNESCO World Heritage Buddhist monument from 3rd century BC', category: 'Heritage', rating: 4.6 },
  { name: 'Pachmarhi', city: 'Pachmarhi', state: 'Madhya Pradesh', description: 'Queen of Satpura with waterfalls and caves', category: 'Nature', rating: 4.6 },

  // ODISHA
  { name: 'Konark Sun Temple', city: 'Konark', state: 'Odisha', description: 'UNESCO World Heritage 13th century sun temple', category: 'Heritage', rating: 4.7 },
  { name: 'Jagannath Temple', city: 'Puri', state: 'Odisha', description: 'Sacred temple and Char Dham pilgrimage destination', category: 'Temple', rating: 4.8 },
  { name: 'Chilika Lake', city: 'Chilika', state: 'Odisha', description: 'Largest coastal lagoon in India with dolphins and birds', category: 'Nature', rating: 4.7 },

  // ANDAMAN
  { name: 'Radhanagar Beach', city: 'Havelock Island', state: 'Andaman & Nicobar', description: 'Voted Asia\'s best beach with crystal clear waters', category: 'Beach', rating: 4.9 },
  { name: 'Cellular Jail', city: 'Port Blair', state: 'Andaman & Nicobar', description: 'Historic colonial prison and national memorial', category: 'Heritage', rating: 4.6 },
  { name: 'Neil Island', city: 'Neil Island', state: 'Andaman & Nicobar', description: 'Pristine island with coral reefs and natural bridges', category: 'Beach', rating: 4.8 },
];

const seedPlaces = async () => {
  try {
    // Clear existing places first
    await pool.query('DELETE FROM places');
    console.log('Cleared existing places...');

    for (const place of places) {
      await pool.query(
        `INSERT INTO places (name, city, state, description, category, rating)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [place.name, place.city, place.state, place.description, place.category, place.rating]
      );
    }
    console.log(`✅ ${places.length} places seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding places:', error);
    process.exit(1);
  }
};

seedPlaces();