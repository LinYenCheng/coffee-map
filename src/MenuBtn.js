import React, {Component} from 'react';
import './MenuBtn.css';

class MenuBtn extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.onChange();
    }

    render() {
        return (
            <div id="menu-button" role="button" onClick={this.handleClick}>
                <div className="hamburger">
                    <div className="inner"></div>
                </div>
            </div>
        );
    }
}

export default MenuBtn;
