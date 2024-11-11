import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backend-1-sval.onrender.com/api', // Adjust the baseURL as needed
  withCredentials: true,
});

export default instance;
