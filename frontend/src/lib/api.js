import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const http = axios.create({ baseURL: API, withCredentials: true });

export function apiError(e) {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Algo correu mal. Tente novamente.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || "").filter(Boolean).join(" ");
  return d?.msg || String(d);
}
