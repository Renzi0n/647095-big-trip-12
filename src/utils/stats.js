import {TRANSPORT_TYPES} from '../consts.js';

export const MoneyStatsOptions = {
  FLY: `Flight`,
  STAY: `Check-in`,
  DRIVE: `Drive`,
  LOOK: `Sightseeing`,
  EAT: `Restaurant`,
  RIDE: [`Train`, `Ship`, `Bus`, `Transport`]
};

export const getMoneyStats = (events) => {
  return Object.values(events.reduce((acc, {type, price}) => Object.assign(
      acc,
      {
        [MoneyStatsOptions.FLY]: type === MoneyStatsOptions.FLY ? +acc[MoneyStatsOptions.FLY] + +price : acc[MoneyStatsOptions.FLY],
        [MoneyStatsOptions.STAY]: type === MoneyStatsOptions.STAY ? +acc[MoneyStatsOptions.STAY] + +price : acc[MoneyStatsOptions.STAY],
        [MoneyStatsOptions.DRIVE]: type === MoneyStatsOptions.DRIVE ? +acc[MoneyStatsOptions.DRIVE] + +price : acc[MoneyStatsOptions.DRIVE],
        [MoneyStatsOptions.LOOK]: type === MoneyStatsOptions.LOOK ? +acc[MoneyStatsOptions.LOOK] + +price : acc[MoneyStatsOptions.LOOK],
        [MoneyStatsOptions.EAT]: type === MoneyStatsOptions.EAT ? +acc[MoneyStatsOptions.EAT] + +price : acc[MoneyStatsOptions.EAT],
        [MoneyStatsOptions.RIDE]: MoneyStatsOptions.RIDE.includes(type) ? +acc[MoneyStatsOptions.RIDE] + +price : acc[MoneyStatsOptions.RIDE]
      }
  ), {
    [MoneyStatsOptions.FLY]: 0,
    [MoneyStatsOptions.STAY]: 0,
    [MoneyStatsOptions.DRIVE]: 0,
    [MoneyStatsOptions.LOOK]: 0,
    [MoneyStatsOptions.EAT]: 0,
    [MoneyStatsOptions.RIDE]: 0
  }));
};

export const TransportStatsOptions = {
  DRIVE: `Drive`,
  RIDE: `Taxi`,
  FLY: `Flight`,
  SAIL: `Ship`,
};

export const getTransportStats = (events) => {
  return Object.values(events.reduce((acc, {type}) => Object.assign(
      acc,
      {
        [TransportStatsOptions.DRIVE]: type === TransportStatsOptions.DRIVE ? ++acc[TransportStatsOptions.DRIVE] : acc[TransportStatsOptions.DRIVE],
        [TransportStatsOptions.RIDE]: type === TransportStatsOptions.RIDE ? ++acc[TransportStatsOptions.RIDE] : acc[TransportStatsOptions.RIDE],
        [TransportStatsOptions.FLY]: type === TransportStatsOptions.FLY ? ++acc[TransportStatsOptions.FLY] : acc[TransportStatsOptions.FLY],
        [TransportStatsOptions.SAIL]: type === TransportStatsOptions.SAIL ? ++acc[TransportStatsOptions.SAIL] : acc[TransportStatsOptions.SAIL],
      }
  ), {
    [TransportStatsOptions.DRIVE]: 0,
    [TransportStatsOptions.RIDE]: 0,
    [TransportStatsOptions.FLY]: 0,
    [TransportStatsOptions.SAIL]: 0,
  }));
};

export const getTimeSpentStats = (events) => {
  return events.reduce((acc, {type, city, date, timeOver}) => {
    const option = TRANSPORT_TYPES.includes(type) ? type : city;
    const duration = acc[option] ? acc[option] + (timeOver - date) : (timeOver - date);

    return Object.assign(acc, {
      [option]: duration
    });
  }, {});
};
