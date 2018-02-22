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
      currentPage: 1
    })
  }

  componentDidMount() {
      this.getUser()
  }
  getEntries(status) {
    var auth = {
      method: 'GET',
      url: 'http://staging-api/api/mics',
      headers: {
        'Authorization' : window.sessionStorage.getItem('token')
      },
      params: {
        status: status,
        limit: entriesPerPage,
        skip: (this.state.currentPage - 1) * entriesPerPage,
        sortOrder: this.state.sortType,
        sortBy: this.state.sort,
        submittedBy:this.props.match.params.id
      }
    };

    return Axios(auth)
      .then((res) => {
        if(res.status == 200) {
            const showMore = res.data.data.length === entriesPerPage
            const entries = this.state.entries.concat(res.data.data)
            this.setState({ showMore:showMore, entries: entries, loading: false });
        }
        console.log(res);
      })
      
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
        url: `http://staging-api/api/user/${this.props.match.params.id}`,
        headers: {
          'Authorization' : window.sessionStorage.getItem('token')
        }
      };
  
      return Axios(auth)
        .then((res) => {
          if(res.status == 200) {
            console.log(res.data)
            this.setState({ userName: res.data.data.name});
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err)
          //this.props.history.push('/');
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

    if(this.state.loading && this.state.userName) {
      this.getEntries(this.state.micFilter);
    }
    console.log(this.state.userName)
    const userName = this.state.userName ?(this.state.userName.first + ' ' + (this.state.userName.last?this.state.userName.last:'')):''
    return (
      <div>
        <Header title='Admin Panel' />
        { this.state.loading == true
        ?<div className="text-center">Loading... </div>
        :<div>
        <div className='mics-list-container'>
        <div className='container sortContainer'>
        <h2 className="heading text-center">{userName}'s Mics</h2>
          <div className='row'>
          <div className='col-xs-12 col-sm-6 text-right text-xs-center'>
            <label>Sort by: </label>
            <select className='form-control sortForm' style={{marginLeft: '15px'}} value = {this.state.sort} onChange={(ev) => {this.resetState(); this.setState({sort: ev.target.value, loading:true})}}>
              <option className='dropdownItem' value='days'>Date</option>
              <option className='dropdownItem' value='hostName'>Name</option>
              <option className='dropdownItem' value='venueCity'>City</option>
            </select>

            <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{position: 'absolute', marginLeft: '5px'}} onClick={() => this.toggleSort()}>
            </span>
          </div>

          <div className='col-xs-12 col-sm-6 text-left text-xs-center'>
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
      }
      </div>
    
    );
  }
}
