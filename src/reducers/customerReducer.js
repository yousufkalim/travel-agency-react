import * as actionTypes from 'actions';

const initState = {
  customers: []
};

const customerReducer = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_ALL_CUSTOMERS':
      return {
        customers: action.payload
      };

    default:
      return state;
  }
};

export default customerReducer;
