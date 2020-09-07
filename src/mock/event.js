import {getRandomInteger, getRandomElement, getRandomNumberElements, getRandomBooleanValue} from '../utils.js';

const CITIES = [`London`, `Paris`, `Keln`, `Moscow`, `Liverpool`, `Manchester`];
const MAX_EVENT_PRICE = 1000;
const MAX_DESCRIPTIONS = 5;
const MAX_DAYS_GAP = 7;
const PLACE_DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const PHOTO_SRC = `http://picsum.photos/248/152?r=`;
const TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Drive`, `Flight`, `Transport`, `Check-in`, `Sightseeing`, `Restaurant`];
const OFFERS = [`breakfast`, `uber`, `seats`, `luggage`, `comfort`, `radio`, `dinner`];


const generatePlaceInfo = () => {
  const photos = [];
  const photosCount = getRandomInteger(1, MAX_DESCRIPTIONS);

  for (let i = 0; i < photosCount; i++) {
    photos.push(PHOTO_SRC + getRandomInteger(0, MAX_DESCRIPTIONS));
  }

  return {
    description: getRandomNumberElements(PLACE_DESCRIPTION).slice(0, MAX_DESCRIPTIONS),
    photos,
  };
};

const placeInfoForCities = CITIES.reduce(
    (acc, city) =>
      Object.assign(acc, {
        [city]: generatePlaceInfo()
      }),
    {}
);

const offersForEvent = OFFERS.reduce(
    (acc, offer) =>
      Object.assign(acc, {
        [offer]: {
          title: offer,
          price: getRandomInteger(0, MAX_EVENT_PRICE),
          check: getRandomBooleanValue(),
        }
      }), {}
);

const offersForType = TYPES.reduce(
    (acc, type) =>
      Object.assign(acc, {
        [type]: OFFERS
          .sort(() => {
            return getRandomInteger(-1, 1);
          })
          .slice(0, getRandomInteger(1, OFFERS.length))
      }),
    {}
);

const generateDate = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  const currentDate = new Date();

  currentDate.setTime(getRandomInteger(currentDate.getTime(), currentDate.getTime() + 24 * 360 * 1000));
  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};

export const generateEvent = () => {
  const type = getRandomElement(TYPES);
  const city = getRandomElement(CITIES);
  const offers = offersForType[type].map((it) => Object.assign({ }, offersForEvent[it]));

  const date = generateDate();
  const timeOver = new Date(date.getTime());
  timeOver.setTime(getRandomInteger(date.getTime(), date.getTime() + 24 * 360 * 1000));

  return {
    type,
    offers,
    city,
    price: getRandomInteger(0, MAX_EVENT_PRICE),
    date,
    timeOver,
    placeInfo: placeInfoForCities[city],
  };
};
