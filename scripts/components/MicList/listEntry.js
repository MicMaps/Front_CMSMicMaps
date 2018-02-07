import React, { Component } from 'react';
import Moment from 'react-moment';
import Axios from 'axios';
import { Link } from 'react-router-dom';

export default class ListEntry extends Component {
  constructor(props) {
    super(props);
  }

  deleteEntry(entry) {
    let auth = {
      method: 'DELETE',
      url: `http://localhost:3000/api/mic/${entry._id}`,
      headers: {
        authorization: window.sessionStorage.getItem('token')
      }
    };

    Axios(auth)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    // console.log(this.props.entry.micType);
    return (
      <tr>
        <td>
          <Moment format="MMM D, YYYY">{this.props.entry.days[0]}</Moment>
          {this.props.entry.repeatFrequency?
           this.props.entry.repeatFrequency !== 'custom'?
            <div>Repeat Times - {this.props.entry.repeatFrequency}
              <br/> Repeats Until - <Moment format="MMM D, YYYY">{this.props.entry.days[this.props.entry.days.length - 1]}</Moment>
            </div>
            :<div>Repeat Times - {this.props.entry.repeatFrequency}
            <br/> Last Date - <Moment format="MMM D, YYYY">{this.props.entry.days[this.props.entry.days.length - 1]}</Moment>
            </div>
            :null
          }
        </td>
        <td>{this.props.entry.hostName}</td>
        <td>{this.props.entry.venueName}</td>
        <td>{this.props.entry.venueAddress.split(',')[1]}</td>
        <td>{this.props.entry.hostEmail}</td>

        <td className='buttonContainer'>
          <button role='submit' className='btn btn-danger btn-sm deleteMic' onClick={() => this.deleteEntry(this.props.entry)}>
            Delete
          </button>

          <Link to={`/Mic/${this.props.entry._id}`}>
            <button role='button' className='btn btn-info btn-sm deleteMic'>
              View
            </button>
          </Link>
        </td>
      </tr>
    );
  }
}
