import React, { Component } from 'react';

import Dropdown from './Dropdown';
import DropdownTrigger from './DropdownTrigger';
import DropdownContent from './DropdownContent';

import Moment from 'moment';

export default class TimeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hour: 'Hour',
      minute: 'Minute',
      evening: 'PM',
      hourActive: false,
      minuteActive: false,
      eveningActive: false
    };
  }

  toggleMinute() {
    if(this.state.minuteActive)
      this.setState({ minuteActive: false });
    else
      this.setState({ minuteActive: true });
  }

  toggleHour() {
    if(this.state.hourActive)
      this.setState({ hourActive: false });
    else
      this.setState({ hourActive: true });
  }

  toggleEvening() {
    if(this.state.eveningActive)
      this.setState({ eveningActive: false });
    else
      this.setState({ eveningActive: true });
  }

  updateHour(hour) {
    this.setState({ hour: hour });
    this.props.updateTime('hour', hour);
  }

  updateMinute(min) {
    this.setState({ minute: min });
    this.props.updateTime('minute', min);
  }

  updateEvening(eve) {
    this.setState({ evening: eve });
    this.props.updateTime('evening', eve);
  }

  render() {
    // console.log(Moment(this.props.time, 'HHmm').format('h'));
    return (
      <div className='timeSelector'>
        <Dropdown active={this.state.hourActive} onClick={() => this.toggleHour()}>
          <DropdownTrigger className='form-control' style={{ textDecoration: 'none' }}>{this.props.time ? this.props.time.hour : this.state.hour}</DropdownTrigger>
          <DropdownContent>
            <p className='timeOption' onClick={() => this.updateHour('1')}>1</p>
            <p className='timeOption' onClick={() => this.updateHour('2')}>2</p>
            <p className='timeOption' onClick={() => this.updateHour('3')}>3</p>
            <p className='timeOption' onClick={() => this.updateHour('4')}>4</p>
            <p className='timeOption' onClick={() => this.updateHour('5')}>5</p>
            <p className='timeOption' onClick={() => this.updateHour('6')}>6</p>
            <p className='timeOption' onClick={() => this.updateHour('7')}>7</p>
            <p className='timeOption' onClick={() => this.updateHour('8')}>8</p>
            <p className='timeOption' onClick={() => this.updateHour('9')}>9</p>
            <p className='timeOption' onClick={() => this.updateHour('10')}>10</p>
            <p className='timeOption' onClick={() => this.updateHour('11')}>11</p>
            <p className='timeOption' onClick={() => this.updateHour('12')}>12</p>
          </DropdownContent>
        </Dropdown>
      
        <Dropdown active={this.state.minuteActive} onClick={() => this.toggleMinute()}>
          <DropdownTrigger className='form-control' style={{ textDecoration: 'none' }}>{this.props.time ? this.props.time.minute : this.state.minute}</DropdownTrigger>
          <DropdownContent>
            <p className='timeOption' onClick={() => this.updateMinute('00')}>00</p>
            <p className='timeOption' onClick={() => this.updateMinute('10')}>10</p>
            <p className='timeOption' onClick={() => this.updateMinute('20')}>20</p>
            <p className='timeOption' onClick={() => this.updateMinute('30')}>30</p>
            <p className='timeOption' onClick={() => this.updateMinute('40')}>40</p>
            <p className='timeOption' onClick={() => this.updateMinute('50')}>50</p>
          </DropdownContent>
        </Dropdown>

        <Dropdown active={this.state.eveningActive} onClick={() => this.toggleEvening()}>
          <DropdownTrigger className='form-control' style={{ textDecoration: 'none' }}>{this.props.time ? this.props.time.evening : this.state.evening}</DropdownTrigger>
          <DropdownContent>
            <p className='timeOption' onClick={() => this.updateEvening('PM')}>PM</p>
            <p className='timeOption' onClick={() => this.updateEvening('AM')}>AM</p>
          </DropdownContent>
        </Dropdown>
      </div>
    );
  }

}
