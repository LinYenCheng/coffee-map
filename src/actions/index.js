export const toggleMenu = () => ({
  type: 'TOGGLE_MENU',
});

export const toggleCheck = (checkedCities) => ({
  type: 'TOGGLE_CHECK',
  payload: checkedCities,
});

export const toggleCondition = (checkedConditions) => ({
  type: 'TOGGLE_CONDITION',
  payload: checkedConditions,
});

export const selcetPlace = (id) => ({
  type: 'SELECT_PLACE',
  id,
});

export const setPlaces = (items) => ({
  type: 'ALL_PLACE',
  items,
});
