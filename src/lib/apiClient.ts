export class APIError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  let data: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data && typeof data === "object" && data.error) ||
      (typeof data === "string" && data) ||
      response.statusText ||
      "API request failed";
    throw new APIError(errorMessage, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get<T>(url: string, options?: Omit<RequestInit, "method">): Promise<T> {
    return request<T>(url, { ...options, method: "GET" });
  },

  post<T>(
    url: string,
    body?: any,
    options?: Omit<RequestInit, "method" | "body">
  ): Promise<T> {
    const config: RequestInit = { ...options, method: "POST" };
    if (body !== undefined) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }
    return request<T>(url, config);
  },

  put<T>(
    url: string,
    body?: any,
    options?: Omit<RequestInit, "method" | "body">
  ): Promise<T> {
    const config: RequestInit = { ...options, method: "PUT" };
    if (body !== undefined) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }
    return request<T>(url, config);
  },

  delete<T>(url: string, options?: Omit<RequestInit, "method">): Promise<T> {
    return request<T>(url, { ...options, method: "DELETE" });
  },
};
