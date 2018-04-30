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
      cities:[],
      currentCity:'all',
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
      currentPage: 1,
      currentCity:'all'
    })
  }

  getMics(status) {

    var auth = {
      method: 'GET',
      url: 'http://api.micmaps.com/api/mics',
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
    if(this.state.currentCity != 'all') {
      auth.params['city'] = this.state.currentCity
    }

    return Axios(auth)
  }

  getCities(micFilter) {
    var auth = {
      method: 'GET',
      url: 'http://api.micmaps.com/api/mics/cities',
      headers: {
        'Authorization' : window.sessionStorage.getItem('token')
      },
      params: {
        filter:micFilter
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
        if(res.status == 200) {
          showMore = res.data.data.length === entriesPerPage
          entries = this.state.entries.concat(res.data.data)
        }
        console.log(res);
        if(res1.status == 200) {
          cities = res1.data.data
        }
        console.log(res1);
        this.setState({ showMore:showMore, entries: entries, cities:cities, loading: false });
      }))
      .catch((err) => {
        console.log(err)
        //this.props.history.push('/');
      })
    }

  

  changeCity(city) {
    this.resetState()
    this.setState({currentCity:city, loading:true})
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

  countAllCities() {
    let sum = 0;
    for (var i =0; i < this.state.cities.length; i++) {
      sum = sum + this.state.cities[i].count 
    }
    return sum;
  }

  render() {
    if(window.sessionStorage.getItem('token') == null)
      this.props.history.push('/');

    if(this.state.loading) {

      this.getEntries(this.state.micFilter);
    }
    console.log(this.state.cities)
    return (
      <div>
        <Header title='Admin Panel' />
        <div className='mics-list-container'>
        <div className='container sortContainer'>
          <div className='row'>
          <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
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

          <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
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
          <div className='col-xs-12 col-sm-4 text-center text-xs-center'>
            <label>Cities: </label>
            <select className='form-control sortForm' style={{marginLeft: '15px'}} onChange={(ev) => { this.changeCity(ev.target.value) }}  >
            <option className='dropdownItem' value='all'>All ({this.countAllCities()})</option>
            {this.state.cities.length?
              this.state.cities.map((city, id)=> {
                return (<option className='dropdownItem' key={city._id?city._id:id} value={city._id?city._id:''}>{city._id?city._id:'No City'}({city.count})</option>)
              })
              :null
            }
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
