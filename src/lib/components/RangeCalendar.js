import React, { Component } from 'react'
import PropTypes from 'prop-types'
import arrow_light from '../../assets/icon/arrow_light.svg'
import arrow_dark from '../../assets/icon/arrow_dark.svg'
import DayElement from './DayElement'
import './RangeCalendar.scss'

class RangeCalendar extends Component {

  static propTypes = {
    title: PropTypes.string,
    onRangeSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func,
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
    this.checkRange = this.checkRange.bind(this);
    this.dateEqual = this.dateEqual.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.state = {
      year: 0,
      month: 0,
      activeRange: {
        from: new Date(),
        to: null,
      },
      hoverDate: new Date(1901,0,1),
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

  onCancel() {
    this.props.onClose();
  }

  onApply() {
    const from = this.state.activeRange.from? ( this.state.activeRange.from.getDate() + '.' + (this.state.activeRange.from.getMonth()+1) + '.' + this.state.activeRange.from.getFullYear()) : null;
    const to = this.state.activeRange.to? ( this.state.activeRange.to.getDate() + '.' + (this.state.activeRange.to.getMonth()+1) + '.' + this.state.activeRange.to.getFullYear()) : null;
    // console.log(`this.state.activeRange.from is ${from}, this.state.activeRange.to is ${to}`);    
    this.props.onRangeSelect(from, to);
  }

  onSelectDate(e, calendar) {
    let year, month;
    if (calendar === 'current') {
      year = this.state.year;
      month = this.state.month;
    } else {
      year = this.getNextCalendar().year;
      month = this.getNextCalendar().month;
    }
    const day = new Date(year, month, e.target.firstChild.nodeValue);
    // hello 
    this.setState((prevState, props) => {
      // if both, set from, empty to. if just from, set to.
      if (prevState.activeRange.from && !prevState.activeRange.to && day>prevState.activeRange.from) {
        return {
          activeRange: {
            from: prevState.activeRange.from,
            to: day,
          }
        };
      }
      return {
        activeRange: {
          from: day,
          to: null,
        }
      };
    });
  }

  dateEqual(date1, date2) {
    if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      return true;
    }
    return false;
  }

  // check if day between range
  checkRange(flag, day) {
    let theDay;
    if (flag==='current') {
      theDay = new Date(this.state.year, this.state.month, day);
    } else {
      theDay = new Date(this.getNextCalendar().year, this.getNextCalendar().month, day);
    }
    // 
    if (this.dateEqual(this.state.activeRange.from, theDay)) {
      return 'from';
    } else if (this.state.activeRange.to && this.dateEqual(this.state.activeRange.to, theDay)) {
      return 'to';
    } else if (theDay>this.state.activeRange.from) {
      if ((this.state.activeRange.to && theDay<this.state.activeRange.to) ||
        (!this.state.activeRange.to && theDay<this.state.hoverDate)
      ) {
        return 'between';
      }
    }
    return '';
  }

  // set the current hoving element
  setHoverDate(flag ,day) {
    let theDay;
    if (flag==='current') {
      theDay = new Date(this.state.year, this.state.month, day);
    } else {
      theDay = new Date(this.getNextCalendar().year, this.getNextCalendar().month, day);
    }
    this.setState({
      hoverDate: theDay,
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
        <div className='subcalendar current'>
          {this.props.title && <p className="title">{this.props.title}</p>}
          <div className="calendar-head">
            <div className='arrow left' style={{backgroundImage: `url(${this.isCurrentMon()?arrow_dark:arrow_light})`}} onClick={this.monthMinus}></div>
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
              {this.getDays(this.state.month, this.state.year).pre.map((day, index) => <DayElement key={`pre${day}`} empty={true} /> )}
              {this.getDays(this.state.month, this.state.year).current.map((day, index) => {
                const activeRange = this.state.activeRange;
                const today = new Date();
                let extraClass = '';
                if (this.state.year===today.getFullYear() && this.state.month===today.getMonth() && day<today.getDate()) {
                  return <DayElement {...this.state} extraClass='before' key={`current${day}`} onHover={()=>this.setHoverDate('current', day)} day={day} />
                }
                extraClass += this.checkRange('current', day);
                return <DayElement {...this.state} extraClass={`current ${extraClass}`} key={`current${day}`} onHover={()=>this.setHoverDate('current', day)} onClick={(event)=>this.onSelectDate(event, 'current')} day={day} />
              })}
              {this.getDays(this.state.month, this.state.year).next.map((day, index) => <DayElement key={`next${day}`} empty={true} />)}
            </div>
          </div>
        </div>
        {/* here we go */}
        <div className='subcalendar next'>
          {this.props.title && <p className="title">{this.props.title}</p>}
          <div className="calendar-head">
            <div className="mon">{this.getMonthName(this.getNextCalendar().month) + ' ' + this.getNextCalendar().year}</div>
            <div className='arrow right' style={{backgroundImage: `url(${arrow_light})`}} onClick={this.monthAdd}></div>
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
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).pre.map((day, index) => <DayElement key={`pre${day}`} empty={true} /> )}
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).current.map((day, index) => {
                const activeRange = this.state.activeRange;
                const today = new Date();
                let extraClass = '';
                if (this.getNextCalendar().year===today.getFullYear() && this.getNextCalendar().month===today.getMonth() && day<today.getDate()) {
                  return <DayElement {...this.state} extraClass='before' key={`current${day}`} onHover={()=>this.setHoverDate('next', day)} day={day} />
                }
                extraClass += this.checkRange('next', day);
                return <DayElement {...this.state} extraClass={`current ${extraClass}`} key={`current${day}`} onHover={()=>this.setHoverDate('next', day)} onClick={(event)=>this.onSelectDate(event, 'next')} day={day} />
              })}
              {this.getDays(this.getNextCalendar().month, this.getNextCalendar().year).next.map((day, index) => <DayElement key={`next${day}`} empty={true} />)}
            </div>
          </div>
        </div>
        <div className="button cancel" onClick={this.onCancel}>Cancle</div>
        <div className="button apply" onClick={this.onApply}>Apply</div>
      </div>
    )
  }
}

export default RangeCalendar;