import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const employerApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

employerApiClient.interceptors.response.use(
  (response: { status: number; }) => {
    // HttpOnly cookies are automatically sent by the browser
    // No need to manually extract and store them
    console.log('Response received:', response.status);
    return response;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export default employerApiClient;
