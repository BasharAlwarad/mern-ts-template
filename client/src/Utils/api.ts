import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.MAIN_SERVICE,
  withCredentials: true,
});

export default api;
