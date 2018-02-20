import React, { Component } from 'react';
import Axios from 'axios';
import Header from './header';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';

const entriesPerPage = 100;

export default class Ambassadors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            sort: 'name',
            sortType: 'Ascending',
            currentPage: 1,
            loading: true,
            showMore:false
        };
      }
      toggleSort() {
        this.resetState();
        if(this.state.sortType === 'Ascending')
          this.setState({ sortType: 'Descending',  loading:true });
        else
          this.setState({ sortType: 'Ascending', loading:true });
      }

      resetState () {
        this.setState({
          entries: [],
          currentPage: 1
        })
      }

      getEntries() {
        var auth = {
          method: 'GET',
          url: 'http://localhost:3000/api/ambassadors',
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
                        {entry.name}
                    </td>
                    <td>{entry.code}</td>
                    <td>{entry.noOfSignups}</td>
                    <td><Moment format="MMM D, YYYY">{entry.createdAt}</Moment></td>
                    <td><Link to={`/Ambassadors/${entry._id}`} className="btn btn-primary">Mics</Link></td>
                </tr>
              );
        }):null
    }
    
      render() {
        if(this.state.loading)
            this.getEntries();

        return (
            <div>
              <Header title='Ambassodors' />
              <div className="ambassadors-list-container">
                <div className="container">
                    <div className='row'>
                        <div className='col-xs-12 col-sm-6 text-right text-xs-center'>
                            <label>Sort by: </label>
                            <select className='form-control sortForm' style={{marginLeft: '15px'}} value = {this.state.sort} onChange={(ev) => {this.resetState(); this.setState({sort: ev.target.value, loading:true})}}>
                                <option className='dropdownItem' value='createdAt'>Latest Added</option>
                                <option className='dropdownItem' value='name'>Name</option>
                                <option className='dropdownItem' value = 'code'>Code</option>
                            </select>

                            <span className="fa fa-sort fa-2x clickable" aria-hidden="true" style={{position: 'absolute', marginLeft: '5px'}} onClick={() => this.toggleSort()}>
                            </span>
                        </div>
                    </div>
                    <div>
                        <table className="table table-bordered table-hover">
                        <thead className='thead-light'>
                            <tr>
                                <th >Name</th>
                                <th>Code</th>
                                <th>No. of Signups</th>
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