import React, { Component } from 'react';

import SideBarEntry from './sideBarEntry';

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  openMenu() {
    return (
      <div className='sidemenu navbar pull-left navbar-inverse'>
        <SideBarEntry title='Mic List' toggle={this.toggle.bind(this)} />
        <SideBarEntry title='Add Mic' toggle={this.toggle.bind(this)} />
        <SideBarEntry title='Logout' toggle={this.logout.bind(this)} />
      </div>
    );
  }

  logout() {
    window.sessionStorage.clear();
    // this.props.history.push('/');
  }

  toggle() {
    if(!this.state.open)
      this.setState({open: true});
    else
      this.setState({ open: false });
  }

  goBack() {
    window.history.back();
  }
  
  render() {
    return (
      <div>
        <nav className="navbar sidebar navbar-light bg-faded">
          {/*<div className="container-fluid">*/}
            <div className="text-center">
              <button onClick={this.props.title === 'Admin Panel' ? this.toggle.bind(this) : this.goBack.bind(this)} className="btn navbar-btn pull-left">
                <span className={this.props.title === 'Admin Panel' ? 'fa fa-bars' : 'fa fa-back'}></span>
              </button>
            </div>
          {/*</div>*/}
        </nav>

        {this.state.open ? this.openMenu() : null}
      </div>
    );
  }
}
