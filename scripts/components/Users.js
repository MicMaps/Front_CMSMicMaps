import React, { Component } from 'react';
import Axios from 'axios';
import Header from './header';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import { CONFIGURATION } from '../utils/configuration';

const entriesPerPage = 100;

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            sort: 'name',
            sortType: 'Ascending',
            currentPage: 1,
            loading: true,
            showMore:false,
            totalUsers:0
        };
      }
      toggleSort() {
        this.resetState();
        if(this.state.sortType === 'Ascending')
          this.setState({ sortType: 'Descending',  loading:true });
        else
          this.setState({ sortType: 'Ascending', loading:true });
      }
      componentDidMount() {
        this.getTotalUsers()
      }

      resetState () {
        this.setState({
          entries: [],
          currentPage: 1
        })
      }

      getTotalUsers() {
        var auth = {
            method: 'GET',
            url: CONFIGURATION.API_ROOT + '/users/total',
            headers: {
              'Authorization' : window.sessionStorage.getItem('token')
            }
          };
  
          return Axios(auth)
          .then((res) => {
              console.log(res)
              if(res.status == 200) {
                  const totalUsers = res.data.data
                  this.setState({ totalUsers:totalUsers });
              }
          })
          .catch((err) => {
              console.log(err)
              if(err.response.status == 401) {
                  this.props.history.push('/');
              } else {
                  alert(err.response.data.error || "Some error occurred.")
              }
          })  
      }
      getEntries() {
        var auth = {
          method: 'GET',
          url: CONFIGURATION.API_ROOT + '/users',
          headers: {
            'Authorization' : window.sessionStorage.getItem('token')
          },
          params: {
            limit: entriesPerPage,
            skip: (this.state.currentPage - 1) * entriesPerPage,
            sortOrder: this.state.sortType,
            sort: this.state.sort
          }
        };

        return Axios(auth)
        .then((res) => {
            console.log(res)
            if(res.status == 200) {
                const showMore = res.data.data.length === entriesPerPage
                const entries = this.state.entries.concat(res.data.data)
                this.setState({ showMore:showMore, entries: entries, loading: false });
            }
        })
        .catch((err) => {
            console.log(err)
            if(err.response.status == 401) {
                this.props.history.push('/');
            } else {
                alert(err.response.data.error || "Some error occurred.")
            }
        })
    }
    loadEntries () {
        return this.state.entries.length?
        this.state.entries.map((entry, id) => {
            return  (
                <tr key={id}>
                  <td>
                    {entry.name && entry.name.first?((entry.name.first) + ' ' + (entry.name.last?entry.name.last:'')):''}
                  </td>
                  <td>{entry.email}</td>
                  <td>{entry.phone}</td>
                  <td>{entry.referral?`Referral Code - ${entry.referral.code}`:'N/A'}<br/>
                  {entry.referral?`Ambassador Name - ${entry.referral.name}`:''}</td>
                  <td><Moment format="MMM D, YYYY">{entry.createdAt}</Moment></td>
                  <td><Link to={`/users/${entry._id}`} className="btn btn-primary">Mics</Link></td>
                  
                </tr>
              );
        }):null
    }
    
      render() {
        if(this.state.loading && this.state.totalUsers)
            this.getEntries();

        return (
            <div>
              <Header title='Ambassodors' />
              <div className="ambassadors-list-container">
                <div className="container">
                    <div className='row'>
                        <div className='col-xs-12 col-sm-6 text-left text-xs-center'>
                            <label>Sort by: </label>
                            <select className='form-control sortForm' style={{marginLeft: '15px'}} value = {this.state.sort} onChange={(ev) => {this.resetState(); this.setState({sort: ev.target.value, loading:true})}}>
                                <option className='dropdownItem' value='createdAt'>Latest Added</option>
                                <option className='dropdownItem' value='name.first'>Name</option>
                                <option className='dropdownItem' value = 'email'>Email</option>
                                <option className='dropdownItem' value = 'phone'>Phone</option>
                            </select>

                            <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{position: 'absolute', marginLeft: '5px'}} onClick={() => this.toggleSort()}>
                            </span>
                        </div>
                        <div className='col-xs-12 col-sm-6 text-right text-xs-center'>Total no of users - {this.state.totalUsers}</div>
                    </div>
                    <div>
                        <table className="table table-bordered table-hover">
                        <thead className='thead-light'>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Referral</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody style={{wordWrap: 'break-word'}}>
                            { this.loadEntries() }
                        </tbody>
                        </table>
                    </div>
                </div>
              </div>
                <div className="text-center">
                    {this.state.showMore?
                    <button  className='btn btn-info btn-sm' onClick={() => { this.setState({loading: true, currentPage: (this.state.currentPage + 1)}); }}> Load More </button>
                        : null
                    }
                </div>
            </div>
        )
      }
};