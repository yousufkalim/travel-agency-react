import axios from 'axios';

// axios.defaults.baseURL = 'http://api.crmviagens.com/api/v1';
axios.defaults.baseURL = 'http://localhost:5000/api/v1';

export const FETCH_ALL_CUSTOMERS = 'FETCH_ALL_CUSTOMERS';

export const fetchAllCustomers = () => async dispatch => {
  try {
    const { data } = await axios.get('/agency/customers', {
      withCredentials: true
    });
    dispatch({ type: FETCH_ALL_CUSTOMERS, payload: data.customer });
  } catch (error) {}
};
