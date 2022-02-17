/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import PropTypes from 'prop-types';

import PopupMarker from './PopupMarker';

function CoffeeMapEvent({ isMenuOpen, toggleMenu, setMapBounds }) {
  const map = useMapEvents({
    click: () => {
      if (isMenuOpen && map) toggleMenu();
    },
    // 移動完要可以顯示範圍內
    moveend: () => {
      const zoom = map.getZoom();
      if (zoom > 14) {
        // const nowBounds = map.getBounds();
        // setMapBounds(nowBounds);
      } else {
        setMapBounds(false);
      }
    },
  });
  return null;
}

const CoffeeMap = React.memo(
  ({ position, isMenuOpen, toggleMenu, item, items, setMapBounds, mapBounds }) => {
    const [map, setMap] = useState();
    const { latitude, longitude } = item;
    const positionMarker = [parseFloat(latitude), parseFloat(longitude)];
    // const position = [24.8, 121.023];
    const markers = items
      .filter((nowItem) => {
        if (nowItem && nowItem.lat && mapBounds) {
          const { lat, lng } = nowItem;
          const { _southWest, _northEast } = mapBounds;
          return (
            lat > _southWest.lat &&
            lat < _northEast.lat &&
            lng > _southWest.lng &&
            lat < _northEast.lat
          );
        }
        if (mapBounds === false) {
          return nowItem.lat;
        }
        return false;
      })
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

    useEffect(() => {
      if (map) {
        const nowBounds = map.getBounds();
        // console.log(nowBounds._northEast, nowBounds._southWest);
        setMapBounds(nowBounds);
      }
    }, [map, setMapBounds]);

    return (
      <MapContainer
        center={position}
        zoom={14}
        minZoom={10}
        maxZoom={18}
        zoomControl={false}
        animate
        whenCreated={setMap}
      >
        <CoffeeMapEvent
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          setMapBounds={setMapBounds}
        />
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <PopupMarker
          position={positionMarker}
          map={map}
          data={{
            position: [20.27, -156],
          }}
          item={item}
          isActive={latitude && item.name}
        />
        <MarkerClusterGroup>{markers}</MarkerClusterGroup>
      </MapContainer>
    );
  },
);

CoffeeMap.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
};
export default CoffeeMap;
