import '../style/body.scss';

import React from 'react/dist/react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Redirect, IndexRoute } from 'react-router'

import Login from './components/login.jsx';
import Backdrop from './components/backdrop.jsx';

window.addEventListener('load', () => {
  render(
    <div className="container-fluid">
      <Backdrop />
      <Login />
    </div>,
    document.querySelector('#application-viewport')
  );
});
