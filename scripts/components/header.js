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
              <li className="nav-item dropdown" >
                <a href="#" className="nav-link dropdown-toggle" id="micsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Mics</a>
                <div className="dropdown-menu" aria-labelledby="micsDropdown">
                  <NavLink to="/List" activeClassName='active' className="nav-link">Mics List</NavLink>
                  <NavLink to="/AddMic" activeClassName='active' className="nav-link">Add Mic</NavLink>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Users</a>
                <div className="dropdown-menu" aria-labelledby="micsDropdown">
                  <NavLink to="/Users" activeClassName='active' className="nav-link">Users List</NavLink>
                  <NavLink to="/push-notifications" activeClassName='active' className="nav-link">Push Notifications</NavLink>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" id="ambassadorsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Ambassadors</a>
                <div className="dropdown-menu" aria-labelledby="ambassadorsDropdown">
                  <NavLink to="/Ambassadors" activeClassName='active' className="nav-link">Ambassadors List</NavLink>
                  <NavLink to="/AddAmbassadors" activeClassName='active' className="nav-link">Add Ambassador</NavLink>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={this.logout}>Logout</Link>
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
