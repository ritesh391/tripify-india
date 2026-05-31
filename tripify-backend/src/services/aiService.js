const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateItinerary = async ({ destination, days, budget, travelers, interests }) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an expert Indian travel planner. Create a detailed ${days}-day trip itinerary for ${destination}, India.
Trip Details:
- Destination: ${destination}
- Number of days: ${days}
- Budget: ₹${budget} per person
- Number of travelers: ${travelers}
- Interests: ${interests || 'sightseeing, food, culture'}
Please provide a day-by-day itinerary in this exact JSON format:
{
  "title": "Trip title",
  "destination": "${destination}",
  "overview": "Brief overview of the trip",
  "totalBudget": estimated total budget in rupees,
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "morning": "Morning activities",
      "afternoon": "Afternoon activities",
      "evening": "Evening activities",
      "places": ["place1", "place2"],
      "estimatedCost": cost in rupees,
      "tips": "Local tips for the day"
    }
  ],
  "packingList": ["item1", "item2"],
  "bestTimeToVisit": "Best time info",
  "localTips": "General local tips"
}
Return ONLY the JSON, no extra text.`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const chatWithAI = async (message) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are Tripify AI, an expert Indian travel assistant. You help users plan trips across India. 
        You know about all Indian destinations, best times to visit, budgets, local food, culture, transport and accommodation.
        Keep responses concise, helpful and friendly. Use Indian context (₹ for currency, Indian cities, Indian culture).`
      },
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
  return completion.choices[0].message.content;
};

const searchTransport = async ({ from, to, mode, date, pax }) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an Indian travel transport expert. Generate realistic ${mode} options from ${from} to ${to} for ${pax} passenger(s)${date ? ` on ${date}` : ''}.
Return ONLY a JSON array with 4 options in this format:
[
  {
    "name": "Airline/Train/Bus name",
    "code": "Flight/Train code",
    "departure": "HH:MM",
    "arrival": "HH:MM",
    "duration": "Xh Ym",
    "stops": "Non-stop or 1 stop",
    "price": price in rupees as number,
    "tag": "Cheapest/AI Pick/Fastest/Premium",
    "amenities": ["Wifi", "Meal"]
  }
]
Return ONLY the JSON array, no extra text.`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const getTimingPrediction = async ({ destination }) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an Indian travel timing expert. Give timing predictions for visiting ${destination}, India.

Return ONLY this JSON format:
{
  "predictions": [
    {
      "destination": "${destination}",
      "bestWindow": "Month range or specific time",
      "insight": "One line insight about why",
      "avoid": "Month or season to avoid",
      "tone": "primary or success or warning or info"
    },
    {
      "destination": "${destination} (Budget)",
      "bestWindow": "Best time for budget travel",
      "insight": "Budget specific insight",
      "avoid": "Expensive season",
      "tone": "success"
    },
    {
      "destination": "${destination} (Crowd)",
      "bestWindow": "Best time for low crowds",
      "insight": "Crowd specific insight",
      "avoid": "Peak tourist season",
      "tone": "info"
    }
  ],
  "timeOfDay": [
    { "t": "Sunrise (05:30–07:00)", "v": 96, "n": "Best time description" },
    { "t": "Morning (07–11)", "v": 84, "n": "Best time description" },
    { "t": "Midday (11–15)", "v": 48, "n": "Best time description" },
    { "t": "Evening (16–19)", "v": 88, "n": "Best time description" },
    { "t": "Night (20–23)", "v": 72, "n": "Best time description" }
  ]
}
Return ONLY the JSON, no extra text.`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const getLiveIntel = async () => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a real-time Indian tourism intelligence system. Generate current live alerts and destination status for India.

Return ONLY this JSON:
{
  "alerts": [
    {
      "type": "warning or info or success or danger",
      "title": "Alert title",
      "desc": "Alert description",
      "destination": "City name",
      "time": "X mins ago"
    }
  ],
  "destinations": [
    {
      "name": "City name",
      "state": "State name",
      "crowd": crowd percentage as number 0-100,
      "weather": "Good/Fair/Poor",
      "status": "normal or busy or alert",
      "alert": "One line current status"
    }
  ]
}
Generate 8 alerts and 8 destinations for popular Indian tourist spots.
Return ONLY the JSON, no extra text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const getInsights = async () => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a tourism AI intelligence system for India. Generate 9 AI agent insights about Indian tourism right now.

Return ONLY this JSON:
{
  "insights": [
    {
      "name": "Agent name (e.g. Weather Agent, Price Agent)",
      "status": "active or alert or warning or success or info",
      "insight": "One specific actionable insight about Indian tourism",
      "action": "Recommended action for traveler",
      "destination": "Specific Indian city or region",
      "confidence": confidence percentage as number 70-99
    }
  ]
}
Generate exactly 9 diverse insights covering weather, prices, crowds, events, safety, hidden gems, transport, hotels and seasonal tips for various Indian destinations.
Return ONLY the JSON, no extra text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

const getMarketplaceVendors = async ({ category, city }) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a local services marketplace for India. Generate 9 realistic local service providers${city ? ` in ${city}` : ' across India'}${category && category !== 'All' ? ` who are ${category}s` : ''}.

Return ONLY this JSON:
{
  "vendors": [
    {
      "name": "Indian person name",
      "role": "Their role (Guide/Photographer/Driver/etc)",
      "city": "Indian city",
      "description": "Brief description of their services",
      "specialties": ["specialty1", "specialty2", "specialty3"],
      "rating": rating between 4.0-5.0,
      "reviews": number of reviews between 50-500,
      "trust": trust score between 85-99,
      "price": "₹X,XXX",
      "priceUnit": "per day or per session or per trip"
    }
  ]
}
Generate exactly 9 diverse vendors from different Indian cities.
Return ONLY the JSON, no extra text.`
      }
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });
  const response = completion.choices[0].message.content;
  const cleaned = response.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { generateItinerary, chatWithAI, searchTransport, getTimingPrediction, getLiveIntel,  getInsights, getMarketplaceVendors};