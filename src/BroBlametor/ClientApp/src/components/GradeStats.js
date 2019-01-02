import React from 'react';

export const GradeStats = (props) => {
  const { grades, ticks } = props;

  return (
    <table className="table table-sm">
      <tbody>
        { grades.map(g => 
          <tr key={g}>
            <th>{g}</th>
            <td>{ticks.filter(t => t.grade.name === g).length}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
};

export default GradeStats;