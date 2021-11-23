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
import { useDispatch } from 'react-redux';

const history = createBrowserHistory();

const authed = false; // <-- You can change this
const authPath = '/login'; // <-- You can change this

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const { data } = await getUser();
      dispatch({ type: 'SESSION_LOGIN', payload: data.user });
    } catch (error) {
      console.log('error: ', error.response.data.error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router history={history}>
          <ScrollReset />
          <GoogleAnalytics />
          <CookiesNotification />
          {renderRoutes(routes, { hello: true })}
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
