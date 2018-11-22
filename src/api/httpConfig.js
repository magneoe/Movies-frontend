import axios from 'axios';
export const SESSION_ID = 'JSESSIONID';
/**
 * axios instance
 */
let instance = axios.create({
    baseURL: `/api`
  })

  // request header
  instance.interceptors.request.use((config) => {
    const apiToken = sessionStorage.getItem(SESSION_ID);
    if(apiToken){
      config.headers = { 'Authorization': apiToken }
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  export const http = instance;
