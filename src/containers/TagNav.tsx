import useCafeShopsStore, { toggleConditions } from '../store/useCafesStore';

import '../styles/menu-nav.scss';

import { conditions } from '../constants/config';
import { Condition } from '../types';

function TagNav() {
  const { checkedConditions } = useCafeShopsStore();

  const handleConditionToggle = (index: number) => {
    const tempCheckedConditions: Condition[] = [...checkedConditions];
    tempCheckedConditions[index].checked = !checkedConditions[index].checked;
    toggleConditions(tempCheckedConditions);
  };

  const blockConditionList = conditions.map((condition, index) => (
    <li className="nav__li" key={condition.name}>
      <input
        id={condition.name}
        type="checkbox"
        checked={checkedConditions[index].checked}
        onChange={() => handleConditionToggle(index)}
      />
      <label htmlFor={condition.name} className="nav__label nav__label--condition">
        {condition.displayName}
      </label>
    </li>
  ));

  return <ul className="d-inline-block mb-0 ps-0">{blockConditionList}</ul>;
}

export default TagNav;
