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

function getStars(num) {
  switch (num) {
    case 5:
      return '★★★★★';
      break;
    case 4:
      return '★★★★';
      break;
    case 3:
      return '★★★';
      break;
    case 2:
      return '★★';
      break;
    default:
      return '★';
      break;
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
      popmarker = (
      <PopupMarker position={positionMarker}>
        <Popup>
          <div>
            <span style={{fontWeight:800, fontSize:'16px'}}>{item.name}</span><br /> 
            <span>
            {item.address}<br />
            {item.wifi > 0?  `WIFI穩定: ${getStars(item.wifi)}`  : ''} {item.wifi > 0?  <br />  : ''}
            {item.seat > 0?  `通常有位:  ${getStars(item.seat)}`  : ''} {item.seat > 0?  <br />  : ''}
            {item.quiet > 0? `安靜程度:  ${getStars(item.quiet)}`  : ''} {item.quiet > 0?  <br />  : ''}
            {item.tasty > 0? `咖啡好喝:  ${getStars(item.tasty)}`  : ''} {item.tasty > 0?  <br />  : ''}
            {item.cheap > 0? `價格便宜:  ${getStars(item.cheap)}`  : ''} {item.cheap > 0?  <br />  : ''}
            {item.music > 0? `裝潢音樂:  ${getStars(item.music)}`  : ''} {item.music > 0?  <br />  : ''}
            </span>
            {isUrl?<a href={item.url}>粉絲專頁</a>:''}
          </div>
        </Popup>
      </PopupMarker>);
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
