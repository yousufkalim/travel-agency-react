import * as actionTypes from 'actions';

const initState = {
  error: '',
  customers: []
};

const customerReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_ALL_CUSTOMERS':
      return {
        customers: action.payload
      };
    case 'CREATE_CUSTOMER':
      return {
        customers: action.payload
      };
    case 'CREATE_CUSTOMER_ERROR':
      return { ...initState, error: action.payload, customers: [] };
    default:
      return state;
  }
};

export default customerReducer;
