const { generateItinerary, chatWithAI, searchTransport, getTimingPrediction, getLiveIntel, getInsights, getMarketplaceVendors} = require('../services/aiService');

const createItinerary = async (req, res) => {
  try {
    const { destination, days, budget, travelers, interests } = req.body;
    if (!destination || !days || !budget) {
      return res.status(400).json({ message: 'destination, days and budget are required' });
    }
    console.log(`Generating itinerary for ${destination}...`);
    const itinerary = await generateItinerary({ destination, days, budget, travelers: travelers || 1, interests });
    res.json({ message: 'Itinerary generated successfully!', itinerary });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ message: 'Failed to generate itinerary', error: error.message });
  }
};

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'message is required' });
    const reply = await chatWithAI(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chat Error:', error.message);
    res.status(500).json({ message: 'Failed to get response', error: error.message });
  }
};

const transport = async (req, res) => {
  try {
    const { from, to, mode, date, pax } = req.body;
    if (!from || !to) return res.status(400).json({ message: 'from and to are required' });
    const options = await searchTransport({ from, to, mode: mode || 'flight', date, pax: pax || 1 });
    res.json({ options });
  } catch (error) {
    console.error('Transport Error:', error.message);
    res.status(500).json({ message: 'Failed to search transport', error: error.message });
  }
};

const timing = async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) return res.status(400).json({ message: 'destination is required' });
    const data = await getTimingPrediction({ destination });
    res.json(data);
  } catch (error) {
    console.error('Timing Error:', error.message);
    res.status(500).json({ message: 'Failed to get timing prediction', error: error.message });
  }
};

const live = async (req, res) => {
  try {
    const data = await getLiveIntel();
    res.json(data);
  } catch (error) {
    console.error('Live Intel Error:', error.message);
    res.status(500).json({ message: 'Failed to get live intel', error: error.message });
  }
};

const insights = async (req, res) => {
  try {
    const data = await getInsights();
    res.json(data);
  } catch (error) {
    console.error('Insights Error:', error.message);
    res.status(500).json({ message: 'Failed to get insights', error: error.message });
  }
};

const marketplace = async (req, res) => {
  try {
    const { category, city } = req.body;
    const data = await getMarketplaceVendors({ category, city });
    res.json(data);
  } catch (error) {
    console.error('Marketplace Error:', error.message);
    res.status(500).json({ message: 'Failed to get vendors', error: error.message });
  }
};



module.exports = { createItinerary, chat, transport, timing, live, insights, marketplace  };
