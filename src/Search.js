import React, {Component} from 'react'
import Autocomplete from 'react-autocomplete';
import dataMockHsinchu from './MockHsinchu';
import dataMockTainan from './MockTainan';

let styles = {
    item: {
        padding: '2px 6px',
        cursor: 'default'
    },

    highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '2px 6px',
        cursor: 'default'
    },

    menu: {
        border: 'solid 1px #ccc'
    }
}

function matchCoffeeToTerm(poi, value) {
    return (poi.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 || poi.id.toLowerCase().indexOf(value.toLowerCase()) !== -1)
}

function sortCoffees(a, b, value) {
    return (a.name.toLowerCase().indexOf(value.toLowerCase()) > b.name.toLowerCase().indexOf(value.toLowerCase())
        ? 1
        : -1)
}

// function fakeRequest(value, cb) {
//     if (value === '')
//         return getCoffee()
//     var items = getCoffee().filter((state) => {
//         return matchCoffeeToTerm(state, value)
//     })
//     setTimeout(() => {
//         cb(items)
//     }, 500)
// }

function getCoffee(stateChk) {    
    var arrResult = [];
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
            value: ''
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(value, item) {
        this.setState({value});
        // console.log(item);
        this.props.onChange(item);
        // value => this.setState({value})
    }

    render() {
        // var styleMenu = {
        //     fontSize: 14,
        //     padding: 5
        // };
        const stateChk = this.props.stateChk;
        return (<Autocomplete value={this.state.value} inputProps={{
            name: "Coffee",
            id: "Coffee-autocomplete"
        }} items={getCoffee(stateChk)} getItemValue={(item) => item.name} shouldItemRender={matchCoffeeToTerm} sortItems={sortCoffees} onChange={(event, value) => this.setState({value})} onSelect={this.handleSelect} renderItem={(item, isHighlighted) => (
            <div style={isHighlighted
                ? styles.highlightedItem
                : styles.item} key={item.id}>{item.name}</div>
        )}/>)
    }
}

export default Search;
