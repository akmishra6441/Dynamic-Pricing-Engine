import axios from 'axios';

// Abstracted API layer for cleaner UI components
const API_URL = 'http://localhost:8000/api';

export const optimizePrice = async (pricingData) => {
    try {
        const response = await axios.post(`${API_URL}/optimize-price`, pricingData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Network error connecting to backend.';
    }
};