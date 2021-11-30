import axios from 'axios';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

// get all booking
export const getAllBooking = () => {
  return axios.get('/bookings/getAll', {
    withCredentials: true
  });
};

// get all bookings having id of agency
export const getBookingByAgencyId = id => {
  return axios.get(`/bookings/getBookingByAgencyId/${id}`, {
    withCredentials: true
  });
};

// get booking by id
export const getBookingById = id => {
  return axios.get(`/bookings/getById/${id}`, {
    withCredentials: true
  });
};

// delete booking by id
export const deleteBooking = id => {
  return axios.delete(`/bookings/deletebooking/${id}`, {
    withCredentials: true
  });
};

// delete booking by id
export const deleteMultipleBooking = payload => {
  return axios.delete(
    `/bookings/deleteMultiple`,
    {
      data: { ...payload }
    },
    {
      withCredentials: true
    }
  );
};

// update booking status
export const updateStatus = (payload, id) => {
  return axios.put(`/bookings/updateStatus/${id}`, payload, {
    withCredentials: true
  });
};
