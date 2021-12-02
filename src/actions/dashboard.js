import axios from 'axios';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

// stats
export const Statistics = () => {
  return axios.get(`/agency/stats`, {
    withCredentials: true
  });
};
