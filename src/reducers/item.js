const item = (
  state = {
    name: '搜尋想去的咖啡店~',
    address: '顯示地址及粉專',
  },
  action,
) => {
  switch (action.type) {
    case 'SELECT_PLACE':
      return {
        name: '搜尋想去的咖啡店~1',
        address: '顯示地址及粉專',
      };
    default:
      return state;
  }
};

export default item;
