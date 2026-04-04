import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 400) {
      console.error('Bad Request', error.response?.data)
    }

    return Promise.reject(error)
  },
)
