export const toggleCondition = (checkedConditions) => ({
  type: 'TOGGLE_CONDITION',
  payload: checkedConditions,
});

export const selcetPlace = (id) => ({
  type: 'SELECT_PLACE',
  id,
});
