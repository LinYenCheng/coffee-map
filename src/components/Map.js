import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';

function getStars(num) {
  switch (num) {
    case 5:
      return '★★★★★';
    case 4:
      return '★★★★';
    case 3:
      return '★★★';
    case 2:
      return '★★';
    default:
      return '★';
  }
}


const PopupMarker = (props) => {
  const initMarker = (ref) => {
    if (ref) {
      ref.leafletElement.openPopup();
    }
  };

  return <Marker ref={initMarker} {...props} />;
};


function SimpleExample({ isMenuOpen, toggleMenu, item, items }) {
  const positionMarker = [
    parseFloat(item.latitude),
    parseFloat(item.longitude),
  ];
  const position = [24.8, 121.023];
  const isUrl = !!(item.url);
  let popMarker = null;
  const markers = items.filter(nowItem => nowItem.lat).map((nowItem, index) => (
    <Marker
      key={`${nowItem.lat}${nowItem.lng}${index}`}
      opacity={0.6}
      position={[
        parseFloat(nowItem.lat),
        parseFloat(nowItem.lng),
      ]}
    >
      <Popup>
        <div dangerouslySetInnerHTML={{ __html: nowItem.popup }} />
      </Popup>
    </Marker>
  ));


  if (item.latitude) {
    popMarker = (
      <button type="button">
        <PopupMarker position={positionMarker}>
          <Popup autoPan>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>{item.name}</span>
              <br />
              <span>
                {item.address}<br />
                {item.wifi > 0 ? `WIFI穩定: ${getStars(item.wifi)}` : ''} {item.wifi > 0 ? <br /> : ''}
                {item.seat > 0 ? `通常有位:  ${getStars(item.seat)}` : ''} {item.seat > 0 ? <br /> : ''}
                {item.quiet > 0 ? `安靜程度:  ${getStars(item.quiet)}` : ''} {item.quiet > 0 ? <br /> : ''}
                {item.tasty > 0 ? `咖啡好喝:  ${getStars(item.tasty)}` : ''} {item.tasty > 0 ? <br /> : ''}
                {item.cheap > 0 ? `價格便宜:  ${getStars(item.cheap)}` : ''} {item.cheap > 0 ? <br /> : ''}
                {item.music > 0 ? `裝潢音樂:  ${getStars(item.music)}` : ''} {item.music > 0 ? <br /> : ''}
              </span>
              {isUrl ? <a href={item.url}>粉絲專頁</a> : ''}
            </div>
          </Popup>
        </PopupMarker>
      </button>
    );
  }
  return (
    <Map
      center={item.latitude
        ? positionMarker
        : position}
      zoom={12}
      maxZoom={18}
      zoomControl={false}
      animate
      onClick={() => { if (isMenuOpen) toggleMenu(); }}
    >
      <TileLayer
        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {item.latitude && popMarker}
      <MarkerClusterGroup>
        {markers}
      </MarkerClusterGroup>
    </Map>
  );
}

SimpleExample.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default SimpleExample;
