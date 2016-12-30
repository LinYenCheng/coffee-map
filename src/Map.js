import React from 'react';
import {render} from 'react-dom';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import './Map.css';

class SimpleExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 24.8,
            lng: 121.023,
            zoom: 14
        };
    }

    render() {

        const positionMarker = [
            parseFloat(this.props.item.latitude),
            parseFloat(this.props.item.longitude)
        ];
        const position = [this.state.lat, this.state.lng];
        const isUrl = !!(this.props.item.url);        
        return (
            <Map center={this.props.item.latitude
                ? positionMarker
                : position} zoom={this.state.zoom} zoomControl={false} animate={true}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
                <Marker position={this.props.item.latitude
                    ? positionMarker
                    : position}>
                    <Popup>
                        <div>
                            <span>{this.props.item.name}<br/> {this.props.item.address}<br/>
                            </span>
                            {isUrl
                                ? (
                                    <a href={this.props.item.url}>粉絲專頁</a>
                                )
                                : (<br/>)}
                        </div>
                    </Popup>
                </Marker>
            </Map>
        );
    }
}

export default SimpleExample;
