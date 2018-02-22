import React, { Component } from 'react';
import Axios from 'axios';
import moment from 'moment';

import UserInfo from './userEntry/userInfo';
import UserDetails from './userEntry/userDetails';
import Header from './header';
import {Link} from 'react-router-dom';

const spinner = (
  <div className="spinner">
    <div className="rect1"></div>
    <div className="rect2"></div>
    <div className="rect3"></div>
    <div className="rect4"></div>
    <div className="rect5"></div>
  </div>
);

export default class MicEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entry: null
    };
  }

  changeStatus() {
    if(this.state.entry.status === 'approved') {
      let auth = {
        method: 'PUT',
        url: `http://localhost/api/mic/${this.props.match.params.MicId}`,
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
        url: `http://localhost/api/mic/${this.props.match.params.MicId}`,
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

  formatMilitaryTime(time) {
    let formattedTime = '';
    let timeInt = parseInt(time)
    let timeHours = parseInt(timeInt / 100)
    let timeMinutes = parseInt(timeInt % 100)

    timeHours = ('' + timeHours).length == 1 ? ('0' + timeHours) : ('' + timeHours)
    timeMinutes = ('' + timeMinutes).length == 1 ? ('0' + timeMinutes) : ('' + timeMinutes)
    formattedTime = timeHours + ':' + timeMinutes;
    return formattedTime
  }

  getMic() {
    let auth = {
      method: 'GET',
      url: `http://localhost/api/mic/${this.props.match.params.MicId}`,
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      }
    };

    return Axios(auth).then((res) => {
      this.setState({ entry: res.data.data });
    }).catch((err) => {
      console.log(err);
    });
  }

  loadEntry() {
    let { entry } = this.state;

    return (
      <div className='entryContainer' id='info-page'>
        <h2 className="text-center heading">Mic Details</h2>
        <div className="content-container">
          <div className="row top-container">
            <div className="col-sm-6 top-left-container">
              <div className="mic-logo">
                <img src="/imgs/logo-pin2x.png" className="mic-image" />
              </div>
              <div className="title">{entry.name}</div>
              <div className="sub-title">Host</div>
              <div className="sub-title"><strong>{entry.hostName ? entry.hostName : ''}</strong></div>
            </div>
            <div className="col-sm-6 top-right-container">
              <div className="like-count-circle">
                <div className="valign-container">
                  <div className="sub-title">Likes</div>
                  <div className="rating-text success-text">{entry.noOfThumbsUp}</div>
                </div>
              </div>
              <div className="dislike-count-circle">
                <div className="valign-container">
                  <div className="sub-title">Dislikes</div>
                  <div className="rating-text error-text">{entry.noOfThumbsDown}</div>
                </div>
              </div>
              <Link style={{ marginRight: '10px' }} to={`/Edit/${entry._id}`} className="btn btn-success btn-sm">Edit
                </Link>
                <button style={{ marginLeft: '10px' }}type="button" className="btn btn-danger btn-sm" onClick={() => this.changeStatus()}>{entry.status === 'approved' ? 'Reject' : 'Approve'}</button>
              
            </div>
          </div>
          <div className="row bottom-container">
            <div className="col-md-4 col-sm-12 left-container">
              <div className="left-top-container">
                <div className="mic-logo">
                  <img src="/imgs/logo-pin2x.png" className="mic-image" />
                </div>
                <div className="title">{entry.name}</div>
                <div className="sub-title">Host</div>
                <div className="sub-title"><strong>{entry.hostName ? entry.hostName : ''}</strong></div>
              </div>
              <div className="left-bottom-container">
                <div className="like-count-circle">
                  <div className="valign-container">
                    <div className="sub-title">Likes</div>
                    <div className="rating-text success-text">{entry.noOfThumbsUp}</div>
                  </div>
                </div>
                <div className="dislike-count-circle">
                  <div className="valign-container">
                    <div className="sub-title">Dislikes</div>
                    <div className="rating-text error-text">{entry.noOfThumbsDown}</div>
                  </div>
                </div>
                <Link style={{ marginRight: '10px' }} to={`/Edit/${entry._id}`} className="btn btn-success btn-sm">Edit
                </Link>
                <button style={{ marginLeft: '10px' }}type="button" className="btn btn-danger btn-sm" onClick={() => this.changeStatus()}>{entry.status === 'approved' ? 'Reject' : 'Approve'}</button>
              </div>
            </div>
            <div className="col-md-8 col-sm-12 right-container">
              <div className="field-container">
                <div className="label">Venue Name</div>
                <div className="value">{entry.venueName}</div>
              </div>
              <div className="field-container">
                <div className="label">Location</div>
                <div className="value">{entry.venueAddress}</div>
              </div>
              <div className="field-container">
                <div className="label">Event Day(s)</div>
                <div className="value">
                  {entry.days.map((day) => {
                    return ` ${moment(day).format('MM/DD/YY')},`
                  })
                  }
                </div>
              </div>
              <div className="field-container">
                <div className="label">Repeat Frequency</div>
                <div className="value">
                  {entry.repeatFrequency ? entry.repeatFrequency : 'N/A'}
                </div>
              </div>
              <div className="field-container">
                <div className="label">Repeat Times</div>
                <div className="value">
                  {entry.repeatTimes ? entry.repeatTimes : 'N/A'}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <div className="field-container">
                    <div className="label">Start Time</div>
                    <div className="value">
                      {
                        this.formatMilitaryTime(entry.startTime)
                      }
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6">
                  <div className="field-container">
                    <div className="label">End Time</div>
                    <div className="value">
                      {
                        this.formatMilitaryTime(entry.endTime)
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="field-container">
                <div className="label">Mic Type</div>
                <div className="value">{entry.micType ? entry.micType : 'N/A'} </div>
              </div>
              <div className="field-container">
                <div className="label">Time on Stage</div>
                <div className="value">{entry.timeOnStage} minutes</div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <div className="field-container">
                    <div className="label">Contact Email</div>
                    <div className="value">{entry.hostEmail ? entry.hostEmail : 'N/A'}</div>
                  </div>

                </div>
                  <div className="col-md-6 col-sm-6">
                    <div className="field-container">
                      <div className="label">Show Contact Email?</div>
                      <div className="value">{entry.displayEmail ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  <div className="field-container">
                    <div className="label">Contact Phone</div>
                    <div className="value">{entry.hostPhone ? entry.hostPhone : 'N/A'}</div>
                  </div>
                </div>
                  <div className="col-md-6 col-sm-6">
                    <div className="field-container">
                      <div className="label">Show Contact Phone?</div>
                      <div className="value">{entry.displayPhone ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                
              </div>

              <div className="field-container">
                <div className="label">Parking Details</div>
                <div className="value">{entry.parkingDetails ? entry.parkingDetails : 'No parking available'}</div>
              </div>
              <div className="field-container">
                <div className="label">Other Notes</div>
                <div className="value">{entry.otherInfo ? entry.otherInfo : 'N/A'}</div>
              </div>
              <div className="field-container">
                <div className="label">Cost Type</div>
                <div className="value">{entry.costType ? entry.costType : 'N/A'}</div>
              </div>
              {entry.costType == 'Paid' && !entry.free ?
                <div className="field-container">
                  <div className="label">Price</div>
                  <div className="value">{entry.cost ? entry.cost : 'N/A'}</div>
                </div>
                : null
              }
              {entry.costType == 'Custom' && !entry.free ?
                <div className="field-container">
                  <div className="label">Custom Cost Value</div>
                  <div className="value">{entry.costCustom ? entry.costCustom : 'N/A'}</div>
                </div>
                : null
              }
            </div>
          </div>


        </div>
      </div>
    );
  }

  render() {
    if (this.state.entry == null)
      this.getMic();

    return (
      <div>
        <Header title={'User Info'} />

        <div className='container'>
          {/*<div className='entryContainer'>        */}
          {this.state.entry == null
            ? spinner
            : this.loadEntry()}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}
