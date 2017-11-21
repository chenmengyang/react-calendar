import React from 'react';
import { Calendar, RangeCalendar, } from '../lib';
import './App.scss'

const App = () => (
  <div className='app'>
    <Calendar onDateSelect={()=>{}} />
    <div className="sep"></div>
    <RangeCalendar onRangeSelect={()=>{}} />
  </div>
);

export default App;
