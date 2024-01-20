/* eslint-disable react/no-danger */
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import useCafeShopsStore from '../store/useCafesStore';
import PopupContent from '../components/PopupContent';

function MyMap({ search, setBounds, setZoom, resetItem }) {
  // eslint-disable-next-line no-unused-vars
  const map = useMapEvent('click', () => {
    // resetItem();
  });

  useMapEvent('moveend', () => {
    if (map) {
      const mapBounds = map.getBounds();
      const zoom = map.getZoom();
      setZoom(zoom);
      setBounds({
        northEast: mapBounds.getNorthEast(),
        southWest: mapBounds.getSouthWest(),
      });
    }
    search();
  });

  return null;
}

function CafeMap({ position, item, items, setBounds, search }) {
  const popupRef = useRef();
  const { checkedConditions } = useCafeShopsStore();
  const [map, setMap] = useState();
  const [zoom, setZoom] = useState(12);
  const positionMarker = [
    parseFloat(item?.latitude || 24.8),
    parseFloat(item?.longitude || 121.023),
  ];
  // const position = [24.8, 121.023];

  const markers =
    zoom > 11
      ? items
          .filter((nowItem) => {
            const isSocketFilterEnable = checkedConditions[0].checked === true;
            const isQuietFilterEnable = checkedConditions[1].checked === true;
            const isNetWorkFilterEnable = checkedConditions[2].checked === true;

            if (isSocketFilterEnable && !nowItem.socket) {
              return false;
            }

            if (isQuietFilterEnable && !nowItem.quiet) {
              return false;
            }

            if (isNetWorkFilterEnable && !nowItem.wifi) {
              return false;
            }

            return nowItem.lat;
          })
          .map((nowItem, index) => (
            <Marker
              key={`${nowItem.lat}${nowItem.lng}${index}`}
              opacity={0.6}
              position={[parseFloat(nowItem.lat), parseFloat(nowItem.lng)]}
              icon={L.divIcon({
                iconSize: 'auto',
                html: `<div class="custom-marker">
                            <span>${nowItem.score} ★ ${nowItem.name}</span>
                        </div>`,
              })}
            >
              <Popup>
                <div dangerouslySetInnerHTML={{ __html: nowItem.popup }} />
              </Popup>
            </Marker>
          ))
      : [];

  const handleMapLoad = (map) => {
    const mapInstance = map;
    const mapBounds = mapInstance.getBounds();
    setBounds({
      northEast: mapBounds.getNorthEast(),
      southWest: mapBounds.getSouthWest(),
    });
    setMap(mapInstance);
  };

  return (
    <MapContainer
      center={position}
      zoom={12}
      maxZoom={18}
      zoomControl={false}
      animate
      whenCreated={handleMapLoad}
    >
      <MyMap setBounds={setBounds} setZoom={setZoom} search={search} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>{markers}</MarkerClusterGroup>
      <Marker
        position={item ? { lat: positionMarker[0], lng: positionMarker[1] } : null}
        icon={L.divIcon({
          iconSize: 'auto',
          html: `<div class="custom-marker custom-marker--focus">
                    <span>${item.score} ★ ${item.name}</span>
              </div>`,
        })}
      >
        <Popup ref={popupRef}>
          <PopupContent item={item} />
        </Popup>
      </Marker>
    </MapContainer>
  );
}

CafeMap.propTypes = {};
export default CafeMap;
