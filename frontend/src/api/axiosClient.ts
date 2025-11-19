import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const client = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

function handleError(e: any) {
  if (e?.response?.data) throw e.response.data;
  throw { error: e.message || "Network error" };
}

export default {
  listRooms: async () => {
    try { const r = await client.get("/rooms"); return r.data; } catch (e) { handleError(e); }
  },
  createRoom: async (payload: any) => {
    try { const r = await client.post("/rooms", payload); return r.data; } catch (e) { handleError(e); }
  },
  seedRooms: async () => {
    try { const r = await client.post("/rooms/seed"); return r.data; } catch (e) { handleError(e); }
  },
  createBooking: async (payload: any) => {
    try { const r = await client.post("/bookings", payload); return r.data; } catch (e) { handleError(e); }
  },
  listBookings: async () => {
    try { const r = await client.get("/bookings"); return r.data; } catch (e) { handleError(e); }
  },
  cancelBooking: async (id: string) => {
    try { const r = await client.post(`/bookings/${id}/cancel`); return r.data; } catch (e) { handleError(e); }
  },
  getAnalytics: async (from?: string, to?: string) => {
    try {
      const q = from && to ? `?from=${from}&to=${to}` : "";
      const r = await client.get(`/analytics${q}`);
      return r.data;
    } catch (e) { handleError(e); }
  }
};
