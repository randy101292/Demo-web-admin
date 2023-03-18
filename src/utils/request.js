import axios from 'axios'
import Cookie from 'js-cookie'
const url = process.env.REACT_APP_LARAVEL_URL;
// Create axios instance

const service = axios.create({
  baseURL: url
});

service.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

// Request intercepter
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Bearer ' + Cookie.get('token');
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response pre-processing
service.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
