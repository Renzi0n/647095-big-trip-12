export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (elements) => {
  const randomIndex = getRandomInteger(0, elements.length - 1);

  return elements[randomIndex];
};

export const getSliceUntillRandomIndex = (elements) => {
  const randomNumber = getRandomInteger(0, elements.length - 1);

  return elements.slice(0, randomNumber);
};

export const getRandomBooleanValue = () => {
  return Boolean(getRandomInteger(0, 1));
};
