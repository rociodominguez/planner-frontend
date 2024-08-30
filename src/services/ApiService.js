export const API_URL = 'https://planner-backend-puce.vercel.app/api/v1';

const customFetch = async (url, options = {}) => {
    const { method = 'GET', headers = {}, body = null } = options;

    const fetchOptions = {
        method,
        headers,
    };

    if (body) {
        if (method === 'GET' || method === 'HEAD') {
            throw new Error('Request with GET/HEAD method cannot have body');
        }
        fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
    }

    return response.json(); 
};

export { customFetch };
