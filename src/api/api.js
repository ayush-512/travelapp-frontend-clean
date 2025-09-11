// frontend/src/api/api.js
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Read backendUrl from app.json (expo.extra) if available
const manifestExtra =
  (Constants.expoConfig && Constants.expoConfig.extra) ||
  (Constants.manifest && Constants.manifest.extra) ||
  {};

// ✅ Use backendUrl from app.json > fallback (your IPv4 or ngrok)
const BASE_URL =
  manifestExtra.backendUrl?.trim() !== ''
    ? manifestExtra.backendUrl
    : 'http://10.232.144.51:3000'; // 👈 replace with your IPv4 if needed

// ✅ Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Attach/remove JWT + persist in AsyncStorage
export async function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      console.warn('Error saving token', e);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try {
      await AsyncStorage.removeItem('token');
    } catch (e) {
      console.warn('Error removing token', e);
    }
  }
}

// ✅ Endpoints used by the UI
export const saveTripApi = (tripId) => api.post(`/api/trips/${tripId}/save`);
export const unsaveTripApi = (tripId) => api.delete(`/api/trips/${tripId}/save`);
export const getSavedTripIdsApi = async () => {
  try {
    const res = await api.get('/api/saved-trips');
    return (res.data || []).map((t) => t.id ?? t._id);
  } catch (e) {
    try {
      const res2 = await api.get('/api/mytrips');
      return (res2.data || []).map((t) => t.id ?? t._id);
    } catch (e2) {
      return [];
    }
  }
};
export const getRecommendationsApi = () => api.get('/api/recommendations');

// ✅ Interceptor: auto-remove token if 401
api.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    if (err?.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
      } catch (e) {}
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

// ✅ Log base URL for debugging in Expo logs
console.log('📡 API Base URL:', BASE_URL);
console.log('Auth header now:', api.defaults.headers.common.Authorization);

export default api;
