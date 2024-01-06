import React from 'react';

import useCafeShopsStore, { toggleConditions } from '../store/useCafesStore';

import '../styles/menu-nav.scss';

import { conditions } from '../constants/config';

function TagNav() {
  const { checkedConditions } = useCafeShopsStore();
  const blockConditionList = conditions.map((condition, index) => (
    <li className="nav__li" key={condition.name}>
      <input
        id={condition.name}
        type="checkbox"
        checked={checkedConditions[index].checked}
        onChange={() => {
          const tempCheckedConditions = checkedConditions.slice();
          tempCheckedConditions[index].checked = !checkedConditions[index].checked;
          console.log(tempCheckedConditions, index);
          toggleConditions(tempCheckedConditions);
        }}
      />
      <label htmlFor={condition.name} className="nav__label nav__label--condition">
        {condition.displayName}
      </label>
    </li>
  ));

  return <ul className="d-inline-block mb-0 ps-0">{blockConditionList}</ul>;
}

export default TagNav;
