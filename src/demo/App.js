import React from 'react';
import { Calendar, RangeCalendar, } from '../lib';

const App = () => (
  <div>
    <Calendar onDateSelect={()=>{}}/>
    <RangeCalendar />
  </div>
);

export default App;
