import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ColorClassApp from './ColorClassApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ColorClassApp />, document.getElementById('root'));
registerServiceWorker();
