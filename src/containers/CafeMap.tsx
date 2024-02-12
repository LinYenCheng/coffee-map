import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';

import ConditionalRenderer from '../components/ConditionalRenderer.js';
import CoffeeShopFeatureStar from '../components/Search/CoffeeShopFeatureStar.js';

import calculateScore from '../util/calculateScore.js';
import { CoffeeShop } from '../types/index.js';
import { searchWithKeyword, setBounds } from '../store/useCafesStore.js';

interface CafeMapProps {
  position: { lat: number; lng: number };
  coffeeShops: CoffeeShop[];
}

interface MapProps {
  setZoom: (zoom: number) => void;
}

function MyMap({ setZoom }: MapProps) {
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
    searchWithKeyword('');
  });

  return null;
}

function CafeMap({ position, coffeeShops }: CafeMapProps): JSX.Element {
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
      <MyMap setZoom={setZoom} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={120} disableClusteringAtZoom={17}>
        <ConditionalRenderer isShowContent={zoom > 11 && coffeeShops.length > 0}>
          {coffeeShops.map((nowItem: CoffeeShop) => {
            const { latitude, longitude, name, url } = nowItem;
            const score = calculateScore(nowItem);

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
                <Popup>
                  <div className="card border-none" style={{ minWidth: '400px' }}>
                    <div className="card__title mb-2">
                      <a className="h6" href={url} target="_blank">
                        {name}
                      </a>
                      <span className="ms-2 score">{score}</span>
                      <i className="pi pi-star-fill score ms-1"></i>
                    </div>
                    <CoffeeShopFeatureStar item={nowItem} />
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </ConditionalRenderer>
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default CafeMap;
