import React from 'react';
import GradeStats from './GradeStats';
import ScoreHistory from './ScoreHistory';

const Grades = ({ grades, ticks }) => {
  return (
    <div className="row">
      <div className="col">
        <h3>All</h3>
        <GradeStats grades={grades} ticks={ticks} />
      </div>
      <div className="col">
        <h3>2018</h3>
        <GradeStats grades={grades} ticks={ticks.filter(t => t.year === 2018)} />
      </div>
      <div className="col">
        <h3>2017</h3>
        <GradeStats grades={grades} ticks={ticks.filter(t => t.year === 2017)} />
      </div>
    </div>
  );
}

export const Stats = ({ grades, ticks }) => {
  return (
    <React.Fragment>
      <ScoreHistory ticks={ticks} />
      <Grades grades={grades} ticks={ticks} />
    </React.Fragment>
  );
}

export default Stats;
