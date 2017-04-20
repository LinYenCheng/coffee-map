import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import 'whatwg-fetch';
import PropTypes from 'prop-types';
import dataMockTaipei from '../api/MockTaipei';
import dataMockHsinchu from '../api/MockHsinchu';
import dataMockTainan from '../api/MockTainan';

const styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default',
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default',
  },

  menu: {
    border: 'solid 1px #ccc',
  },
};

function matchCoffeeToTerm(poi, value) {
  return (poi.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    poi.id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
}

function sortCoffees(a, b, value) {
  return (a.name.toLowerCase().indexOf(value.toLowerCase()) >
    b.name.toLowerCase().indexOf(value.toLowerCase())
    ? 1
    : -1);
}

function getCoffee(stateChk) {
  let arrResult = [];
  if (stateChk.chkTaipei) {
    arrResult = arrResult.concat(dataMockTaipei);
  }
  if (stateChk.chkHsinchu) {
    arrResult = arrResult.concat(dataMockHsinchu);
  }
  if (stateChk.chkTainan) {
    arrResult = arrResult.concat(dataMockTainan);
  }
  return arrResult;
}

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleSelect = this.handleSelect.bind(this);
  }
  // render 後
  // componentDidMount() {
  //     fetch('https://crossorigin.me/https://cafenomad.tw/api/v1.2/cafes/taipei').then(function(response) {
  //         return response.json()
  //     }).then(function(json) {
  //         console.log('parsed json', json)
  //     }).catch(function(ex) {
  //         console.log('parsing failed', ex)
  //     })
  // }

  handleSelect(value, item) {
    this.setState({ value });
    // console.log(item);
    this.props.onChange(item);
    // value => this.setState({value})
  }

  render() {
    const stateChk = this.props.stateChk;
    return (<Autocomplete
      value={this.state.value} inputProps={{
        name: 'Coffee',
        id: 'Coffee-autocomplete',
      }} items={getCoffee(stateChk)} getItemValue={item => item.name}
      shouldItemRender={matchCoffeeToTerm} sortItems={sortCoffees}
      onChange={(event, value) => this.setState({ value })}
      onSelect={this.handleSelect} renderItem={(item, isHighlighted) => (
        <div
          style={isHighlighted
            ? styles.highlightedItem
            : styles.item} key={item.id}
        >{item.name}</div>
      )}
    />);
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
