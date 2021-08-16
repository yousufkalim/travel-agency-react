import { combineReducers } from 'redux';

import sessionReducer from './sessionReducer';
import customerReducer from './customerReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  customers: customerReducer
});

export default rootReducer;
