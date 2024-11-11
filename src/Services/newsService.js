// frontend/src/services/newsService.js
const API_URL ='http://localhost:5000/api/news';

export const fetchNews = async (searchQuery = '', selectedSource = '', page = 1) => {
    const params = new URLSearchParams();

    if (searchQuery) {
        params.append('q', searchQuery);
    }

    if (selectedSource) {
        params.append('sources', selectedSource);
    }

    params.append('page', page);
    params.append('pageSize', 12); // Adjust as needed

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        return await response.json();
    } catch (error) {
        console.error('fetchNews Error:', error.message);
        throw error;
    }
};
