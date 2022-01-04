import { cities } from '../config';

const defaultCheckedCities = cities.map((city) => city.checked);

const checkedCities = (state = defaultCheckedCities, action) => {
  switch (action.type) {
    case 'TOGGLE_CHECK': {
      const newState = [...action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default checkedCities;
