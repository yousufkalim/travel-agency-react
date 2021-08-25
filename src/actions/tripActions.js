import axios from 'axios';
// axios.defaults.baseURL = 'http://api.crmviagens.com/api/v1';
axios.defaults.baseURL = 'http://localhost:5000/api/v1';

// get All trip
export const getAgencyTrip = () => {
  return axios.get('/trips/getAll', { withCredentials: true });
};
// Add new trip
export const createTrip = payload => {
  return axios.post('/trips/addnew', payload, { withCredentials: true });
};
// getTripById
export const getSingleTrip = id => {
  return axios.get('/trips/get/' + id, { withCredentials: true });
};
// update trip
export const updateTrip = (id, payload) => {
  return axios.put('/trips/update/' + id, payload, { withCredentials: true });
};

// update trip
export const deleteBannerImage = (tripId, payload) => {
  return axios.put(`/trips/banner/delete/${tripId}`, payload, {
    withCredentials: true
  });
};

export const deleteGalleryImage = (tripId, payload) => {
  return axios.put(`/trips/gallery/delete/${tripId}`, payload, {
    withCredentials: true
  });
};
