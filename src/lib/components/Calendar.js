import React, { Component } from 'react'
import PropTypes from 'prop-types'
import arrow_light from '../../assets/icon/arrow_light.svg'
import arrow_dark from '../../assets/icon/arrow_dark.svg'
import './Calendar.scss'

class Calendar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onDateSelect: PropTypes.func.isRequired,
    // onClose: PropTypes.func,
    type: PropTypes.string,
  }

  constructor() {
    super();
    this.monthMinus = this.monthMinus.bind(this);
    this.monthAdd = this.monthAdd.bind(this);
    this.getDays = this.getDays.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.isCurrentMon = this.isCurrentMon.bind(this);
    this.state = {
      year: 0,
      month: 0,
      days: {
        pre: [],
        current: [],
        next: [],
      },
    }
  }

  componentDidMount() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const numofDays = (new Date(year, month, 0)).getDate();
    const days = this.getDays(month, year);
    this.setState({
      year,
      month,
      days,
    });
  }

  // get days array for calendar
  getDays(currentMonth, currentYear) {
    const lastOflast = (new Date(currentYear, currentMonth, 0)).getDate();
    const numofDays = (new Date(currentYear, currentMonth+1, 0)).getDate();
    // pre-month days show on calendar  
    let preDays = (new Date(currentYear, currentMonth, 1)).getDay()-1;
    if (preDays<0) {
      preDays = 6;
    }
    // next-month days show on calendar
    let nextDays = 7 - (new Date(currentYear, currentMonth+1, 0)).getDay();
    if (nextDays === 7) {
      nextDays = 0;
    }
    //
    const preArr = Array.from(Array(preDays).keys()).map((x, index)=>lastOflast-index);
    const currentArr = Array.from(Array(numofDays).keys()).map(x=>x+1);
    const nextArr = Array.from(Array(nextDays).keys()).map(x=>x+1);
    return {
      pre: preArr.reverse(),
      current: currentArr,
      next: nextArr,
    };
  }

  isCurrentMon() {
    if (this.state.year===(new Date()).getFullYear() && this.state.month===(new Date()).getMonth()) {
      return true;
    } else {
      return false;
    }
  }

  monthMinus() {
    // if current month, not allow to minus
    if (!this.isCurrentMon()) {
      if (this.state.month===0) {
        this.setState((prevState, props) => ({
          year: prevState.year - 1,
          month: 11,
          days: this.getDays(11, prevState.year - 1),
        }));
      } else {
        this.setState((prevState, props) => ({
          month: prevState.month - 1,
          days: this.getDays(prevState.month - 1, prevState.year),
        }));
      }
    }
  }

  monthAdd() {
    if (this.state.month===11) {
      this.setState((prevState, props) => ({
        year: prevState.year + 1,
        month: 0,
        days: this.getDays(0, prevState.year + 1),
      }));
    } else {
      this.setState((prevState, props) => ({
        month: prevState.month + 1,
        days: this.getDays(prevState.month + 1, prevState.year),
      }));
    }
  }

  onSelectDate(e) {
    let day = e.target.firstChild.nodeValue;
    const d = day + '.' + (this.state.month+1) + '.' + this.state.year;
    this.props.onDateSelect(d);
    // if (this.props.onClose) {
    //   this.props.onClose();
    // }
  }

  getMonthName(num) {
    switch (num) {
      case 0:
        return 'January';
        break;
      case 1:
        return 'February';
        break;
      case 2:
        return 'March';
        break;
      case 3:
        return 'April';
        break;
      case 4:
        return 'May';
        break;
      case 5:
        return 'June';
        break;
      case 6:
        return 'July';
        break;
      case 7:
        return 'August';
        break;
      case 8:
        return 'September';
        break;
      case 9:
        return 'October';
        break;
      case 10:
        return 'November';
        break;
      case 11:
        return 'December';
      default:
        break;
    }
    return 'error';
  }

  render() {
    return (
      <div className='calendar'>
        {this.props.title && <p className="title">{this.props.title}</p>}
        <div className="calendar-head">
          <div className='arrow left' style={{backgroundImage: `url(${this.isCurrentMon()?arrow_dark:arrow_light}?w=1600)`}} onClick={this.monthMinus}></div>
          <div className="mon">{this.getMonthName(this.state.month) + ' ' + this.state.year}</div>
          <div className='arrow right' style={{backgroundImage: `url(${arrow_light}?w=1600)`}} onClick={this.monthAdd}></div>
        </div>
        <div className="calendar-weekdays">
          <div className='day-list'>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            <li>Sun</li>
          </div>
        </div>
        <div className="days">
          <div className='day-list'>
            {this.state.days.pre.map((day, index) => (<li className='pre' key={`pre_${day}`}>{day}</li>))}
            {this.state.days.current.map((day, index) => {
              const today = new Date();
              let extraClass = '';
              if (this.state.year===today.getFullYear() && this.state.month===today.getMonth() && day===today.getDate()) {
                extraClass += 'today';
              }
              return <li className={`current ${extraClass}`} key={`current${day}`} onClick={this.onSelectDate}>{day}</li>
            })}
            {this.state.days.next.map((day, index) => (<li className='next' key={`next_${day}`}>{day}</li>))}
          </div>
        </div>
      </div>
    )
  }
}

export default Calendar;

