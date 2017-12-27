/* global document */
import React from 'react';
import ReactDom from 'react-dom';

import App from './app';

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);

ReactDom.render(<App />, container);
