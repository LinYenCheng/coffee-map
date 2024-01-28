import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { v4 as uuidv4 } from 'uuid';

import ConditionalRenderer from '../components/ConditionalRenderer';
import calculateScore from '../util/calculateScore';

function MyMap({ search, setBounds, setZoom }) {
  const map = useMapEvent('click', () => {});
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

function CafeMap({ position, coffeeShops, setBounds, search }) {
  const [zoom, setZoom] = useState(12);
  const handleMapLoad = (map) => {
    const mapInstance = map;
    const mapBounds = mapInstance.getBounds();
    setBounds({
      northEast: mapBounds.getNorthEast(),
      southWest: mapBounds.getSouthWest(),
    });
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
      <MarkerClusterGroup chunkedLoading>
        <ConditionalRenderer isShowContent={zoom > 11 && coffeeShops && coffeeShops.length}>
          {coffeeShops.map((nowItem) => {
            const {
              latitude,
              longitude,
              name,
              address,
              wifi,
              socket,
              url,
              limited_time,
              standing_desk,
            } = nowItem;
            const score = calculateScore(nowItem);
            return (
              <Marker
                key={uuidv4()}
                opacity={0.5}
                position={{ lng: longitude, lat: latitude }}
                icon={L.divIcon({
                  iconSize: 'auto',
                  html: `<div class="custom-marker">
                            <span>${score} ★ ${nowItem.name}</span>
                        </div>`,
                })}
              >
                <Popup>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `
                      <div class="card border-none">
                        <div class="card__title mb-2">
                          <a
                            class="h6"
                            href=${url}
                            target="_blank"
                          >
                            ${name}
                          </a>
                          <span class="ms-2 score">${score}</span>
                          <i class="pi pi-star-fill score ms-1"></i>
                        </div>
                        <ul>
                          <li>
                            <ol class="mb-2">
                              ${wifi > 3 ? `<li>WIFI</li>` : ''}
                              ${socket !== 'no' ? `<li>插座</li>` : ''}
                              ${limited_time !== 'yes' ? `<li>無限時</li>` : ''}
                              ${standing_desk === 'yes' ? `<li>站位</li>` : ''}
                            </ol>
                          </li>
                          <li class="mb-2">
                            <i class="pi pi-map-marker me-2"></i>
                            <span>${address}</span>
                          </li>
                        </ul>
                      </div>`,
                    }}
                  />
                </Popup>
              </Marker>
            );
          })}
        </ConditionalRenderer>
      </MarkerClusterGroup>
    </MapContainer>
  );
}

CafeMap.propTypes = {};
export default CafeMap;
