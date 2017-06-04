import 'Style/components/login.scss'

import React, { Component } from 'react/dist/react'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secondaryClass: ''
    }

    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      this.setState({
        secondaryClass: 'loaded'
      })
    })
  }

  handleLogin(event) {
    // TODO: configure redux ann get a real http request handler
    let httpRequest = new XMLHttpRequest()
    let form = document.forms[0]
    event.preventDefault()

    // Uses absolute path because static resources are loaded from a sub dir
    httpRequest.open('POST', `http://localhost:24601/user/login?user=${form.user.value}&password=${form.password.value}`, true)
    httpRequest.send()
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          this.setState({
            secondaryClass: 'logged-in'
          })
        } else {
          this.setState({
            secondaryClass: 'loaded error'
          })
        }
      }
    }
  }

  render() {
    return (
      <div className={`login ${this.state.secondaryClass}`}>
        <form onSubmit={this.handleLogin}>
          <input type='text' name='user' autoComplete='off' placeholder='User Name' />
          <input type='password' name='password' placeholder='Password' />
          <button type='submit'>Login</button>
          <div className='error'>The credentials provided are invalid.</div>
        </form>
      </div>
    )
  }
}

export default Login
