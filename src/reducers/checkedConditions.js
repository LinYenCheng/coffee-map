import { conditions } from '../config';

const defaultCheckedConditions = conditions.map((condition) => condition.checked);

const checkedConditions = (state = defaultCheckedConditions, action) => {
  switch (action.type) {
    case 'TOGGLE_CONDITION': {
      const newState = action.payload ? [...action.payload] : defaultCheckedConditions;
      return newState;
    }
    default:
      return state;
  }
};

export default checkedConditions;
