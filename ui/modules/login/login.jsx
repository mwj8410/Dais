import 'Style/body.scss'

import React from 'react/dist/react'
import { render } from 'react-dom'

import Login from 'Component/login.jsx'
import Backdrop from 'Component/backdrop.jsx'

window.addEventListener('load', () => {
  render(
    <div className='container-fluid'>
      <Backdrop />
      <Login />
    </div>,
    document.querySelector('#main-viewport')
  )
})
