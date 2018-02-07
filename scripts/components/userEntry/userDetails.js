import React, {Component} from 'react';
import Moment from 'moment';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state={};
  }
  formatMilitaryTime(time){
    var formattedTime = '';
    formattedTime = `12:${time == 0 ? '00' : time}:AM`;
    return formattedTime
  }

  render() {
    console.log(this.props.data);
    return(
      <div className='detailsContainer'>
        <div className='itemLeft'>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-bookmark fa-2x"></i>{this.props.data.name}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-envelope"></i>{this.props.data.hostEmail}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-phone"></i> {this.props.data.hostPhone}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-building"></i>{this.props.data.venueName}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-map-marker"></i>{this.props.data.venueAddress}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-calendar"></i> {this.props.data.days.map((day, idx) => { return `${idx == 0 ? '' : ', '}${Moment(day).format('MM/DD/YY')}` }) }</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-clock-o"></i>{`${this.props.data.startTime >=0 && this.props.data.startTime < 100 ? this.formatMilitaryTime(this.props.data.startTime) : Moment(this.props.data.startTime, 'Hmm').format('hh:mm A')}`} - {`${this.props.data.endTime >=0 && this.props.data.endTime < 100 ? this.formatMilitaryTime(this.props.data.endTime) : Moment(this.props.data.endTime, 'Hmm').format('hh:mm A')}`}</div>
            </div>
          </div>

          <div className="item">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-microphone"></i>{this.props.data.micType == null ? 'Sign Up' : this.props.data.micType}</div>
            </div>
          </div>

          <div className="itemLast">
            <div className='itemTextContainer'>
              <div className='itemText'><i className="fa fa-2x fa-credit-card"></i>{this.props.data.free ? 'Free' : this.props.data.cost}</div>
            </div>
          </div>

          {/*`${Moment(this.props.data.days[0]).format('MM/DD/YYYY')} - ${Moment(this.props.data.days[this.props.data.days.length - 1]).format('MM/DD/YYYY')}`*/}

          {/*<span className="fa fa-repeat fa-2x item" aria-hidden="true">
            <div className='itemTextContainer'>
              <div className='itemText'>{this.props.data.days.length == 1 ? 'Once' : `${this.props.data.days.length} Times`}</div>
            </div>
          </span>*/}

        </div>
      </div>
    );
  }
}
