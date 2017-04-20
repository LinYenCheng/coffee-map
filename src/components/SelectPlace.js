import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectPlaceLi extends Component {
  constructor(props) {
    super(props);
    this.handleChangeChk = this.handleChangeChk.bind(this);
  }

  handleChangeChk(e) {
    this.props.onChange(e.target);
  }

  render() {
    const { isSelected, place, id } = this.props;
    return (
      <li>
        <div className="wrap">
          <div className="li-word">{place}</div>
          <input type="checkbox" checked={isSelected} onChange={this.handleChangeChk} id={id} />
          <label className="slider-v3" htmlFor={id} />
        </div>
      </li>
    );
  }
}

SelectPlaceLi.propTypes = {
  onChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  place: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default SelectPlaceLi;
