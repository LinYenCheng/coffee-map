const items = (state = [], action) => {
  switch (action.type) {
    case 'ALL_PLACE':
      return [...state, {
        test: test,
      }];
    default:
      return state;
  }
};

export default items;
