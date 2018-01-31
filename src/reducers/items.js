const items = (state = [], action) => {
  switch (action.type) {
    case 'ALL_PLACE':
      return [...state];
    default:
      return state;
  }
};

export default items;
