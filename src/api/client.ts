import axios from "axios";

// Bas-URL – byt om din backend kör på annan port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // viktigt för session-cookie
  headers: { "Content-Type": "application/json" }
});

// Hjälpare
export async function get<T>(url: string) {
  const res = await api.get<T>(url);
  return res.data;
}
export async function post<TReq, TRes>(url: string, data: TReq) {
  const res = await api.post<TRes>(url, data);
  return res.data;
}
export async function put<TReq, TRes>(url: string, data: TReq) {
  const res = await api.put<TRes>(url, data);
  return res.data;
}
export async function del<TRes>(url: string) {
  const res = await api.delete<TRes>(url);
  return res.data;
}
