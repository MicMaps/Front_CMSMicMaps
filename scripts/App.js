import React, { Component } from 'react';
import Axios from 'axios';

import Header from './components/header';
import ListContainer from './components/MicList/listContainer';
import Pagination from './components/pagination';
import {DebounceInput} from 'react-debounce-input';
import {CONFIGURATION} from './utils/configuration';

let that = null;
const entriesPerPage = 100;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      cities: [],
      currentCity: 'all',
      sort: 'days',
      sortType: 'Ascending',
      currentPage: 1,
      micFilter: 'approved',
      loading: true,
      showMore: false
    };

    that = this;
  }

  resetState() {
    this.setState({
      entries: [],
      currentPage: 1,
      currentCity: 'all'
    })
  }

  getMics(status) {

    var auth = {
      method: 'GET',
      url: CONFIGURATION.API_ROOT + '/mics',
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      },
      params: {
        status: status,
        limit: entriesPerPage,
        skip: (this.state.currentPage - 1) * entriesPerPage,
        sortOrder: this.state.sortType,
        sortBy: this.state.sort
      }
    };
    if (this.state.currentCity != 'all') {
      auth.params['city'] = this.state.currentCity
    }
    if(this.state.searchTerm) {
      auth.params['search'] = this.state.searchTerm
    }

    return Axios(auth)
  }

  getCities(micFilter) {
    var auth = {
      method: 'GET',
      url: CONFIGURATION.API_ROOT + '/mics/cities',
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      },
      params: {
        filter: micFilter,
        search: this.state.searchTerm
      }
    };

    return Axios(auth)
  }

  getEntries(status) {

    Axios.all([
      this.getMics(status),
      this.getCities(status)
    ])
      .then(Axios.spread((res, res1) => {
        // do something with both responses
        let showMore, entries, cities;
        if (res.status == 200) {
          showMore = res.data.data.length === entriesPerPage
          entries = this.state.entries.concat(res.data.data)
        }
        if (res1.status == 200) {
          cities = res1.data.data
        }
        this.setState({ showMore: showMore, entries: entries, cities: cities, loading: false });
      }))
      .catch((err) => {
        //this.props.history.push('/');
      })
  }



  changeCity(city) {
    this.setState({ entries: [], currentPage: 1, currentCity: city, loading: true })
  }

  toggleSort() {
    if (this.state.sortType === 'Ascending')
      this.setState({ entries: [], currentPage: 1, sortType: 'Descending', loading: true });
    else
      this.setState({ entries: [], currentPage: 1, sortType: 'Ascending', loading: true });
  }

  countAllCities() {
    let sum = 0;
    for (var i = 0; i < this.state.cities.length; i++) {
      sum = sum + this.state.cities[i].count
    }
    return sum;
  }

  performSearch() {
    this.setState({ entries:[], currentPage: 1, loading: true })
  }

  clearSearch() {
    this.setState({ entries:[], currentPage: 1, searchTerm:'', loading: true })
  }

  render() {
    if (window.sessionStorage.getItem('token') == null)
      this.props.history.push('/');

    if (this.state.loading) {

      this.getEntries(this.state.micFilter);
    }
    return (
      <div>
        <Header title='Admin Panel' />
        <div className='mics-list-container'>
          <div className='container sortContainer'>
            <div className='row'>
              <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
                <label>Sort by: </label>
                <select className='form-control sortForm' style={{ marginLeft: '15px' }} value={this.state.sort} onChange={(ev) => { this.setState({ entries: [], currentPage: 1, sort: ev.target.value, loading: true }) }}>
                  <option className='dropdownItem' value='days'>Date</option>
                  <option className='dropdownItem' value='name'>Mic Name</option>
                  <option className='dropdownItem' value='venueName'>Mic Venue Name</option>
                  <option className='dropdownItem' value='hostName'>Host Name</option>
                  <option className='dropdownItem' value='venueCity'>City</option>
                  <option className='dropdownItem' value='hostEmail'>Email</option>
                </select>

                <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{ position: 'absolute', marginLeft: '5px' }} onClick={() => this.toggleSort()}>
                </span>
              </div>

              <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
                <label>Filter mics: </label>
                <select className='form-control sortForm' style={{ marginLeft: '15px' }} onChange={(ev) => { this.resetState(); this.setState({ micFilter: ev.target.value.toLowerCase(), loading: true }); }}>
                  <option className='dropdownItem'>Approved</option>
                  <option className='dropdownItem'>Pending</option>
                  <option className='dropdownItem'>Rejected</option>
                  <option className='dropdownItem'>Declined</option>
                  <option className='dropdownItem'>Archived</option>
                  <option className='dropdownItem'>All</option>
                </select>
              </div>
              <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
                <label>Cities: </label>
                <select className='form-control sortForm' style={{ marginLeft: '15px' }} onChange={(ev) => { this.changeCity(ev.target.value) }}  >
                  <option className='dropdownItem' value='all'>All ({this.countAllCities()})</option>
                  {this.state.cities.length ?
                    this.state.cities.map((city, id) => {
                      return (<option className='dropdownItem' key={city._id ? city._id : id} value={city._id ? city._id : ''}>{city._id ? city._id : 'No City'}({city.count})</option>)
                    })
                    : null
                  }
                </select>
              </div>
            </div>
            <div className="row justify-content-center search-container">
              <div className="col-md-8 col">
                <div className="input-group">
                  <DebounceInput 
                    className="form-control" 
                    placeholder="Search Mics" 
                    aria-label="Search Mics" 
                    aria-describedby="Search Mics" 
                    onChange={(e) => {this.setState({searchTerm:e.target.value})}} 
                    minLength={2}
                    debounceTimeout={300}
                    value={this.state.searchTerm}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button" onClick={() => this.performSearch()}>Search</button>
                    <button className="btn btn-danger" type="button" onClick={() => this.clearSearch()}>Reset</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className='listContainer container'>
              <ListContainer entries={this.state.entries} />

            </div>
            <div className="text-center">
              {this.state.showMore ?
                <button className='btn btn-info btn-sm' onClick={() => { this.setState({ loading: true, currentPage: (this.state.currentPage + 1) }); }}> Load More </button>
                : null
              }
            </div>

          </div>
        </div>
      </div>
    );
  }
}
