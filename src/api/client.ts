const API_BASE_URL = "/api"; 

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE_URL + url, {
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

export async function post<TReq, TRes>(url: string, data: TReq): Promise<TRes> {
  return request<TRes>(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function put<TReq, TRes>(url: string, data: TReq): Promise<TRes> {
  return request<TRes>(url, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function del<TRes>(url: string): Promise<TRes> {
  return request<TRes>(url, {
    method: "DELETE",
  });
}
