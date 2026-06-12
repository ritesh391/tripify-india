const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

export const saveToken = (token: string) => localStorage.setItem('tripify_token', token);
export const getToken = () => localStorage.getItem('tripify_token');
export const removeToken = () => localStorage.removeItem('tripify_token');

// AUTH
export const registerUser = async (name: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

// TRIPS
export const createTrip = async (tripData: object) => {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(tripData)
  });
  return res.json();
};

export const getMyTrips = async () => {
  const res = await fetch(`${BASE_URL}/trips`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

export const deleteTrip = async (id: number) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

// PLACES
export const getPlaces = async () => {
  const res = await fetch(`${BASE_URL}/places`);
  return res.json();
};

export const getPlacesByCity = async (city: string) => {
  const res = await fetch(`${BASE_URL}/places/city/${city}`);
  return res.json();
};

// AI
export const generateItinerary = async (tripDetails: object) => {
  const res = await fetch(`${BASE_URL}/ai/itinerary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(tripDetails)
  });
  return res.json();
};

// BOOKINGS
export const getMyBookings = async () => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

export const createBooking = async (bookingData: object) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(bookingData)
  });
  return res.json();
};

export const cancelBooking = async (id: number) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};

// STAYS
export const getStay = async (id: string) => {
  const res = await fetch(`${BASE_URL}/stays/${id}`);
  return res.json();
};
export const getStays = async (filters?: { city?: string; type?: string; maxPrice?: number }) => {
  const params = new URLSearchParams();
  if (filters?.city) params.append('city', filters.city);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
  const res = await fetch(`${BASE_URL}/stays?${params}`);
  return res.json();
};

// COMMUNITY
export const getCommunityPosts = async () => {
  const res = await fetch(`${BASE_URL}/community`);
  return res.json();
};

export const createPost = async (postData: object) => {
  const res = await fetch(`${BASE_URL}/community`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(postData)
  });
  return res.json();
};

export const likePost = async (id: number) => {
  const res = await fetch(`${BASE_URL}/community/${id}/like`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
};