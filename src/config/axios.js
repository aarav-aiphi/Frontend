import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the baseURL as needed
  withCredentials: true,
});

export default instance;
