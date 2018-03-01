import React, { Component } from 'react';
import Axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  login() {
    let auth = {
      method: 'POST',
      url: 'http://api.micmaps.com/api/authenticate',
      data: {
        email: this.state.email,
        password: this.state.password
      }
    };

    return Axios(auth).then((res) => {
      if(res.data.message === 'Authenticated!') {
        window.sessionStorage.setItem('token', res.data.data.token);
        this.props.history.push('/List');
      }
    }).catch((err) => {
      alert('Incorrect email/password!');
    });
  }

  render() {
    if(window.sessionStorage.getItem('token') != null)
      this.props.history.push('/List');
      
    return (
      <div>

        <h3 className="text-center heading">Welcome back to the MicMaps Admin Panel</h3>
        <div className="row">
        
          <div className="offset-sm-4 col-md-4">
            <div className="form-login">
              <h4>Login to continue.</h4>
              <input type="text" id="userName" className="form-control input-sm chat-input" placeholder="username" onChange={(ev) => this.setState({email: ev.target.value})} />
              <br />
              <input type="password" id="userPassword" className="form-control input-sm chat-input" placeholder="password" onChange={(ev) => this.setState({password: ev.target.value})} />
              <br />
              <div className="wrapper">
                <span className="group-btn">     
                  <a onClick={this.login.bind(this)} style={{width: '100%'}} href="#" className="btn btn-primary btn-md">Login <i className="fa fa-sign-in"></i></a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}