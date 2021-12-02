import axios from 'axios';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

// stats
export const Statistics = () => {
  return axios.get(`/agency/stats`, {
    withCredentials: true
  });
};

// financial Stats
export const financialStats = () => {
  return axios.get(`/agency/financialStats`, {
    withCredentials: true
  });
};

// earning Segmentation
export const earningSegmentation = () => {
  return axios.get(`/agency/earningSegmentation`, {
    withCredentials: true
  });
};

// latest Bookings
export const latestBookings = () => {
  return axios.get(`/agency/latestBookings`, {
    withCredentials: true
  });
};

// latest Bookings
export const activeCustomers = () => {
  return axios.get(`/agency/activeCustomers`, {
    withCredentials: true
  });
};
