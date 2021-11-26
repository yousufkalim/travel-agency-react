import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configureStore } from './store';
const store = configureStore();

ReactDOM.render(
  <StoreProvider store={store}>
    <App />
  </StoreProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
