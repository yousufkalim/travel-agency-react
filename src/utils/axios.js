// import axios from 'axios';

// const baseURL = 'http://api.crmviagens.com/api/v1';

// const instance = axios.create({ baseURL });

// instance.defaults.withCredentials = true;
// axios.defaults.headers.post['Content-Type'] = 'application/json';

// export default instance;

import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';
const instance = axios.create({
  //  timeout: 1000,
  // `headers` are custom headers to be sent
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  transformResponse: [res => res]
});

instance.defaults.baseURL = baseURL;
export default instance;
