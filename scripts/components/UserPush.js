import React, { Component } from 'react';
import Axios from 'axios';
import Header from './header';
import { CONFIGURATION } from '../utils/configuration';
import Select from 'react-select';
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
            pushLocation: '',
            pushUsers: [],
            pushMic: null
        };
    }

    getUsers() {

    }

    getMics() {

    }

    handleLocationChange = pushLocation => {
        this.setState({ pushLocation });
    }
    
    handleLocationSelect = pushLocation => {
        geocodeByAddress(pushLocation)
          .then(results => getLatLng(results[0]))
          .then(latLng => console.log('Success', latLng))
          .catch(error => console.error('Error', error));
    }

    render() {
        const pushUsers = this.state.pushUsers;
        const pushMic = this.state.pushMic;
        const FLAVOURS = [
            { label: 'Chocolate', value: 'chocolate' },
            { label: 'Vanilla', value: 'vanilla' },
            { label: 'Strawberry', value: 'strawberry' },
            { label: 'Caramel', value: 'caramel' },
            { label: 'Cookies and Cream', value: 'cookiescream' },
            { label: 'Peppermint', value: 'peppermint' },
        ];
        return (
            <div>
                <Header />
                <div className='user-push-container'>
                    <div className='container'>
                        <h2 className="heading text-center">Send Push Notifications</h2>
                        <div className="form-group row">
                            <label htmlFor="pushType" className="col-sm-12 col-md-2  col-form-label">Type</label>
                            <div className="col-sm-12 col-md-10 ">
                                <select className="custom-select" id='pushType'>
                                    <option value='general'>General</option>
                                    <option value="mic">Mic</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="targetType" className="col-sm-12 col-md-2  col-form-label">Target</label>
                            <div className="col-sm-12 col-md-10 ">
                                <select className="custom-select" id='targetType'>
                                    <option value='all'>All Users</option>
                                    <option value="specific">Some Users</option>
                                    <option value="location">Location Based</option>
                                </select>
                            </div>

                        </div>
                        <div className="form-group row">
                            <label htmlFor="users" className="col-sm-12 col-md-2  col-form-label">Users</label>
                            <div className="col-sm-12 col-md-10 ">
                                <Select

                                    isMulti={true}
                                    name="users"
                                    id="users"
                                    value={pushUsers}
                                    onChange={(pushUsers) => { console.log(pushUsers); this.setState({ pushUsers: pushUsers }) }}
                                    options={FLAVOURS}
                                    placeholder="Select Users"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="mic" className="col-sm-12 col-md-2  col-form-label">Mic</label>
                            <div className="col-sm-12 col-md-10 ">
                                <Select
                                    name="mic"
                                    id="mic"
                                    value={pushMic}
                                    onChange={(pushMic) => { this.setState({ pushMic: pushMic }) }}
                                    options={[
                                        { value: 'one', label: 'One' },
                                        { value: 'two', label: 'Two' },
                                    ]}
                                    placeholder="Select a Mic for which you intend to send the push."
                                />
                            </div>
                        </div>
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
                        <div className="form-group row">
                            <label htmlFor="pushMessage" className="col-sm-12 col-md-2  col-form-label">Message <br />(Max 100 characters)</label>
                            <div className="col-sm-12 col-md-10 ">
                                <textarea className="form-control" id="pushMessage" rows="3"></textarea>
                                <small id="pushMessage" className="form-text text-muted">
                                    Your message can be a maximum of 100 characters long. You have __ characters remaining.
                                </small>
                            </div>

                        </div>
                        <div className="form-group row">
                            
                            <div className="col-sm-12 offset-md-2 col-md-10 ">
                                <button className='btn btn-primary'>SEND</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }


}