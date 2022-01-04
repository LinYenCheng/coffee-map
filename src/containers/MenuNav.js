import React from 'react';
import { connect } from 'react-redux';
import '../styles/menu-nav.scss';

import { toggleCheck, toggleCondition } from '../actions';
import { cities, conditions } from '../config';

function MenuNav({ setPosition, checkedCities, checkedConditions, dispatch, toggleMenu }) {
  const blockList = cities.map((city, index) => (
    <li className="nav__li" key={city.name}>
      <input
        id={city.name}
        type="checkbox"
        checked={checkedCities[index]}
        onChange={() => {
          const tempCheckedCities = checkedCities.slice();
          tempCheckedCities[index] = !checkedCities[index];
          if (!checkedCities[index]) setPosition([city.lat, city.lng]);
          dispatch(toggleCheck(tempCheckedCities));
          toggleMenu();
        }}
      />
      <label htmlFor={city.name} className="nav__label">
        {city.displayName}
      </label>
    </li>
  ));
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
          toggleMenu();
        }}
      />
      <label htmlFor={condition.name} className="nav__label nav__label--condition">
        {condition.displayName}
      </label>
    </li>
  ));

  return (
    <nav>
      <ul>
        {blockConditionList}
        <br />
        {blockList}
      </ul>
    </nav>
  );
}

function mapStateToProps(state) {
  return {
    checkedCities: state.checkedCities,
    checkedConditions: state.checkedConditions,
  };
}

export default connect(mapStateToProps)(MenuNav);
