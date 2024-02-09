import useCafeShopsStore, { toggleSortConditions } from '../store/useCafesStore';

import '../styles/menu-nav.scss';

import { defaultSortConditions } from '../constants/config';
import { Condition } from '../types';

function TagNav() {
  const { sortConditions } = useCafeShopsStore();

  const handleConditionToggle = (index: number) => {
    const tempsortConditions: Condition[] = [
      ...sortConditions.map((elm) => ({ ...elm, checked: false })),
    ];
    tempsortConditions[index].checked = !sortConditions[index].checked;
    toggleSortConditions(tempsortConditions);
  };

  const blockConditionList = defaultSortConditions.map((condition, index) => (
    <li className="nav__li" key={condition.name}>
      <input
        id={condition.name}
        type="checkbox"
        checked={sortConditions[index].checked}
        onChange={() => handleConditionToggle(index)}
      />
      <label htmlFor={condition.name} className="nav__label nav__label--condition">
        {condition.displayName}
      </label>
    </li>
  ));

  return <ul className="ms-2 mb-0 ps-0">{blockConditionList}</ul>;
}

export default TagNav;
