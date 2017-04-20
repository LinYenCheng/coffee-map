import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MenuBtn.css';

const MenuBtn = props => (
  <button
    id="menu-button" role="button" onClick={(e) => {
      const clickButton = props.toggleMenu;
      e.preventDefault();
      clickButton();
    }
    }
  >
    <div className="hamburger">
      <div className="inner" />
    </div>
  </button>
);

MenuBtn.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};

export default MenuBtn;
