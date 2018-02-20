import React, { Component } from 'react';
import Moment from 'moment';

import ListEntry from './listEntry';

export default class ListContainer extends Component {
  constructor(props) {
    super(props);
  }

  loadEntries() {

    return this.props.entries.length?
    this.props.entries.map((entry, idx) => {
        return <ListEntry key={idx} entry={entry} />
    }):null
    ;
  }
  
  render() {
    return (
      <div>
        <table className="table table-bordered table-hover">
          <thead className='thead-light'>
            <tr>
              <th>Date</th>
              <th>Mic Name</th>
              <th>Venue</th>
              <th>City</th>
              <th>Host Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody style={{wordWrap: 'break-word'}}>
            { this.loadEntries() }
          </tbody>
        </table>
      </div>
    );
  }
}
