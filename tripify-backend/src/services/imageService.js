const getDestinationImage = async (placeName, city, category) => {
  const queries = [
    `${placeName} ${city} India ${category} travel`,
    `${placeName} India`,
    `${city} India travel`,
    `${category} India travel`,
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    } catch (error) {
      console.error(`Image fetch error for "${query}":`, error);
    }
  }

  // Fallback images by category
  const fallbacks = {
    Temple: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    Beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    Fort: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    Nature: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    Monument: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    Palace: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    Religious: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    Landmark: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  };

  return fallbacks[category] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800';
};

module.exports = { getDestinationImage };