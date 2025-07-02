const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
};

// Users API
export const usersAPI = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    return await apiRequest(`/users?${searchParams}`);
  },

  getById: async (id: number) => {
    return await apiRequest(`/users/${id}`);
  },

  update: async (id: number, data: any) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/users/${id}`, { method: 'DELETE' });
  },

  changePassword: async (id: number, currentPassword: string, newPassword: string) => {
    return await apiRequest(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Programs API
export const programsAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; featured?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    return await apiRequest(`/programs?${searchParams}`);
  },

  getById: async (id: number) => {
    return await apiRequest(`/programs/${id}`);
  },

  create: async (data: any) => {
    return await apiRequest('/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return await apiRequest(`/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/programs/${id}`, { method: 'DELETE' });
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; featured?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    return await apiRequest(`/testimonials?${searchParams}`);
  },

  getById: async (id: number) => {
    return await apiRequest(`/testimonials/${id}`);
  },

  create: async (data: any) => {
    return await apiRequest('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return await apiRequest(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/testimonials/${id}`, { method: 'DELETE' });
  },
};

// Events API
export const eventsAPI = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; featured?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    return await apiRequest(`/events?${searchParams}`);
  },

  getById: async (id: number) => {
    return await apiRequest(`/events/${id}`);
  },

  create: async (data: any) => {
    return await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any) => {
    return await apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/events/${id}`, { method: 'DELETE' });
  },

  register: async (id: number, data: { name: string; email: string; phone?: string }) => {
    return await apiRequest(`/events/${id}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Contact API
export const contactAPI = {
  submit: async (data: { name: string; email: string; message: string }) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    return await apiRequest(`/contact?${searchParams}`);
  },

  getById: async (id: number) => {
    return await apiRequest(`/contact/${id}`);
  },

  updateStatus: async (id: number, status: string) => {
    return await apiRequest(`/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: number) => {
    return await apiRequest(`/contact/${id}`, { method: 'DELETE' });
  },

  subscribeNewsletter: async (email: string) => {
    return await apiRequest('/contact/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getNewsletterSubscriptions: async (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return await apiRequest(`/contact/newsletter/subscriptions?${searchParams}`);
  },
};

// Stats API
export const statsAPI = {
  getDashboard: async () => {
    return await apiRequest('/stats/dashboard');
  },

  getPublic: async () => {
    return await apiRequest('/stats/public');
  },

  getActivity: async (limit?: number) => {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());
    
    return await apiRequest(`/stats/activity?${searchParams}`);
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return await apiRequest('/upload/image', {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    });
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    return await apiRequest('/upload/images', {
      method: 'POST',
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: formData,
    });
  },

  deleteFile: async (filename: string) => {
    return await apiRequest(`/upload/${filename}`, { method: 'DELETE' });
  },

  getFiles: async () => {
    return await apiRequest('/upload/files');
  },
};