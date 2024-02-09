import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

import ConditionalRenderer from '../components/ConditionalRenderer.js';
import calculateScore from '../util/calculateScore.js';
import { CoffeeShop } from '../types/index.js';

interface CafeMapProps {
  position: { lat: number; lng: number };
  coffeeShops: CoffeeShop[];
  setBounds: (bounds: { northEast: L.LatLng; southWest: L.LatLng }) => void;
  search: () => void;
}

interface MapProps {
  setBounds: (bounds: { northEast: L.LatLng; southWest: L.LatLng }) => void;
  search: () => void;
  setZoom: (zoom: number) => void;
}

function MyMap({ search, setBounds, setZoom }: MapProps) {
  const map = useMapEvent('click', () => {});
  useMapEvent('moveend', () => {
    if (map) {
      const mapBounds = map.getBounds();
      const zoom = map.getZoom();
      if (setZoom) setZoom(zoom);
      setBounds({
        northEast: mapBounds.getNorthEast(),
        southWest: mapBounds.getSouthWest(),
      });
    }
    search();
  });

  return null;
}

function CafeMap({ position, coffeeShops, setBounds, search }: CafeMapProps): JSX.Element {
  const [zoom, setZoom] = useState<number>(12);
  const handleMapLoad = (map: L.Map) => {
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
      whenCreated={handleMapLoad}
    >
      <MyMap setBounds={setBounds} setZoom={setZoom} search={search} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={120} disableClusteringAtZoom={17}>
        <ConditionalRenderer isShowContent={zoom > 11 && coffeeShops.length > 0}>
          {coffeeShops.map((nowItem: CoffeeShop) => {
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

            const popupContent = (
              <div className="card border-none">
                <div className="card__title mb-2">
                  <a className="h6" href={url} target="_blank">
                    {name}
                  </a>
                  <span className="ms-2 score">{score}</span>
                  <i className="pi pi-star-fill score ms-1"></i>
                </div>
                <ul>
                  <li>
                    <ol className="mb-2">
                      <ConditionalRenderer isShowContent={wifi > 3}>
                        <li>WIFI</li>
                      </ConditionalRenderer>
                      <ConditionalRenderer isShowContent={socket !== 'no'}>
                        <li>插座</li>
                      </ConditionalRenderer>
                      <ConditionalRenderer isShowContent={limited_time !== 'yes'}>
                        <li>無限時</li>
                      </ConditionalRenderer>
                      <ConditionalRenderer isShowContent={standing_desk === 'yes'}>
                        <li>站位</li>
                      </ConditionalRenderer>
                    </ol>
                  </li>
                  <li className="mb-2">
                    <i className="pi pi-map-marker me-2"></i>
                    <span>{address}</span>
                  </li>
                </ul>
              </div>
            );
            return (
              <Marker
                key={nowItem.id}
                opacity={0.5}
                position={{ lng: parseFloat(longitude), lat: parseFloat(latitude) }}
                icon={L.divIcon({
                  html: `<div class="custom-marker">
                            <span>${score} ★ ${nowItem.name}</span>
                        </div>`,
                })}
              >
                <Popup>{popupContent}</Popup>
              </Marker>
            );
          })}
        </ConditionalRenderer>
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default CafeMap;
