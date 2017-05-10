import '../../style/components/login.scss';

import React, { Component } from 'react/dist/react'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secondaryClass: ''
    }
  };

  componentDidMount () {
    window.requestAnimationFrame(() => {
      this.setState({
        secondaryClass: 'loaded'
      });
    });
  };

  render() {

    return (
      <div className={`login ${this.state.secondaryClass}`}>
        <form>
          <input type="text" name="user" autoComplete="off" placeholder="User Name" />
          <input type="password" name="password" placeholder="Password" />
        </form>
      </div>
    );
  }
}

export default Login;
