import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './components/App/App';

// @ts-ignore
declare global {
    // tslint:disable-next-line
    interface Window {
        web3: any;
        ethereum: any;
        Web3Modal: any;
        Box: any;
        box: any;
        space: any;
        [name: string]: any;
    }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
