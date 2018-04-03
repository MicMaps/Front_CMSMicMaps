import React, {Component} from 'react';
// import Date from 'react-datetime';
import moment from 'moment';
import Axios from 'axios';
import {Debounce} from 'react-throttle';
import onClickOutside from 'react-onclickoutside'

import InfiniteCalendar, {Calendar, defaultMultipleDateInterpolation, withMultipleDates} from 'react-infinite-calendar';

const MultipleDatesCalendar = withMultipleDates(Calendar);
import DatePicker from 'react-date-picker';
import TimeSelector from './timeSelector';
import Header from './header';

let radioButton1 = "btn btn-primary active";
let radioButton2 = "btn btn-primary";
let placeService = null;
let currLocation = {
  latitude: null,
  longitude: null
};
const spinner = (<div className="spinner">
  <div className="rect1"></div>
  <div className="rect2"></div>
  <div className="rect3"></div>
  <div className="rect4"></div>
  <div className="rect5"></div>
</div>);
const spinner2 = (<div className="spinner small">
  <div className="rect1"></div>
  <div className="rect2"></div>
  <div className="rect3"></div>
  <div className="rect4"></div>
  <div className="rect5"></div>
</div>);

class EditMic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: '',
      micLoaded: false,
      hostName: '',
      email: '',
      phoneNumber: '',
      venueName: '',
      displayPhone: '',
      displayEmail: '',
      micName: '',
      days: [],
      daysPicked: 0,
      firstDate: '',
      free: true,
      costType: '',
      costCustom: '',
      cost: '0',
      frequency: '',
      frequencyCount: 0,
      numDays: 1,
      removedDays: [],
      startTime: {
        hour: '',
        minute: '',
        evening: 'PM'
      },
      endTime: {
        hour: '',
        minute: '',
        evening: 'PM'
      },
      submitSuccess: true,
      locationList: [],
      venueAddress: '',
      venueLocation: {
        lat: '',
        lng: ''
      },
      venueCity:'',
      noOfThumbsUp: 0,
      noOfThumbsDown: 0,
      loading: false,
      calendar: false,
      micType: '',
      customMicType: '',
      signupBy: '',
      timeOnStage: '',
      parkingDetails: '',
      otherInfo: '',
      repeatTimes: '',
      repeatFrequency: ''
    }

    this._costHandler = this._costHandler.bind(this);
    this.renderRepeatTimes = this.renderRepeatTimes.bind(this);
    this.repeatFrequencyChangeHandler = this.repeatFrequencyChangeHandler.bind(this);
  }

  handleClickOutside = (ev) => {
    this.setState({calendar: false, locationList: []})
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        currLocation.latitude = res.coords.latitude;
        currLocation.longitude = res.coords.longitude;
      }, (err) => {
        console.log(err);
      });
    }
  }
  _costHandler(costType) {
    console.log(costType);
    if (costType == 'Free') {
      this.setState({free: true, costType, cost: 0})
    } else {
      this.setState({free: false, costType})
    }

  }
  renderRepeatTimes() {
    let maxCount = 0;
    let optionList = [];
    const {repeatFrequency} = this.state;
    if (repeatFrequency == 'monthly') {
      maxCount = 6;
    } else if (repeatFrequency == 'weekly') {
      maxCount = 24;
    }
    for (let i = 1; i <= maxCount; i++) {
      optionList.push(<option value={i} key={i}>{i}</option>)
    }
    return optionList;
  }

  repeatFrequencyChangeHandler(e) {
    if (e.target.value == 'custom') {
      this.setState({showMultiCalander: true});
    }
    this.setState({repeatFrequency: e.target.value, showMultiCalander: false});
  }

  updateStartTime(type, time) {
    console.log(type, time, this.state.startTime);
    if (type === 'hour') {
      this.setState({
        startTime: {
          hour: time,
          minute: this.state.startTime.minute,
          evening: this.state.startTime.evening
        }
      });
    } else if (type === 'minute') {
      this.setState({
        startTime: {
          hour: this.state.startTime.hour,
          minute: time,
          evening: this.state.startTime.evening
        }
      });
    } else if (type === 'evening') {
      this.setState({
        startTime: {
          hour: this.state.startTime.hour,
          minute: this.state.startTime.minute,
          evening: time
        }
      });
    }
  }

  updateEndTime(type, time) {
    if (type === 'hour') {
      this.setState({
        endTime: {
          hour: time,
          minute: this.state.endTime.minute,
          evening: this.state.endTime.evening
        }
      });
    } else if (type === 'minute') {
      this.setState({
        endTime: {
          hour: this.state.endTime.hour,
          minute: time,
          evening: this.state.endTime.evening
        }
      });
    } else if (type === 'evening') {
      this.setState({
        endTime: {
          hour: this.state.endTime.hour,
          minute: this.state.endTime.minute,
          evening: time
        }
      });
    }
  }

  updateCost(option) {
    if (option === 'false'/* && this.state.free == true */) {
      // let tmp = radioButton1;
      // radioButton1 = radioButton2;
      // radioButton2 = tmp;
      // console.log('false');
      this.setState({free: false});
    } else if (option === 'true'/* && this.state.free == false */) {
      // let tmp = radioButton2;
      // radioButton2 = radioButton1;
      // radioButton1 = tmp;
      // console.log('true');
      this.setState({free: true});
    }
  }

  updateLocation(loc) {
    this.setState({loading: true, venueName: loc});
    placeService = new google.maps.places.PlacesService(this.refs.location);
    let locLoad = currLocation.latitude != null && currLocation.longitude != null;

    let req = {
      location: locLoad
        ? new google.maps.LatLng(currLocation.latitude, currLocation.longitude)
        : null,
      radius: locLoad
        ? '500'
        : null,
      query: loc
    };
    // console.log(loc);
    placeService.textSearch(req, (data, status) => {
      this.setState({loading: false, locationList: data});
    });

    // this.setState({venueName: loc});
  }

  setLocation(loc) {
    let venueCity = ''
    placeService.getDetails(loc, (result, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      
      const address_components = result.address_components;
      for (var i = 0, component; component = address_components[i]; i++) {
        if (component.types[0] == 'locality') {
          venueCity = component['long_name'];
        }
      }
      console.log(venueCity)
      this.setState({venueCity:venueCity});
    })
    this.refs.location.value = loc.name;
    let position = {
      lat: loc.geometry.location.lat(),
      lng: loc.geometry.location.lng()
    };
    console.log(loc);
    this.setState({venueAddress: loc.formatted_address, venueLocation: position, locationList: [], venueName: loc.name});
  }

  loadLocationListEntries(locs) {
    return locs.map((loc, idx) => {
      // console.log(loc);
      return (<div key={loc.name + idx} className='locationContainer' onClick={() => this.setLocation(loc)}>
        <div className='locationName'>{loc.name}</div>
        <div className='locationAddress'>{loc.formatted_address}</div>
      </div>);
    })
  }

  loadLocationList() {
    let numLocs = this.state.locationList.length;
    let locs = this.state.locationList;

    return (<div className='location-list'>
      {this.loadLocationListEntries(locs)}
    </div>);
    // this.loadLocationListEntries(locs);
  }

  submitMic() {
    var micParams = {
      // mic: {
      _id: this.state._id,
      name: this.state.micName,
      venueName: this.state.venueName,
      venueAddress: this.state.venueAddress,
      venueCity: this.state.venueCity,
      location: [
        this.state.venueLocation.lng, this.state.venueLocation.lat
      ],
      // location: [10,10],
      startTime: parseInt(moment(`${this.state.startTime.hour}:${this.state.startTime.minute} ${this.state.startTime.evening}`, ['h:mm A']).format('HHmm')),
      endTime: parseInt(moment(`${this.state.endTime.hour}:${this.state.endTime.minute} ${this.state.endTime.evening}`, ['h:mm A']).format('HHmm')),
      // repeatFrequency: this.state.frequency,
      // repeatTimes: this.state.frequencyCount,
      micType: this.state.micType !== 'custom'
        ? this.state.micType
        : this.state.customMicType,
      free: this.state.free,
      cost: this.state.cost,
      costType: this.state.costType,
      costCustom: this.state.costCustom,
      hostName: this.state.hostName,
      hostEmail: this.state.email,
      hostPhone: this.state.phoneNumber,
      noOfThumbsDown: this.state.noOfThumbsDown,
      noOfThumbsUp: this.state.noOfThumbsUp,
      displayEmail: this.state.displayEmail,
      displayPhone: this.state.displayPhone,
      signupBy: this.state.signupBy,
      timeOnStage: this.state.timeOnStage,
      parkingDetails: this.state.parkingDetails,
      otherInfo: this.state.otherInfo,
      repeatFrequency: this.state.repeatFrequency,
      repeatTimes: this.state.repeatTimes
      // }
    };

    // if (this.state.frequency.length > 0 && this.state.daysPicked == 1) {
    //   micParams.repeatFrequency = this.state.frequency;
    //   micParams.repeatTimes = parseInt(this.state.frequencyCount);
    // }

    const {repeatTimes, repeatFrequency, firstDate} = this.state;
    let days = [];
    let formattedFirstday = moment(firstDate).startOf('day').toDate()
    days.push(formattedFirstday);
    switch (repeatFrequency) {
      case 'custom':
        micParams.days = this.state.days.map((day) => {
          return moment(day).startOf('day').toDate()
        });
        if(this.state.days.length > 12){
          return alert("You cant not select more than 12 days in custom frequency.");
        }
        break;
      case 'weekly':
        for (let i = 1; i < repeatTimes; i++) {
          let dayToPush = moment(formattedFirstday).add(i, 'w');
          days.push(moment(dayToPush).startOf('day').toDate());
        }
        micParams.days = days;
        break;
      case 'monthly':
        for (let i = 1; i < repeatTimes; i++) {
          let dayToPush = moment(formattedFirstday).add(i, 'M');
          days.push(moment(dayToPush).startOf('day').toDate());
        }
        micParams.days = days;
        break;
    }
    // if(this.state.repeatFrequency == 'custom'){
    //   micParams.days = this.state.days
    // }else if(this.state.repa){
    //
    // }

    var auth = {
      method: 'PUT',
      url: `http://localhost/api/mic/${this.state._id}`,
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      },
      data: micParams
    };

    // console.log(JSON.stringify(micParams));
    // console.log(micParams);
    // console.log(this.state);

    if (this.state.hostName.length > 0 && this.state.email.length > 0 && this.state.phoneNumber.length > 0 && this.state.venueName.length > 0 && this.state.micName.length > 0 && micParams.days.length > 0 && (this.state.free || (!this.state.free && this.state.cost !== '0'))
    /*&& (
        this.state.frequency === 'custom' || (this.state.frequency !== 'custom' && this.state.frequencyCount != null)
      )*/
    ) {
      return Axios(auth).then((res) => {
        this.props.history.push('/List');
      }).catch((err) => {
        console.log(err);
      });
    } else {
      this.setState({submitSuccess: false});
    }
  }

  setDays(day) {
    let formattedDay = moment(day).format("YYYY-MM-DD");
    const daysCount = this.state.days.length;
    let index = this.state.days.findIndex((day, idx) => {
      return moment(day).format('YYYY-MM-DD') === formattedDay
    })
    // console.log(index);
    if (index == -1) {
      if (daysCount == 12) {
        alert("Sorry you cant add more dates to custom frequency.");
      } else {
        this.setState({
          days: this.state.days.concat([formattedDay]).sort()
        });
      }
    } else {
      this.setState({
        days: this.state.days.slice(0, index).concat(this.state.days.slice(index + 1)).sort()
      });
    }

  }

  toggleCalendar() {
    if (this.state.calendar == false)
      this.setState({calendar: true});
    else
      this.setState({calendar: false});
    }
  formatMilitaryTime(time) {
    var formattedTime = '';
    formattedTime = `12:${time == 0
      ? '00'
      : time}:AM`;
    return formattedTime
  }

  loadMic(id) {
    let auth = {
      method: 'GET',
      url: `http://localhost/api/mic/${id}`,
      headers: {
        'Authorization': window.sessionStorage.getItem('token')
      }
    };

    return Axios(auth).then((res) => {
      let tmp = res.data.data;
      let micTypeNotCustom = (tmp.micType === 'Lotto' || tmp.micType === 'Sign Up' || tmp.micType === 'Booked');
      let startTime = (tmp.startTime < 100 && tmp.startTime >= 0)
        ? this.formatMilitaryTime(tmp.startTime)
        : moment(tmp.startTime, 'Hmm').format('hh:mm:A');
      let endTime = (tmp.endTime < 100 && tmp.endTime >= 0)
        ? this.formatMilitaryTime(tmp.endTime)
        : moment(tmp.endTime, 'Hmm').format('hh:mm:A');
      console.log(tmp);
      console.log(startTime);
      console.log(endTime);

      this.setState({
        _id: tmp._id, micLoaded: true,
        // firstName: tmp.hostName.split(' ')[0],
        // lastName: tmp.hostName.split(' ')[1],
        hostName: tmp.hostName,
        email: tmp.hostEmail,
        phoneNumber: tmp.hostPhone,
        displayPhone: tmp.displayPhone,
        displayEmail: tmp.displayEmail,
        venueName: tmp.venueName,
        micName: tmp.name,
        days: tmp.days,
        firstDate: tmp.repeatFrequency != 'custom'
          ? tmp.days[0]
          : '',
        daysPicked: tmp.repeatFrequency && tmp.repeatFrequency.length > 0
          ? 1
          : 0,
        free: tmp.free,
        cost: tmp.cost
          ? tmp.cost
          : 0,
        costType: tmp.costType
          ? tmp.costType
          : '',
        costCustom: tmp.costCustom
          ? tmp.costCustom
          : '',
        frequency: tmp.repeatFrequency && tmp.repeatFrequency.length > 0
          ? tmp.repeatFrequency
          : '',
        repeatFrequency: tmp.repeatFrequency,
        frequencyCount: tmp.repeatTimes && tmp.repeatTimes != 0
          ? tmp.repeatTimes
          : 0,
        repeatTimes: tmp.repeatTimes,
        startTime: {
          hour: parseInt(startTime.split(':')[0]).toString(),
          minute: startTime.split(':')[1],
          evening: startTime.split(':')[2]
        },
        endTime: {
          hour: parseInt(endTime.split(':')[0]).toString(),
          minute: endTime.split(':')[1],
          evening: endTime.split(':')[2]
        },
        submitSuccess: true,
        locationList: [],
        venueAddress: tmp.venueAddress,
        venueLocation: {
          lat: tmp.location[1],
          lng: tmp.location[0]
        },
        venueCity:tmp.venueCity?tmp.venueCity:'',
        noOfThumbsDown: tmp.noOfThumbsDown,
        noOfThumbsUp: tmp.noOfThumbsUp,
        micType: (tmp.micType != 'signup' && tmp.micType != 'lotto' && tmp.micType != 'booked')
          ? 'custom'
          : tmp.micType,
        customMicType: (tmp.micType != 'signup' || tmp.micType != 'lotto' || tmp.micType != 'booked')
          ? tmp.micType
          : '',
        signupBy: tmp.signupBy
          ? tmp.signupBy
          : '',
        timeOnStage: tmp.timeOnStage
          ? tmp.timeOnStage
          : '',
        parkingDetails: tmp.parkingDetails
          ? tmp.parkingDetails
          : '',
        otherInfo: tmp.otherInfo
          ? tmp.otherInfo
          : ''
      });
    }).catch((err) => {
      console.log(err);
    });

  }

  render() {
    if (!this.state.micLoaded) {
      this.loadMic(this.props.location.pathname.split('/')[2]);
      return spinner;

    } else {

      return (<div>
        <Header title='Edit Mic'/>

        <div className='container'>
          {/* <img src='./imgs/mic-896673_1280.png' className='micImg' /> */}
          <div className='center-div'>
            <h1 className="heading text-center">Edit Mic</h1>
          </div>

          <div className='form-container' >
            <form>
              <label>*Host Full Name:</label>
              <input className='form-control' value={this.state.hostName} onChange={(ev) => this.setState({hostName: ev.target.value})}></input>

              {/*<label>*Last Name:</label>
                <input className='form-control' value={this.state.lastName} onChange={(ev) => this.setState({lastName: ev.target.value})}></input>*/
              }

              <label>*Email:</label>
              <input className='form-control' value={this.state.email} onChange={(ev) => this.setState({email: ev.target.value})}></input>

              <label>*Phone Number:</label>
              <input className='form-control' value={this.state.phoneNumber} onChange={(ev) => this.setState({phoneNumber: ev.target.value})}></input>

              <label>*Display Phone</label>
              <input type="checkbox" className='form-control' checked={this.state.displayPhone} onChange={(ev) => this.setState({displayPhone: ev.target.checked})}></input>

              <label>*Display Email</label>
              <input type="checkbox" className='form-control' checked={this.state.displayEmail} onChange={(ev) => this.setState({displayEmail: ev.target.checked})}></input>

              <label>*Mic Type:</label>
              <select className='form-control' onChange={(ev) => this.setState({micType: ev.target.value})} value={this.state.micType}>
                <option value='lotto'>Lotto</option>
                <option value='signup'>Sign Up</option>
                <option value='booked'>Booked</option>
                <option value='custom'>Custom</option>
              </select>

              {
                this.state.micType === 'custom'
                  ? <div>
                      <label>Custom Type:</label>
                      <input className='form-control' placeholder='Enter custom mic type' value={this.state.customMicType} onChange={(ev) => this.setState({customMicType: ev.target.value})}></input>
                    </div>
                  : null
              }

              {
                this.state.micType === 'signup'
                  ? <div>
                      <label>Signup By:</label>
                      <input className='form-control' placeholder='Enter SignupBy' value={this.state.signupBy} onChange={(ev) => this.setState({signupBy: ev.target.value})}></input>
                    </div>
                  : null
              }

              <label>*Event Name:</label>
              <input className='form-control' value={this.state.micName} onChange={(ev) => this.setState({micName: ev.target.value})}></input>

              <label>*Venue Name:</label>
              {/* <Debounce time='200' handler='onChange'> */}
              <input className='form-control' value={this.state.venueName} ref='location' onChange={(ev) => {
                  {/* console.log(ev); */
                  }
                  this.updateLocation(ev.target.value)
                }}></input>
              {/* </Debounce> */}

              {/* Load suggested locations */}
              {/* {this.state.locationList.length > 0 ? this.loadLocationList() : null} */}
              {
                this.state.loading
                  ? spinner2
                  : this.state.locationList.length > 0
                    ? this.loadLocationList()
                    : null
              }

              <label>Location</label>
              <input className="form-control" readOnly="readOnly" placeholder="Longitude" value={this.state.venueLocation.lng}/>
              <input className="form-control" readOnly="readOnly" placeholder="Latitude" value={this.state.venueLocation.lat}/>

              <label>Venue Address</label>
              <input className="form-control" readOnly="readOnly" placeholder="Longitude" value={this.state.venueAddress}/>

              <label>Time on Stage (Mins)</label>
              <input className='form-control' min="1" type="number" value={this.state.timeOnStage} onChange={(ev) => this.setState({timeOnStage: ev.target.value})}></input>

              <label>Parking Details</label>
              <input className='form-control' value={this.state.parkingDetails} onChange={(ev) => this.setState({parkingDetails: ev.target.value})}></input>

              <label>Additional Info</label>
              <input className='form-control' value={this.state.otherInfo} onChange={(ev) => this.setState({otherInfo: ev.target.value})}></input>

              {
                this.state.repeatFrequency != 'custom'
                  ? (<div>
                    <label>*Start Date:</label>
                    {/* <input className='form-control' value={this.state.firstDate}/> */}
                    <DatePicker className='date-picker' onChange={(firstDate) => this.setState({firstDate})} value={this.state.firstDate}/>
                  </div>)
                  : (<div>
                    <label>*Custom Dates:</label>
                    <input className='form-control' onClick={() => this.setState({
                        showMultiCalander: !this.state.showMultiCalander
                      })} value={this.state.days.map((day) => {
                        return ` ${moment(day).format('MM/DD/YY')}`
                      })} readOnly="readOnly"/></div>)
              }

              <div>
                <label style={{
                    position: 'relative',
                    float: 'left',
                    marginTop: '10px'
                  }}>Repeat:</label>
                <select className='form-control' value={this.state.repeatFrequency} onChange={this.repeatFrequencyChangeHandler}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {
                this.state.repeatFrequency != 'custom'
                  ? (<div>
                    <label>Number of Repetitions:</label>
                    <select value={this.state.repeatTimes} className="form-control" onChange={(e) => {
                        this.setState({repeatTimes: e.target.value})
                      }}>
                      {this.renderRepeatTimes()}
                    </select>
                  </div>)
                  : null
              }
              {
                this.state.showMultiCalander
                  ? (<div className="multi-calander">
                    <MultipleDatesCalendar onSelect={(ev) => this.setDays(ev)} width={400} height={220} selected={this.state.days} autoFocus={false}/>
                    <button className="btn btn-primary" onClick={() => this.setState({showMultiCalander: false})}>Done</button>
                  </div>)
                  : null
              }

              <label>*Start time:</label>
              <TimeSelector time={this.state.startTime} updateTime={(type, time) => this.updateStartTime(type, time)}/>

              <label>*End time:</label>
              <TimeSelector time={this.state.endTime} updateTime={(type, time) => this.updateEndTime(type, time)}/>

              <label>Cost:</label>
              <div data-toggle="buttons">
                <button className={this.state.costType === 'Free'
                    ? `${radioButton1} check`
                    : `${radioButton2} check`} onClick={() => {
                    this._costHandler('Free')
                  }}>Free</button>
                <button className={this.state.costType === 'Paid'
                    ? `${radioButton1} check`
                    : `${radioButton2} check`} onClick={() => {
                    this._costHandler('Paid')
                  }}>Paid</button>

                <button className={this.state.costType === '1 item minimum'
                    ? `${radioButton1} check`
                    : `${radioButton2} check`} onClick={() => {
                    this._costHandler('1 item minimum')
                  }}>1 item minimum</button>

                <button className={this.state.costType === 'Custom'
                    ? `${radioButton1} check`
                    : `${radioButton2} check`} onClick={() => {
                    this._costHandler('Custom')
                  }}>Custom</button>

              </div>

              {
                this.state.costType == 'Paid' && !this.state.free
                  ? <div style={{
                        marginTop: '10px'
                      }}>
                      <label>Price:</label>
                      <input className='form-control' value={this.state.cost} onChange={(ev) => this.setState({cost: ev.target.value})}></input>
                    </div>
                  : null
              }
              {
                this.state.costType == 'Custom' && !this.state.free
                  ? <div style={{
                        marginTop: '10px'
                      }}>
                      <label>Custom Cost:</label>
                      <input className='form-control' value={this.state.costCustom} onChange={(ev) => this.setState({costCustom: ev.target.value})}></input>
                    </div>
                  : null
              }

              <button className="btn btn-primary btn-lg btn-block" type="button" style={{
                  marginTop: '15px'
                }} onClick={() => this.submitMic()}>
                Submit
              </button>

              <p style={{
                  textAlign: 'center',
                  marginTop: '15px'
                }}>* - required field</p>

              {
                this.state.submitSuccess
                  ? null
                  : <p style={{
                        textAlign: 'center',
                        marginTop: '15px',
                        color: 'red',
                        fontSize: '15px'
                      }}>Please fill in all required fields!</p>
              }
            </form>
          </div>
        </div>
      </div>);
    }
  }
}

export default onClickOutside(EditMic);
