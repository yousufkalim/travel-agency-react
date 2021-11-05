import axios from 'axios';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

export const FETCH_ALL_CUSTOMERS = 'FETCH_ALL_CUSTOMERS';
export const CREATE_CUSTOMER = 'CREATE_CUSTOMER';
export const CREATE_CUSTOMER_ERROR = 'CREATE_CUSTOMER_ERROR';

export const fetchAllCustomers = () => async dispatch => {
  try {
    const { data } = await axios.get('/agency/customers', {
      withCredentials: true
    });
    dispatch({ type: FETCH_ALL_CUSTOMERS, payload: data.customer });
  } catch (error) {}
};

// Add new customer
export const createCustomer = payload => {
  return axios.post('/agency/customer/new', payload, { withCredentials: true });
};

// update customer
export const updateCustomer = (id, payload) => {
  return axios.put(`/agency/customer/${id}`, payload, {
    withCredentials: true
  });
};

// get customer by id
export const fetchCustomer = id => {
  return axios.get(`/agency/customer/${id}`, { withCredentials: true });
};

// delete by customer id
export const deleteCustomer = id => {
  return axios.delete(`/agency/customer/${id}`, { withCredentials: true });
};

// deleteMany by customer
export const deleteManyCustomer = payload => {
  return axios.delete(
    `/customer/deleteMany`,
    {
      data: { ...payload }
    },
    { withCredentials: true }
  );
};
