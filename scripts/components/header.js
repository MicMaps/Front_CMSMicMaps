import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  logout() {
    window.sessionStorage.clear();
  }

  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-light mm-navbar'>
        <div className='container'>
          <a className="navbar-brand"><img src='/imgs/micmaps-logo-white-copy.png' /></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/List" className="nav-link">Mics</Link>
              </li>
              <li className="nav-item">
                <Link to="/AddMic" className="nav-link">Add Mic</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Users</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Ambassadors</a>
              </li>
              <li className="nav-item">
              <Link to="/" className="nav-link"  onClick={this.logout}>Logout</Link>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    );
  }
}

const styles = {
  text: {
    fontSize: '20px',
    color: '#EEE'
  }
};
