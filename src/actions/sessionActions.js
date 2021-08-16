import axios from 'axios';

// axios.defaults.baseURL = 'http://api.crmviagens.com/api/v1';
axios.defaults.baseURL = 'http://localhost:5000/api/v1';

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';

export const login = payload => async dispatch => {
  try {
    const { data } = await axios.post('/auth/login/agency', payload, {
      withCredentials: true
    });
    dispatch({ type: SESSION_LOGIN, payload: data.user });
  } catch (error) {}
};

export const logout = () => async dispatch => {
  try {
    const { data } = await axios.get('/auth/logout', { withCredentials: true });
    dispatch({ type: SESSION_LOGOUT, payload: data.data });
  } catch (error) {}
};
