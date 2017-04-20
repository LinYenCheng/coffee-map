export const toggleMenu = () => ({
  type: 'TOGGLE_MENU',
});

export const toggleCheck = chkState => ({
  type: 'TOGGLE_CHECK',
  payload: chkState,
});

export const selcetPlace = id => ({
  type: 'SELECT_PLACE',
  id,
});
