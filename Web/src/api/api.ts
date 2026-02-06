const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...options.headers,
    } as Record<string, string>;

    // Add JWT token if available
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include session cookies
      headers,
    });

    if (!response.ok) {
      // If 401, clear token and redirect to login
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses and plain text
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    // Try to parse as JSON, if it fails return as plain text
    try {
      return JSON.parse(text);
    } catch {
      // Return plain text response as-is (for messages like "Category created")
      return text as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: "POST",
    };

    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const options: RequestInit = {
      method: "PUT",
    };

    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, options);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient(API_BASE_URL);
export default api;
export { API_BASE_URL };
