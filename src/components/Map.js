/* eslint-disable react/no-danger */
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
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

function MyMap({ isMenuOpen, toggleMenu }) {
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvent('click', () => {
    if (isMenuOpen) toggleMenu();
  });
  return null;
}

function SimpleExample({ position, isMenuOpen, toggleMenu, item, items }) {
  const { latitude, longitude, url, name, address, wifi, seat, quiet, tasty, cheap, music } = item;
  const positionMarker = [parseFloat(latitude), parseFloat(longitude)];
  // const position = [24.8, 121.023];
  const isUrl = !!url;
  let popMarker = null;
  const markers = items
    .filter((nowItem) => nowItem.lat)
    .map((nowItem, index) => (
      <Marker
        key={`${nowItem.lat}${nowItem.lng}${index}`}
        opacity={0.6}
        position={[parseFloat(nowItem.lat), parseFloat(nowItem.lng)]}
      >
        <Popup>
          <div dangerouslySetInnerHTML={{ __html: nowItem.popup }} />
        </Popup>
      </Marker>
    ));

  if (latitude) {
    popMarker = (
      <button type="button">
        <PopupMarker position={positionMarker}>
          <Popup autoPan>
            <div>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>{name}</span>
              <br />
              <span>
                {address}
                <br />
                {wifi > 0 ? `WIFI穩定: ${getStars(wifi)} ` : ' '}
                {wifi > 0 ? <br /> : ''}
                {seat > 0 ? `通常有位:  ${getStars(seat)} ` : ' '}
                {seat > 0 ? <br /> : ''}
                {quiet > 0 ? `安靜程度:  ${getStars(quiet)} ` : ' '}
                {quiet > 0 ? <br /> : ''}
                {tasty > 0 ? `咖啡好喝:  ${getStars(tasty)} ` : ' '}
                {tasty > 0 ? <br /> : ''}
                {cheap > 0 ? `價格便宜:  ${getStars(cheap)} ` : ' '}
                {cheap > 0 ? <br /> : ''}
                {music > 0 ? `裝潢音樂:  ${getStars(music)} ` : ' '}
                {music > 0 ? <br /> : ''}
              </span>
              {isUrl ? <a href={url}>粉絲專頁</a> : ''}
            </div>
          </Popup>
        </PopupMarker>
      </button>
    );
  }
  return (
    <MapContainer center={position} zoom={12} maxZoom={18} zoomControl={false} animate>
      <MyMap isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latitude && popMarker}
      <MarkerClusterGroup>{markers}</MarkerClusterGroup>
    </MapContainer>
  );
}

SimpleExample.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default SimpleExample;
