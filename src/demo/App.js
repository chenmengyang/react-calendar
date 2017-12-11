import React from 'react';
import { Calendar, RangeCalendar, } from '../lib';
import './App.scss'

const App = () => (
  <div className='app'>
    <Calendar date={new Date(2018,1,1)} onDateSelect={()=>{}} />
    <div className="sep"></div>
    <RangeCalendar onRangeSelect={()=>{}} onClose={()=>{}} />
  </div>
);

export default App;
