import React, { Component } from 'react';
import Axios from 'axios';

import Header from './components/header';
import ListContainer from './components/MicList/listContainer';
import Pagination from './components/pagination';

let that = null;
const entriesPerPage = 100;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      sort: 'days',
      sortType: 'Ascending',
      currentPage: 1,
      micFilter: 'approved',
      loading: true,
      showMore:false
    };

    that = this;
  }

  resetState () {
    this.setState({
      entries: [],
      currentPage: 1
    })
  }
  getEntries(status) {
    var auth = {
      method: 'GET',
      url: 'http://staging-api.micmaps.com/api/mics',
      headers: {
        'Authorization' : window.sessionStorage.getItem('token')
      },
      params: {
        status: status,
        limit: entriesPerPage,
        skip: (this.state.currentPage - 1) * entriesPerPage,
        sortOrder: this.state.sortType,
        sortBy: this.state.sort
      }
    };

    return Axios(auth)
      .then((res) => {
        if(res.data.message === 'Mics!') {
          const showMore = res.data.data.length === entriesPerPage
          const entries = this.state.entries.concat(res.data.data)
          this.setState({ showMore:showMore, entries: entries, loading: false });
        }
        console.log(res);
      })
      .catch((err) => {
        this.props.history.push('/');
      })
  }

  toggleSort() {
    this.resetState();
    if(this.state.sortType === 'Ascending')
      this.setState({ sortType: 'Descending',  loading:true });
    else
      this.setState({ sortType: 'Ascending', loading:true });
  }

  updatePage(pageNum) {
    this.setState({ currentPage: pageNum, loading:true });
  }

  render() {
    if(window.sessionStorage.getItem('token') == null)
      this.props.history.push('/');

    if(this.state.loading)
      this.getEntries(this.state.micFilter);

    return (
      <div>
        <Header title='Admin Panel' />
        <div className='mics-list-container'>
        <div className='container sortContainer'>
          <div className='row'>
          <div className='col-xs-12 col-sm-6 text-right text-xs-center'>
            <label>Sort by: </label>
            <select className='form-control sortForm' style={{marginLeft: '15px'}} value = {this.state.sort} onChange={(ev) => {this.resetState(); this.setState({sort: ev.target.value, loading:true})}}>
              <option className='dropdownItem' value='days'>Date</option>
              <option className='dropdownItem' value='hostName'>Name</option>
              <option className='dropdownItem' value='venueCity'>City</option>
              <option className='dropdownItem' value = 'hostEmail'>Email</option>
            </select>

            <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{position: 'absolute', marginLeft: '5px'}} onClick={() => this.toggleSort()}>
            </span>
          </div>

          <div className='col-xs-12 col-sm-6 text-left text-xs-center'>
            <label>Filter mics: </label>
            <select className='form-control sortForm' style={{marginLeft: '15px'}} onChange={(ev) => { this.resetState(); this.setState({micFilter: ev.target.value.toLowerCase(), loading:true}); }}>
              <option className='dropdownItem'>Approved</option>
              <option className='dropdownItem'>Pending</option>
              <option className='dropdownItem'>Rejected</option>
              <option className='dropdownItem'>Declined</option>
              <option className='dropdownItem'>Archived</option>
              <option className='dropdownItem'>All</option>
            </select>
          </div>
        </div>
      </div>
        
          <div>
            <div className='listContainer container'>
              <ListContainer entries={this.state.entries} />
              
            </div>
            <div className="text-center">
            {this.state.showMore?
                <button  className='btn btn-info btn-sm' onClick={() => { this.setState({loading: true, currentPage: (this.state.currentPage + 1)}); }}> Load More </button>
                : null
              }
            </div>
  
          </div>
      </div>
      </div>
    );
  }
}
