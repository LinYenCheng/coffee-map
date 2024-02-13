import { forwardRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import ConditionalRenderer from '../components/ConditionalRenderer.js';

import { CoffeeShop } from '../types';
import useCafeShopsStore, { searchWithKeyword, setBounds } from '../store/useCafesStore.js';
import CafeMaker from './CafeMaker.js';

interface CafeMapProps {
  position: { lat: number; lng: number };
  selectItem: CoffeeShop;
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

const CafeMap = forwardRef(({ position, selectItem }: CafeMapProps, ref: any) => {
  const { coffeeShops } = useCafeShopsStore();
  const [zoom, setZoom] = useState<number>(12);
  const selectId = selectItem?.id;

  return (
    <MapContainer center={position} zoom={12} maxZoom={18} zoomControl={false} ref={ref}>
      <MyMap setZoom={setZoom} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={120} disableClusteringAtZoom={15}>
        <ConditionalRenderer isShowContent={zoom > 11 && coffeeShops.length > 0}>
          {coffeeShops.map((nowItem: CoffeeShop) => (
            <CafeMaker key={nowItem.id} nowItem={nowItem} isActive={selectId === nowItem.id} />
          ))}
        </ConditionalRenderer>
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default CafeMap;
