import React, { useEffect } from 'react';
import { Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MomentUtils from '@date-io/moment';
import { ThemeProvider } from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { renderRoutes } from 'react-router-config';
// import renderRoutes from './renderRoutes';
import theme from './theme';
import routes from './routes';
import {
  ScrollReset,
  GoogleAnalytics,
  CookiesNotification
} from './components';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/index.scss';
import { getUser } from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPEPK);
const history = createBrowserHistory();

const authed = false; // <-- You can change this
const authPath = '/login'; // <-- You can change this

const App = () => {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector(state => state.session);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const { data } = await getUser();
      dispatch({ type: 'SESSION_LOGIN', payload: data.user });
    } catch (error) {
      console.log('error: ', error?.response);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Router history={history}>
            <ScrollReset />
            <GoogleAnalytics />
            <CookiesNotification />
            {renderRoutes(routes(loggedIn), { hello: true })}
          </Router>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Elements>
  );
};

export default App;
