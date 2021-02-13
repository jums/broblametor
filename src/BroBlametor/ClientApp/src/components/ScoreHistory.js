import React from 'react';
import { Line } from 'react-chartjs-2';
import { DateTime } from 'luxon';
import { getDateRange } from '../helpers/dateHelper';

const getWeeklyScores = (starts, ends, ticks) => {
  const weekEnds = getWeekEnds(starts, ends);
  const weeklyScores = weekEnds.map((weekEnd) => ({ weekEnd, score: getMonthlyTop10Score(weekEnd, ticks) }));
  return weeklyScores.reverse();
};

const getMonthlyTop10Score = (weekEnd, ticks) => {
  const start = weekEnd.startOf('day').minus({ days: 30 });
  const ticksInRange = ticks.filter((t) => t.timestamp >= start && t.timestamp <= weekEnd);
  const top10 = ticksInRange
    .map((t) => t.score)
    .sort()
    .reverse()
    .slice(0, 10);
  return top10.reduce((sum, current) => sum + current, 0);
};

const getWeekEnds = (starts, ends) => {
  const weekEnds = [];
  let weekEnd = ends.endOf('week');

  while (weekEnd > starts) {
    weekEnds.push(weekEnd);
    weekEnd = weekEnd.minus({ weeks: 1 });
  }

  return weekEnds;
};

export const ScoreHistory = ({ ticks }) => {
  const { ends } = getDateRange(ticks);
  // const alternativeStarts = DateTime.local(2016, 12, 10, 0, 0);
  const properStarts = DateTime.local(2017, 1, 1, 0, 0); //starts > alternativeStarts ? starts : alternativeStarts;
  const weeklyScores = getWeeklyScores(properStarts, ends, ticks);

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 8000,
            stepSize: 500,
          },
        },
      ],
    },
  };

  const data = {
    labels: weeklyScores.map((s) => s.weekEnd.toISODate()),

    datasets: [
      {
        label: 'Problemator Score',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: weeklyScores.map((s) => s.score),
      },
    ],
  };

  return (
    <React.Fragment>
      <Line data={data} options={options} />
    </React.Fragment>
  );
};

export default ScoreHistory;
