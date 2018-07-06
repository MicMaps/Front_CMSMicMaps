import React, { Component } from 'react';
import Axios from 'axios';
import Header from './header';
import { CONFIGURATION } from '../utils/configuration';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

export default class UserPush extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pushMessage: '',
            dataType: 'general',
            target: 'all',
            pushLocation: '',
            pushUsers: [],
            pushMic: null,
            statusMessage:''
        };
        this.handlePushMessageChange = this.handlePushMessageChange.bind(this)
        this.resetState = this.resetState.bind(this);
        this.sendPush = this.sendPush.bind(this);
    }

    getUsers(searchTerm) {
        var auth = {
            method: 'GET',
            url: CONFIGURATION.API_ROOT + '/users',
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            },
            params: {
                limit: 0,
                skip: 0,
                sortOrder: 'Ascending',
                sort: 'name',
                search: searchTerm
            }
        };
        return Axios(auth)
            .then((result) => {
                return result.data.data
            })
    }

    getMics(searchTerm) {
        var auth = {
            method: 'GET',
            url: CONFIGURATION.API_ROOT + '/mics',
            headers: {
                'Authorization': window.sessionStorage.getItem('token')
            },
            params: {
                limit: 0,
                skip: 0,
                sortOrder: 'Ascending',
                sort: 'name',
                search: searchTerm
            }
        };
        return Axios(auth)
            .then((result) => {
                return result.data.data
            })
    }

    handleLocationChange = pushLocation => {
        this.setState({ pushLocation });
    }

    handleLocationSelect = pushLocation => {
        geocodeByAddress(pushLocation)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({pushLocationLatLng:latLng}))
            .catch(error => console.error('Error', error));
        this.setState({ pushLocation });
    }

    handlePushMessageChange(ev) {
        if (ev.target.value.length <= 100) {
            this.setState({ pushMessage: ev.target.value })
        }
    }

    sendPush() {
        const payload = {
            pushMessage: this.state.pushMessage,
            dataType: this.state.dataType,
            target: this.state.target,
            pushMic: this.state.pushMic?this.state.pushMic._id:undefined,
            pushUsers: this.state.pushUsers.map((user, index) => {
                return user._id
            }),
            pushLocation:this.state.pushLocationLatLng
        }
        console.log(payload)
        this.setState({statusMessage:'Sending...'})
        let auth = {
            method: 'POST',
            url: CONFIGURATION.API_ROOT + '/mics/push',
            headers: {
                'Authorization' : window.sessionStorage.getItem('token')
            },
            data: payload
        };
        return Axios(auth).then((res) => {
            console.log(res)
            if(res.status == 200) {
                this.setState({statusMessage:'Message sent!'})
                this.resetState();
            }
          }).catch((err) => {
            console.log(err.response)
            this.setState({statusMessage:'Some error occured! Please try again.'})
        });
    }
    resetState() {
        this.setState({
            pushMessage: '',
            dataType: 'general',
            target: 'all',
            pushLocation: '',
            pushUsers: [],
            pushMic: null
        });
    }

    render() {
        const pushUsers = this.state.pushUsers;
        const pushMic = this.state.pushMic;
        return (
            <div>
                <Header />
                <div className='user-push-container'>
                    <div className='container'>
                        <h2 className="heading text-center">Send Push Notifications</h2>
                        <div className="form-group row">
                            <label htmlFor="pushType" className="col-sm-12 col-md-2  col-form-label">Type</label>
                            <div className="col-sm-12 col-md-10 ">
                                <select className="custom-select" id='pushType' value={this.state.dataType} onChange={(ev) => this.setState({ dataType: ev.target.value })} >
                                    <option value='general'>General</option>
                                    <option value="mic">Mic</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="targetType" className="col-sm-12 col-md-2  col-form-label">Target</label>
                            <div className="col-sm-12 col-md-10 ">
                                <select className="custom-select" id='targetType' value={this.state.target} onChange={(ev) => this.setState({ target: ev.target.value })}>
                                    <option value='all'>All Users</option>
                                    <option value="specific">Some Users</option>
                                    <option value="location">Location Based</option>
                                </select>
                            </div>

                        </div>
                        {this.state.target === 'specific' ?
                            <div className="form-group row">
                                <label htmlFor="users" className="col-sm-12 col-md-2  col-form-label">Users</label>
                                <div className="col-sm-12 col-md-10 ">
                                    <AsyncSelect
                                        isMulti
                                        cacheOptions
                                        loadOptions={this.getUsers}
                                        defaultOptions
                                        name="users"
                                        id="users"
                                        onChange={(pushUsers) => { this.setState({ pushUsers: pushUsers }) }}
                                        placeholder="Select Users"
                                        getOptionLabel={(option) => `${option.name ? option.name.first ? option.name.last ? (option.name.first + ' ' + option.name.last) : option.name.first : '' : ''}  ${option.email ? option.email : ''}  ${option.phone ? option.phone : ''}`}
                                        getOptionValue={(option) => option._id}
                                    />
                                </div>
                            </div>
                            : null}
                        {this.state.dataType === 'mic' ?
                            <div className="form-group row">
                                <label htmlFor="mics" className="col-sm-12 col-md-2  col-form-label">Mic</label>
                                <div className="col-sm-12 col-md-10 ">
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={this.getMics}
                                        defaultOptions
                                        name="mics"
                                        id="mics"
                                        onChange={(pushMic) => { this.setState({ pushMic: pushMic }) }}
                                        placeholder="Select Mic you intend to send the push for."
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option._id}
                                    />
                                </div>
                            </div>
                            : null}
                        {this.state.target === 'location' ?
                        <div className="form-group row">
                            <label htmlFor="location" className="col-sm-12 col-md-2  col-form-label">Location</label>
                            <div className="col-sm-12 col-md-10 ">
                                <PlacesAutocomplete
                                    value={this.state.pushLocation}
                                    onChange={this.handleLocationChange}
                                    onSelect={this.handleLocationSelect}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div>
                                            <input
                                                {...getInputProps({
                                                    placeholder: 'Search for a place.',
                                                    className: 'location-search-input',
                                                })}
                                            />
                                            <div className="autocomplete-dropdown-container">
                                                {loading && <div>Loading...</div>}
                                                {suggestions.map(suggestion => {
                                                    const className = suggestion.active
                                                        ? 'suggestion-item--active'
                                                        : 'suggestion-item';
                                                    // inline style for demonstration purpose
                                                    const style = suggestion.active
                                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                    return (
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {
                                                                className,
                                                                style,
                                                            })}
                                                        >
                                                            <span>{suggestion.description}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </PlacesAutocomplete>
                                <small className="form-text text-muted">
                                    Your message will be sent to all users within 100 miles of the selected place.
                                </small>
                            </div>
                        </div>
                         : null}
                        <div className="form-group row">
                            <label htmlFor="pushMessage" className="col-sm-12 col-md-2  col-form-label">Message <br />(Max 100 characters)</label>
                            <div className="col-sm-12 col-md-10 ">
                                <textarea className="form-control" id="pushMessage" rows="3" value={this.state.pushMessage} onChange={(event) => { this.handlePushMessageChange(event) }}></textarea>
                                <small id="pushMessage" className="form-text text-muted">
                                    Your message can be a maximum of 100 characters long. You have {(100 - this.state.pushMessage.length)} characters remaining.
                                </small>
                            </div>

                        </div>
                        <div className="form-group row">

                            <div className="col-sm-12 offset-md-2 col-md-10 ">
                                <button className='btn btn-primary' onClick={this.sendPush}>SEND</button>
                                <small id="statusMessage" className="form-text text-muted">
                                    {this.state.statusMessage}
                                </small>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
        )
    }


}