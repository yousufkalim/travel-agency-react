import axios from 'axios';
// axios.defaults.baseURL = 'http://api.crmviagens.com/api/v1';
axios.defaults.baseURL = 'http://localhost:5000/api/v1';

// Add new customer
export const getAgencyTrip = () => {
  return axios.get('/trips/getAll', { withCredentials: true });
};
