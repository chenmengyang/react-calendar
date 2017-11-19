import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Calendar from './Calendar'
import './RangeCalendar.scss'

class RangeCalendar extends Component {
  static propTypes = {
  }

  render() {
    return (
      <div className='rangecalendar'>
        <Calendar onDateSelect={()=>{}}/>
        <Calendar onDateSelect={()=>{}}/>
      </div>
    )
  }
}

export default RangeCalendar;