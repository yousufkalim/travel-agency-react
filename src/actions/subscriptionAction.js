import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// init axios baseURL
axios.defaults.baseURL = process.env.REACT_APP_SERVERURL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

toast.configure({ limit: 1 });
// getting subscription
export const fetchSubscriptions = async () => {
  try {
    // destructuring data from backend response
    const { data } = await axios.get('/auth/subscription/get');
    if (data) {
      return data;
    }
  } catch (error) {
    // error message
    toast.error(error.response.data.error, {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
      pauseOnHover: false
    });
  }
};
