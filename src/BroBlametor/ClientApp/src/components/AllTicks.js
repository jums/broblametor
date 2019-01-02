import React from 'react';
import TickTable from './TickTable';

export const AllTicks = (props) => {
  const ticks = props.ticks; //.filter(t => t.grade.id >= 11);
  return (
    <React.Fragment>
      <TickTable ticks={ticks} />
    </React.Fragment>
  )
};

export default AllTicks;
