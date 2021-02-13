import React from 'react';
import TickTable from './TickTable';
import { Bar } from 'react-chartjs-2';
import { DateTime } from 'luxon';
import { getDateRange } from '../helpers/dateHelper';

const grades = ['7a', '7a+', '7b', '7b+', '7c', '7c+'];
const sevenA = 11;
const eightA = 17;

const getQuartalSevens = (ticks) => {
  const { starts, ends } = getDateRange(ticks);
  const years = getYears(starts.year, ends.year);
  const quarters = years.flatMap((year) => getQuarters(year));

  return quarters.map((q) => {
    const sevens = ticks.filter((t) => t.timestamp >= q.starts && t.timestamp <= q.ends);
    const gradeCounts = grades.map((g) => ({ grade: g, count: sevens.filter((t) => t.grade.name === g).length }));
    const gradeCountMap = gradeCounts.reduce((x, gc) => {
      x[gc.grade] = gc.count;
      return x;
    }, {});

    return {
      ...q,
      sevens: {
        total: sevens.length,
        ...gradeCountMap,
      },
    };
  });
};

const getQuarters = (year) => {
  const starts = DateTime.local(year, 1, 1, 0, 0);
  const quarters = [];

  for (let i = 0; i < 4; i++) {
    const qStart = starts.plus({ months: 3 * i });
    const qEnd = qStart.plus({ months: 2 }).endOf('month');

    quarters.push({
      year: year,
      quarter: i + 1,
      starts: qStart,
      ends: qEnd,
    });
  }

  return quarters;
};

const getYears = (startYear, endYear) => {
  const years = [];
  let year = startYear;

  while (year <= endYear) {
    years.push(year);
    year++;
  }

  return years;
};

export const Sevens = (props) => {
  const ticks = props.ticks.filter((t) => t.grade.id >= sevenA);

  if (ticks.length === 0) {
    return <h4>Plz send harder.</h4>;
  }

  const quartalSevens = getQuartalSevens(ticks);

  const options = {
    legend: {
      display: true,
    },
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  const data = {
    labels: quartalSevens.map((s) => (s.quarter === 1 ? s.year + ' Q' + s.quarter : ' Q' + s.quarter)),
    datasets: grades.map((grade) => ({
      label: grade,
      backgroundColor: `rgba(255,0,0, ${0.3 + 0.12 * grades.indexOf(grade)})`,
      data: quartalSevens.map((s) => s.sevens[grade]),
    })),
  };

  return (
    <React.Fragment>
      <Bar data={data} options={options} />
      <TickTable ticks={ticks} />
    </React.Fragment>
  );
};

export default Sevens;
