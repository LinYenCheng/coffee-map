import React from 'react';
import { connect } from 'react-redux';
import '../styles/menu-nav.scss';

import { toggleCondition } from '../actions';
import { conditions } from '../config';

function TagNav({ checkedConditions, dispatch }) {
  const blockConditionList = conditions.map((condition, index) => (
    <li className="nav__li" key={condition.name}>
      <input
        id={condition.name}
        type="checkbox"
        checked={checkedConditions[index]}
        onChange={() => {
          const tempCheckedConditions = checkedConditions.slice();
          tempCheckedConditions[index] = !checkedConditions[index];
          // console.log(tempCheckedConditions, index);
          dispatch(toggleCondition(tempCheckedConditions));
        }}
      />
      <label htmlFor={condition.name} className="nav__label nav__label--condition">
        {condition.displayName}
      </label>
    </li>
  ));

  return <ul className="d-inline-block mb-0 ps-0">{blockConditionList}</ul>;
}

function mapStateToProps(state) {
  return {
    checkedConditions: state.checkedConditions,
  };
}

export default connect(mapStateToProps)(TagNav);
