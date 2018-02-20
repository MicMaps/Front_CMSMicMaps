import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
                <NavLink to="/List" activeClassName='active' className="nav-link">Mics</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/AddMic" activeClassName='active' className="nav-link">Add Mic</NavLink>
              </li>
              <li className="nav-item">
              <NavLink to="/Users"  activeClassName='active' className="nav-link">Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/Ambassadors" activeClassName='active' className="nav-link">Ambassadors</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/AddAmbassadors" activeClassName='active' className="nav-link">Add Ambassador</NavLink>
              </li>
              <li className="nav-item">
              <Link to="/" className="nav-link"   onClick={this.logout}>Logout</Link>
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
