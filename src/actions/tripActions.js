import axios from 'axios';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

// get All trip
export const getAgencyTrip = () => {
  return axios.get('/trips/getAll', { withCredentials: true });
};

// get archive trip
export const getArchive = () => {
  return axios.get('/trips/getArchived', { withCredentials: true });
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

// delete trip
export const deleteTrip = payload => {
  return axios.delete(
    '/trips/delete',
    {
      data: { ...payload }
    },
    { withCredentials: true }
  );
};

// trip events
export const tripEvents = () => {
  return axios.get('/trips/tripEvents', { withCredentials: true });
};

// add Agency Bank
export const addAgencyBank = payload => {
  return axios.post('/agency/addbank', payload, { withCredentials: true });
};
