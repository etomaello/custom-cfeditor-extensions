/*
 * <license header>
 */

import 'core-js/stable';

window.React = require('react');
import ReactDOM from 'react-dom';

import App from './app';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
