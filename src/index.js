import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';

window.BACKEND = 'http://linux3.csie.ntu.edu.tw:9090'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
