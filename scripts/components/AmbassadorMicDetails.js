import React, { Component } from 'react';
import Axios from 'axios';

import Header from './header';
import ListContainer from './MicList/listContainer';

let that = null;
const entriesPerPage = 100;

export default class UserMicDetails extends Component {
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
      showMore:false,
      userName:''
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

  componentDidMount() {
      this.getUser()
      this.getCities(this.state.micFilter)
  }

  getMics(status) {
    var auth = {
      method: 'GET',
      url: `http://staging-api.micmaps.com/api/mics/ambassador/${this.props.match.params.id}`,
      headers: {
        'Authorization' : window.sessionStorage.getItem('token')
      },
      params: {
        status: status,
        limit: entriesPerPage,
        skip: (this.state.currentPage - 1) * entriesPerPage,
        sortOrder: this.state.sortType,
        sortBy: this.state.sort,
        ambassador:this.props.match.params.id
      }
    };
    if(this.state.currentCity != 'all') {
      auth.params['city'] = this.state.currentCity
    }

    return Axios(auth)
  }
  getEntries(status) {
    Axios.all([
      this.getMics(status),
      this.getCities(status),
      this.getUser()
    ])
    .then(Axios.spread((res, res1, res2) => {
      let showMore = false, entries = [], cities = [], ambassadorName = '';

      if(res.status == 200) {
          showMore = res.data.data.length === entriesPerPage
          entries = this.state.entries.concat(res.data.data)
      }
      if(res1.status == 200) {
          cities = res1.data.data
      }

      if(res2.status == 200) {
        ambassadorName = res2.data.data.name
      }
      this.setState({ showMore:showMore, entries: entries, loading: false, cities:cities, ambassadorName: ambassadorName})
    }))
    .catch((err) => {
      if(err && err.response && err.response.status == 401) {
          this.props.history.push('/');
      } else {
          console.log(err)
          alert(err && err.response? err.response.data.error : "Some error occurred.")
      }
    })
  }

  getUser() {
    var auth = {
        method: 'GET',
        url: `http://staging-api.micmaps.com/api/ambassadors/${this.props.match.params.id}`,
        headers: {
          'Authorization' : window.sessionStorage.getItem('token')
        }
      };
  
      return Axios(auth)
  }

  getCities(micFilter) {
    var auth = {
      method: 'GET',
      url: `http://staging-api.micmaps.com/api/mics/ambassador/${this.props.match.params.id}/count`,
      headers: {
        'Authorization' : window.sessionStorage.getItem('token')
      },
      params: {
        filter:micFilter
      }
    };

    return Axios(auth)
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
    const userName = this.state.ambassadorName ?(this.state.ambassadorName):''
    return (
      <div>
        <Header title='Admin Panel' /><div>
        <div className='mics-list-container'>
        <div className='container sortContainer'>
        <h2 className="heading text-center">Ambassador - {userName}'s Mics</h2>
          <div className='row'>
          <div className='col-xs-12 col-sm-4 text-center'>
            <label>Sort by: </label>
            <select className='form-control sortForm' style={{marginLeft: '15px'}} value = {this.state.sort} onChange={(ev) => {this.resetState(); this.setState({sort: ev.target.value, loading:true})}}>
              <option className='dropdownItem' value='days'>Date</option>
              <option className='dropdownItem' value='hostName'>Name</option>
              <option className='dropdownItem' value='venueCity'>City</option>
            </select>

            <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{position: 'absolute', marginLeft: '5px'}} onClick={() => this.toggleSort()}>
            </span>
          </div>

          <div className='col-xs-12 col-sm-4 text-center'>
            <label>Filter mics: </label>
            <select className='form-control sortForm' value = {this.state.micFilter} style={{marginLeft: '15px'}} onChange={(ev) => { this.resetState(); this.setState({micFilter: ev.target.value.toLowerCase(), loading:true}); }}>
              <option className='dropdownItem' value="approved">Approved</option>
              <option className='dropdownItem' value="pending">Pending</option>
              <option className='dropdownItem' value="rejected">Rejected</option>
              <option className='dropdownItem' value="declined">Declined</option>
              <option className='dropdownItem' value="archived">Archived</option>
              <option className='dropdownItem' value="all">All</option>
            </select>
          </div>
          <div className='col-xs-12 col-sm-4 text-center text-center'>
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
      </div>
    
    );
  }
}
