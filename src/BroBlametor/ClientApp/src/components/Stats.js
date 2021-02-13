import React from 'react';
import ScoreHistory from './ScoreHistory';

const Grades = ({ grades, ticks }) => {
  const years = ticks
    .map((t) => t.year)
    .filter((value, index, self) => self.indexOf(value) == index)
    .filter((year) => year >= 2017)
    .sort();

  return (
    <table className='table table-sm mb-4'>
      <thead>
        <tr>
          <th style={{ maxWidth: '100px', width: '100px' }}></th>
          {years.map((year) => (
            <th key={year} style={{ paddingRight: '15px', textAlign: 'right', maxWidth: '100px', width: '100px' }}>
              <h3>{year}</h3>
            </th>
          ))}
          <th style={{ borderLeft: '1px solid #ccc', textAlign: 'right' }}>
            <h3>All</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        {grades.map((g) => (
          <tr key={g}>
            <th>{g}</th>
            {years.map((year) => (
              <td key={year} style={{ paddingRight: '15px', textAlign: 'right' }}>
                {ticks.filter((t) => t.year === year && t.grade.name === g).length}
              </td>
            ))}
            <td style={{ borderLeft: '1px solid #ccc', textAlign: 'right' }}>{ticks.filter((t) => t.grade.name === g).length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const Stats = ({ grades, ticks }) => {
  return (
    <React.Fragment>
      <ScoreHistory ticks={ticks} />
      <Grades grades={grades} ticks={ticks} />
    </React.Fragment>
  );
};

export default Stats;
