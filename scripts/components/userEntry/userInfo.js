import React, {Component} from 'react';
import Axios from 'axios';
import {Link} from 'react-router-dom';

export default class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state= {};
  }

  changeStatus() {
    if(this.props.status === 'approved') {
      let auth = {
        method: 'PUT',
        url: `http://localhost:3000/api/mic/${this.props.id}`,
        headers: {
          'Authorization' : window.sessionStorage.getItem('token')
        },
        data: {
          status: 'rejected'
        }
      };

      return Axios(auth)
      .then((res) => {
        window.history.back();
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      let auth = {
        method: 'PUT',
        url: `http://localhost:3000/api/mic/${this.props.id}`,
        headers: {
          'Authorization' : window.sessionStorage.getItem('token')
        },
        data: {
          status: 'approved'
        }
      };

      return Axios(auth)
      .then((res) => {
        window.history.back();
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  editMic() {
    console.log(this);
  }

  render() {
    console.log('asfasdf');
    return (
      <div className="profile">
        {/*<div className="colContainer">*/}
          <div className="profile-sidebar">

            <div className="profile-userpic">
              <img src="http://vvcexpl.com/wordpress/wp-content/uploads/2013/09/profile-default-male.png" className="img-responsive" alt="" />
            </div>

            <div className="profile-usertitle">
              <div className="profile-usertitle-name">
                {this.props.name}
              </div>
              <div className="profile-usertitle-job">
                {this.props.status}
              </div>
            </div>

            <div className="profile-userbuttons">
              <Link style={{ marginRight: '10px' }} to={`/Edit/${this.props.id}`}>
                <button type="button" className="btn btn-success btn-sm" onClick={() => this.editMic()}>Edit</button>
              </Link>
              <button style={{ marginLeft: '10px' }}type="button" className="btn btn-danger btn-sm" onClick={() => this.changeStatus()}>{this.props.status === 'approved' ? 'Reject' : 'Approve'}</button>
            </div>
          </div>
        {/*</div>*/}
      </div>
    );
  }
}
