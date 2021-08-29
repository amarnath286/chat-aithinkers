import React from 'react';

import ReactDOM from 'react-dom';

import './index.scss';
import App from './App';
import './App.scss';
// import 'antd/dist/antd.scss';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './ThemeContext';
// import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.unregister();
