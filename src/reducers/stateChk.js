const stateChk = (state = {
  chkTaipei: false,
  chkHsinchu: true,
  chkTainan: false,
}, action) => {
  switch (action.type) {
    case 'TOGGLE_CHECK': {
      const newState = Object.assign({}, state, action.payload);
      return newState;
    }
    default:
      return state;
  }
};

export default stateChk;
