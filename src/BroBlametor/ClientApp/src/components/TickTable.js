import React from 'react';

const gyms = {
  1: "BK Pasila",
  2: "BK Konala",
  3: "BK Isatis",
  132: "BK Espoo",
  10: "Helsinking kiipeilykeskus",
  120: "Kiipeilyareena"
}

export const TickTable = ({ ticks }) => (
  <table className="table table-sm mt-4 mb-4">
    <thead>
      <tr>
        <th>Date</th>
        <th>Problem</th>
        <th>Gym</th>
        <th>Wall</th>
        <th>Grade</th>
      </tr>
    </thead>
    <tbody>
      { ticks.sort((a, b) => b.timestamp - a.timestamp).map((t, i) => (
        <tr key={i}>
          <td>{t.timestamp.toISODate()}</td>
          <td>{t.problemName}</td>
          <td>{gyms[t.gymId] || ("n/a: " + t.gymId)}</td>
          <td>{t.wallName}</td>
          <td>{t.grade.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TickTable;