const API_BASE = "http://127.0.0.1:8000";

export async function fetchApps({ q, status, city } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (city) params.set("city", city);

  const res = await fetch(`${API_BASE}/applications?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}

export async function createApp(payload) {
  const res = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create application");
  return res.json();
}

export async function updateApp(id, payload) {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}

export async function deleteApp(id) {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete application");
  return res.json();
}
