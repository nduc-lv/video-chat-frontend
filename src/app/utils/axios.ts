import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3'
});

export default axiosInstance;