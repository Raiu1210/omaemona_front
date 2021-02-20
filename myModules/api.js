import axios from 'axios'

const env = process.env.NODE_ENV || 'development';
let baseURL = 'https://omaemona.info:8443'

if(env == 'development') {
  baseURL = 'http://localhost:3333'
}

export const axiosInstance = axios.create({
  baseURL: baseURL
})
