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
    padding: '2px 6px',
    cursor: 'default',
  },

  menu: {
    maxWidth: '300px',
    border: 'solid 1px #ccc',
  },
};

function matchCoffeeToTerm(poi, value) {
  // console.log(poi)
  return (poi.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    poi.address.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
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
      }} 
      menuStyle={{
        borderRadius: '3px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2px 0',
        fontSize: '90%',
        position: 'fixed',
        overflow: 'auto',
        maxWidth: '360px',
        maxHeight: 'calc( 100vh - 70px )'
      }}
      items={getCoffee(stateChk)} 
      getItemValue={item => item.name}
      shouldItemRender={matchCoffeeToTerm} 
      sortItems={sortCoffees}
      onChange={(event, value) => this.setState({ value })}
      onSelect={this.handleSelect} 
      renderItem={(item, isHighlighted) => (
        <div
          className="card"
          style={isHighlighted
            ? styles.highlightedItem
            : styles.item} key={item.id}
          onMouseOver={()=>{this.handleSelect('', item)}}
        >
        <h4>{item.name}</h4>
        <ul>
          <li>
            <ol>
            {item.limited_time === 'no' ? <li>無限時</li> : ''}
              {item.socket !== '' || item.socket !== 'no' ? <li>插座</li> : ''}
              {item.wifi > 3 ? <li>WIFI</li> : ''}
              {item.quiet > 3 ? <li>較安靜</li> : ''}
              {item.cheap > 3 ? <li>較便宜</li> : ''}
            </ol>
          </li>
          <li>地址: {item.address}</li>
          {item.open_time ? <li>營業時間: {item.open_time}</li> : ''}
          <li>
            <a href={item.url}>粉絲專頁</a>
          </li>
        </ul>
        </div>
      )}
    />);
  }
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default Search;
