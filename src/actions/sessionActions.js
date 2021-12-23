import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const SESSION_LOGIN = 'SESSION_LOGIN';
export const SESSION_LOGOUT = 'SESSION_LOGOUT';
toast.configure({ limit: 1 });

// signup action
export const signup = async (payload, history) => {
  try {
    // destructuring data from backend response
    const { data } = await axios.post('/auth/register/agency', payload);
    if (data) {
      // Success message if data exist
      toast.success(data.data, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 2000,
        pauseOnHover: false
      });
      if (data.subscription.type === 'Beginner') {
        // redirecting to login
        history.push('/');
      } else {
        let body = {
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: data.subscription.type
                },
                unit_amount: parseInt(data.subscription.price) * 100
              },
              quantity: 1
            }
          ],
          metaData: {
            agency: data.agency._id
          }
        };

        let res = await checkout(body);
        window.location = res.data.url;
      }
    }
  } catch (error) {
    // error message
    toast.error(error?.response?.data?.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};

// login action
export const login = (payload, router) => async dispatch => {
  try {
    const { data } = await axios.post('/auth/login/agency', payload, {
      withCredentials: true
    });
    if (data) {
      localStorage.setItem('token', data.token);
      dispatch({ type: SESSION_LOGIN, payload: data.user });
      axios.defaults.headers = {
        Authorization: `Bearer ${data.token}`
      };
      router.history.push('/');
    }
  } catch (error) {
    toast.error(error?.response?.data?.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};

// logout action
export const logout = history => async dispatch => {
  try {
    const { data } = await axios.get('/auth/logout', { withCredentials: true });
    if (data) {
      localStorage.removeItem('token');
      dispatch({ type: SESSION_LOGOUT, payload: data.data });
      history.push('/auth/login');
    }
  } catch (error) {
    toast.error(error?.response?.data?.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};

// checkout action
export const checkout = async payload => {
  try {
    return axios.post('/auth/checkout', payload, {
      withCredentials: true
    });
  } catch (error) {
    toast.error(error?.response?.data?.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};

// get current user
export const getUser = () => {
  return axios.get('/auth/profile', {
    withCredentials: true
  });
};

// get current user
export const updateProfile = (id, payload) => {
  return axios.put(`/auth/updateAgencyProfile/${id}`, payload, {
    withCredentials: true
  });
};

// change password
export const changePassword = payload => {
  return axios.put(`/auth/updatepassword`, payload, {
    withCredentials: true
  });
};
