import axios from 'axios';
import { ENV } from '../config/env.js';

// Pre-computed fallback hubs in India for instant offline/dev support
const INDIAN_CITIES_GEO = {
  bhilai: { lat: 21.2121, lng: 81.3629, name: 'Bhilai Hub, Chhattisgarh' },
  raipur: { lat: 21.2514, lng: 81.6296, name: 'Raipur Airport Hub, Chhattisgarh' },
  durg: { lat: 21.1904, lng: 81.2849, name: 'Durg Junction Hub, Chhattisgarh' },
  nagpur: { lat: 21.1458, lng: 79.0882, name: 'Nagpur Central Hub, Maharashtra' },
  indore: { lat: 22.7196, lng: 75.8577, name: 'Indore Vijay Nagar Hub, Madhya Pradesh' },
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai BKC Hub, Maharashtra' },
  pune: { lat: 18.5204, lng: 73.8567, name: 'Pune Viman Nagar Hub, Maharashtra' },
  delhi: { lat: 28.6139, lng: 77.2090, name: 'New Delhi Connaught Place Hub' },
  bengaluru: { lat: 12.9716, lng: 77.5946, name: 'Bengaluru Indiranagar Hub, Karnataka' },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad Hitec City Hub, Telangana' },
  goa: { lat: 15.2993, lng: 74.1240, name: 'Goa Panaji Coastal Hub' }
};

export class MapService {
  /**
   * Search places or autocomplete addresses
   */
  static async searchPlaces(query) {
    if (!query || typeof query !== 'string') return [];
    const cleanQuery = query.trim().toLowerCase();

    // 1. Try Geoapify if API key is provided
    if (ENV.GEOAPIFY_API_KEY) {
      try {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(cleanQuery)}&country=in&apiKey=${ENV.GEOAPIFY_API_KEY}`;
        const response = await axios.get(url, { timeout: 4000 });
        if (response.data?.features) {
          return response.data.features.map((f) => ({
            formatted: f.properties.formatted,
            name: f.properties.name || f.properties.formatted,
            city: f.properties.city || f.properties.state,
            state: f.properties.state,
            country: f.properties.country,
            coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]] // [lng, lat]
          }));
        }
      } catch (err) {
        console.warn(`[MapService] Geoapify searchPlaces fallback: ${err.message}`);
      }
    }

    // 2. OpenStreetMap / Nominatim (Free, No Key Required)
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=in&limit=5`;
      const osmResponse = await axios.get(osmUrl, {
        headers: { 'User-Agent': 'DriveXRentalPlatform/1.0' },
        timeout: 4000
      });

      if (osmResponse.data && osmResponse.data.length > 0) {
        return osmResponse.data.map((item) => ({
          formatted: item.display_name,
          name: item.name || item.display_name.split(',')[0],
          city: item.address?.city || item.address?.state || cleanQuery,
          state: item.address?.state || 'India',
          country: 'India',
          coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
        }));
      }
    } catch (osmErr) {
      console.warn(`[MapService] OSM fallback: ${osmErr.message}`);
    }

    // 3. In-memory local fallback for major Indian hubs
    const matched = Object.keys(INDIAN_CITIES_GEO).filter((c) => c.includes(cleanQuery) || cleanQuery.includes(c));
    return matched.map((key) => {
      const item = INDIAN_CITIES_GEO[key];
      return {
        formatted: item.name,
        name: item.name,
        city: key.charAt(0).toUpperCase() + key.slice(1),
        state: 'India',
        country: 'India',
        coordinates: [item.lng, item.lat]
      };
    });
  }

  /**
   * Geocode an address to [lng, lat]
   */
  static async geocodeAddress(address) {
    const results = await this.searchPlaces(address);
    if (results && results.length > 0) {
      return results[0];
    }
    // Default fallback Bhilai
    return {
      formatted: 'Bhilai, Chhattisgarh, India',
      name: 'Bhilai Central Hub',
      city: 'Bhilai',
      state: 'Chhattisgarh',
      country: 'India',
      coordinates: [81.3629, 21.2121]
    };
  }

  /**
   * Reverse geocode [lat, lng] to human-readable address
   */
  static async reverseGeocode(lat, lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (ENV.GEOAPIFY_API_KEY) {
      try {
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${ENV.GEOAPIFY_API_KEY}`;
        const response = await axios.get(url, { timeout: 4000 });
        if (response.data?.features?.[0]) {
          const prop = response.data.features[0].properties;
          return {
            formatted: prop.formatted,
            city: prop.city || prop.county,
            state: prop.state,
            country: prop.country
          };
        }
      } catch (err) {
        console.warn(`[MapService] Geoapify reverse geocode fallback: ${err.message}`);
      }
    }

    return {
      formatted: `Location at ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
      city: 'DriveX Hub Zone',
      state: 'India',
      country: 'India'
    };
  }

  /**
   * Calculate Driving Route, Distance and Duration between Origin & Destination
   */
  static async getRoute(origin, destination) {
    const originLat = parseFloat(origin.lat);
    const originLng = parseFloat(origin.lng);
    const destLat = parseFloat(destination.lat);
    const destLng = parseFloat(destination.lng);

    // 1. Try OSRM Routing (Free Open Source Routing Machine)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
      const response = await axios.get(osrmUrl, { timeout: 5000 });

      if (response.data?.routes?.[0]) {
        const route = response.data.routes[0];
        return {
          distanceKm: parseFloat((route.distance / 1000).toFixed(2)),
          durationMinutes: Math.round(route.duration / 60),
          geometry: route.geometry
        };
      }
    } catch (err) {
      console.warn(`[MapService] OSRM route fallback: ${err.message}`);
    }

    // 2. Haversine Straight-line Distance Fallback (multiplied by 1.35 for realistic road factor)
    const R = 6371; // Earth radius in km
    const dLat = ((destLat - originLat) * Math.PI) / 180;
    const dLon = ((destLng - originLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDist = R * c;
    const roadDistKm = parseFloat((straightDist * 1.35).toFixed(2));
    const estDurationMins = Math.max(15, Math.round((roadDistKm / 45) * 60)); // Avg 45 km/h city/highway speed

    return {
      distanceKm: roadDistKm,
      durationMinutes: estDurationMins,
      geometry: {
        type: 'LineString',
        coordinates: [
          [originLng, originLat],
          [destLng, destLat]
        ]
      }
    };
  }
}
