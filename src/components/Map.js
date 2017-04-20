import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';
import '../styles/Map.css';

// Create your own class, extending from the Marker class.
class PopupMarker extends Marker {
  componentDidMount() {
    // Call the Marker class componentDidMount (to make sure everything behaves as normal)
    super.componentDidMount();

    // Access the marker element and open the popup.
    this.leafletElement.openPopup();
  }
  componentWillUpdate() {
    this.leafletElement.openPopup();
  }
}

const SimpleExample = ({ isMenuOpen, toggleMenu, item, items }) => {
  const positionMarker = [
    parseFloat(item.latitude),
    parseFloat(item.longitude),
  ];
  const position = [24.8, 121.023];
  const isUrl = !!(item.url);
  let popmarker = null;
  if (item.latitude) {
    if (isUrl) {
      popmarker = (<PopupMarker position={positionMarker}>
        <Popup>
          <div>
            <span>{item.name}<br /> {item.address}<br />
            </span>
            <a href={item.url}>粉絲專頁</a>
          </div>
        </Popup>
      </PopupMarker>);
    } else {
      popmarker = (<PopupMarker position={positionMarker}>
        <Popup>
          <div>
            <span>{item.name}<br /> {item.address}<br />
            </span>
            <br />
          </div>
        </Popup>
      </PopupMarker>);
    }
  }
  return (
    <Map
      center={item.latitude
        ? positionMarker
        : position} zoom={12} maxZoom={18} zoomControl={false} animate
      onClick={() => { if (isMenuOpen) toggleMenu(); }}
    >
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      {item.latitude && popmarker}
      <MarkerClusterGroup
        markers={items} wrapperOptions={{
          enableDefaultStyle: true,
        }}
      />
    </Map>
  );
};

SimpleExample.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default SimpleExample;
