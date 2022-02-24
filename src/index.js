import React from 'react';
import ReactDOM from 'react-dom';

import { MoralisProvider } from "react-moralis";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import config from './config';

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
				appId={ config.moralis_app_id }
				serverUrl={ config.moralis_server_url }
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
