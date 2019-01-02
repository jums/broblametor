export const getDateRange = (ticks) => {
  const chronologicalTicks = ticks.sort((a, b) => b.timestamp - a.timestamp);
  const oldestTick = chronologicalTicks[chronologicalTicks.length - 1];
  const latestTick = chronologicalTicks[0];
  return {
    starts: oldestTick.timestamp,
    ends: latestTick.timestamp
  };
};
