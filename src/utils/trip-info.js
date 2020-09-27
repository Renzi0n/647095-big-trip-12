import moment from "moment";

export const getTripTitle = (events) => {
  const firstCity = events[0].city;
  const secondCity = events.length !== 3 ? `...` : events[1].city;
  const lastCity = events[events.length - 1].city;

  return `${firstCity} &mdash; ${secondCity} &mdash; ${lastCity}`;
};

export const getTripDates = (events) => {
  const firstDate = events[0].date;
  const lastDate = events[events.length - 1].timeOver;

  return `${moment(firstDate).format(`MMM DD`)}
    &nbsp;&mdash;&nbsp;
    ${moment(lastDate).format(firstDate.getMonth() === lastDate.getMonth() ? `DD` : `DD MMM`)}`;
};

export const getTripPrice = (events) => {
  return events.reduce((acc, event) => {
    acc += event.price;
    event.offers.forEach((offer) => {
      acc += offer.price;
    });

    return acc;
  }, 0);
};
