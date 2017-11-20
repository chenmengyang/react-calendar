import React, { Component } from 'react'
import PropTypes from 'prop-types'
import arrow_light from '../../assets/icon/arrow_light.svg'
import arrow_dark from '../../assets/icon/arrow_dark.svg'
import DayElement from './DayElement';
import './Calendar.scss'

class Calendar extends Component {
  static propTypes = {
    title: PropTypes.string,
    onDateSelect: PropTypes.func.isRequired,
    type: PropTypes.string,
  }

  constructor() {
    super();
    this.monthMinus = this.monthMinus.bind(this);
    this.monthAdd = this.monthAdd.bind(this);
    this.getDays = this.getDays.bind(this);
    this.onSelectDate = this.onSelectDate.bind(this);
    this.isCurrentMon = this.isCurrentMon.bind(this);
    this.setHoverDate = this.setHoverDate.bind(this);
    this.getNextCalendar = this.getNextCalendar.bind(this);
    this.state = {
      year: 0,
      month: 0,
      // activeDate: new Date(),
      activeRange: {
        from: new Date(),
        to: null,
      },
      hoverDate: new Date(2018,0,1),
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
      activeRange: {
        from: new Date(),
        to: null,
      },
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
        }));
      } else {
        this.setState((prevState, props) => ({
          month: prevState.month - 1,
        }));
      }
    }
  }

  monthAdd() {
    if (this.state.month===11) {
      this.setState((prevState, props) => ({
        year: prevState.year + 1,
        month: 0,
      }));
    } else {
      this.setState((prevState, props) => ({
        month: prevState.month + 1,
      }));
    }
  }

  onSelectDate(e, calendar) {
    let day = e.target.firstChild.nodeValue;
    let year, month;
    if (calendar === 'current') {
      year = this.state.year;
      month = this.state.month;
    } else {
      year = this.getNextCalendar().year;
      month = this.getNextCalendar().month;
    }
    // hello 
    this.setState((prevState, props) => {
      // if both, set from, empty to. if just from, set to.
      if (prevState.activeRange.from && prevState.activeRange.to) {
        return {
          activeRange: {
            from: new Date(year, month, day),
            to: null,
          }
        };
      } else if (prevState.activeRange.from && !prevState.activeRange.to) {
        return {
          activeRange: {
            from: prevState.activeRange.from,
            to: new Date(year, month, day),
          }
        };
      }
    });
  }

  // set the current hoving element
  setHoverDate(e) {
    let day = e.target.firstChild.nodeValue;
    this.setState({
      hoverDate: day,
    });
  }

  // the the next month after current
  getNextCalendar() {
    let year = this.state.year;
    let month = this.state.month;
    if (month===11) {
      year += 1;
      month = 0;
    } else 
    {
      month += 1;
    }
    return {
      year,
      month,
    }
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
      <div className="rangecalendar">
        <div className='calendar current'>
          {this.props.title && <p className="title">{this.props.title}</p>}
          <div className="calendar-head">
            <div className='arrow left' style={{backgroundImage: `url(${this.isCurrentMon()?arrow_dark:arrow_light}?w=1600)`}} onClick={this.monthMinus}></div>
            <div className="mon">{this.getMonthName(this.state.month) + ' ' + this.state.year}</div>
          </div>
          <div className="calendar-weekdays">
            <div className='day-list'>
              <li>Mo</li>
              <li>Tu</li>
              <li>We</li>
              <li>Th</li>
              <li>Fr</li>
              <li>Sa</li>
              <li>Su</li>
            </div>
          </div>
          <div className="days">
            <div className='day-list'>
              {this.getDays(this.state.month, this.state.year).pre.map((day, index) => <DayElement {...this.state} extraClass='pre' key={`pre_${day}`} onHover={this.setHoverDate} day={day} /> )}
              {this.getDays(this.state.month, this.state.year).current.map((day, index) => {
                const activeRange = this.state.activeRange;
                const today = new Date();
                let extraClass = '';
                if (this.state.year===today.getFullYear() && this.state.month===today.getMonth() && day<today.getDate()) {
                  return <DayElement {...this.state} extraClass='before' key={`current${day}`} onHover={this.setHoverDate} day={day} />
                }
                // else if (this.state.year===activeRange.getFullYear() && this.state.month===activeRange.getMonth() && day===activeRange.getDate()) {
                //   extraClass += 'active';
                // }
                return <DayElement {...this.state} extraClass={`current ${extraClass}`} key={`current${day}`} onHover={this.setHoverDate} onClick={(event)=>this.onSelectDate(event, 'current')} day={day} />
              })}
              {this.getDays(this.state.month, this.state.year).next.map((day, index) => <DayElement extraClass='next' key={`next${day}`} onHover={this.setHoverDate} day={day} />)}
            </div>
          </div>
        </div>
        {/* here we go */}
        <div className='calendar next'>
          {this.props.title && <p className="title">{this.props.title}</p>}
          <div className="calendar-head">
            <div className="mon">{this.getMonthName(this.getNextCalendar().month) + ' ' + this.getNextCalendar().year}</div>
            <div className='arrow right' style={{backgroundImage: `url(${arrow_light}?w=1600)`}} onClick={this.monthAdd}></div>
          </div>
          <div className="calendar-weekdays">
            <div className='day-list'>
              <li>Mo</li>
              <li>Tu</li>
              <li>We</li>
              <li>Th</li>
              <li>Fr</li>
              <li>Sa</li>
              <li>Su</li>
            </div>
          </div>
          <div className="days">
            <div className='day-list'>
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).pre.map((day, index) => <DayElement {...this.state} extraClass='pre' key={`pre_${day}`} onHover={this.setHoverDate} day={day} /> )}
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).current.map((day, index) => {
                const activeRange = this.state.activeRange;
                const today = new Date();
                let extraClass = '';
                if (this.getNextCalendar().year===today.getFullYear() && this.getNextCalendar().month===today.getMonth() && day<today.getDate()) {
                  return <DayElement {...this.state} extraClass='before' key={`current${day}`} onHover={this.setHoverDate} day={day} />
                }
                // else if (this.getNextCalendar().year===activeRange.getFullYear() && this.getNextCalendar().month===activeRange.getMonth() && day===activeRange.getDate()) {
                //   extraClass += 'active';
                // }
                return <DayElement {...this.state} extraClass={`current ${extraClass}`} key={`current${day}`} onHover={this.setHoverDate} onClick={(event)=>this.onSelectDate(event, 'next')} day={day} />
              })}
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).next.map((day, index) => <DayElement extraClass='next' key={`next${day}`} onHover={this.setHoverDate} day={day} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Calendar;