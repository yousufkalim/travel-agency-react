import axios from 'axios';

// Default header
const token = localStorage.getItem('token');
axios.defaults.headers = {
  Authorization: `Bearer ${token}`
};

export * from './sessionActions';
export * from './subscriptionAction';
export * from './customerActions';
export * from './bookingAction';
export * from './dashboard.js';
