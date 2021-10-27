import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.baseURL = 'http://api.crmviagens.com/api/v1';
// axios.defaults.baseURL = 'http://localhost:5000/api/v1';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
toast.configure({ limit: 1 });

export const login = (payload, router) => async dispatch => {
  try {
    const { data } = await axios.post('/auth/login/agency', payload, {
      withCredentials: true
    });
    if (data) {
      dispatch({ type: SESSION_LOGIN, payload: data.user });
      localStorage.setItem('token', data.token);
      router.history.push('/');
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};

export const logout = history => async dispatch => {
  try {
    const { data } = await axios.get('/auth/logout', { withCredentials: true });
    if (data) {
      dispatch({ type: SESSION_LOGOUT, payload: data.data });
      localStorage.removeItem('token');
      history.push('/auth/login');
    }
  } catch (error) {
    toast.error(error.response.data.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};
