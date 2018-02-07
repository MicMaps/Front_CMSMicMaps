import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SideBarEntry extends Component {
  constructor(props) {
    super(props);
  }

  logout() {
    window.sessionStorage.clear();
  }
  
  render() {
    let path = this.props.title === 'Mic List' ? '/List' : this.props.title === 'Logout' ? '/' : '/AddMic';

    return (
      <div className='sidebarEntry'>
        <p className='buttonText' onClick={this.props.toggle}>
          <Link to={path} style={{ textDecoration: 'none', color: '#d8d8d8' }}>{this.props.title}</Link>
        </p>
      </div>
    );
  }
}
