import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://backend-xa3g.onrender.com/api', // Adjust the baseURL as needed
  withCredentials: true,
});

export default instance;
