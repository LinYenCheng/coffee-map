import React from 'react';
import PropTypes from 'prop-types';
import '../styles/menu-btn.scss';

const MenuBtn = ({ toggleMenu }) => (
  <button
    type="button"
    id="menu-button"
    onClick={(e) => {
      const clickButton = toggleMenu;
      e.preventDefault();
      clickButton();
    }}
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
