import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

async function fetchAPI(endpoint, { method = 'GET', body = null, params = {} } = {}) {
    const token = localStorage.getItem('authToken');

    let headers = {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined
    };

    let data = undefined;
    if (body) {
        if (body instanceof FormData) {
            data = body;
        } else {
            headers['Content-Type'] = 'application/json';
            data = JSON.stringify(body);
        }
    }

    try {
        const response = await axios({
            method,
            headers,
            url: `${BASE_URL}/${endpoint}`,
            data,
            params
        });

        return response.data;
    } catch (error) {
        console.error("Error en la llamada a la API:", error);
        throw error;
    }
}

export const apiService = {
    create: (endpoint, body) => fetchAPI(endpoint, { method: 'POST', body }),  
    update: (endpoint, id, body) => fetchAPI(`${endpoint}/${id}`, { method: 'PUT', body }),  
    get: (endpoint) => fetchAPI(endpoint, { method: 'GET' }),  
    delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' }),  
};
