import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Interceptor para manejar errores globalmente
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

async function fetchAPI(endpoint: string, { 
  method = 'GET', 
  body = null, 
  params = {} 
} = {}) {
  const token = localStorage.getItem('authToken');

  const config = {
    method,
    url: `${BASE_URL}/${endpoint}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
      ...(body && !(body instanceof FormData) && { 'Content-Type': 'application/json' })
    },
    data: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    params
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

export const apiService = {
  create: (endpoint: string, body: any) => fetchAPI(endpoint, { method: 'POST', body }),
  update: (endpoint: string, id: string, body: any) => 
    fetchAPI(`${endpoint}/${id}`, { method: 'PUT', body }),
  update_simple: (endpoint: string, body: any) => 
    fetchAPI(endpoint, { method: 'PUT', body }),
  get: (endpoint: string, params = {}) => fetchAPI(endpoint, { method: 'GET', params }),
  delete: (endpoint: string) => fetchAPI(endpoint, { method: 'DELETE' }),
};

export const fetchShortApi = async (rute: string,data:any) => {

    const result = await axios.put(`${BASE_URL}/${rute}`, data,{
        headers: {
            token: localStorage.getItem('authToken')
        }
    } )
    return result.data

}
