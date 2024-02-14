import { forwardRef, useState } from 'react';
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import ConditionalRenderer from '../components/ConditionalRenderer.js';

import { CoffeeShop } from '../types';
import useCafeShopsStore, {
  checkBounds,
  searchWithKeyword,
  setBounds,
} from '../store/useCafesStore.js';
import CafeMaker from './CafeMaker.js';
import { DISABLE_CLUSTER_LEVEL } from '../constants/config.js';

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
  const { bounds, filterCoffeeShops } = useCafeShopsStore();
  const [zoom, setZoom] = useState<number>(12);
  const selectId = selectItem?.id;

  return (
    <MapContainer center={position} zoom={12} maxZoom={18} zoomControl={false} ref={ref}>
      <MyMap setZoom={setZoom} />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={100}
        disableClusteringAtZoom={DISABLE_CLUSTER_LEVEL}
      >
        <ConditionalRenderer isShowContent={zoom > 11 && filterCoffeeShops.length > 0}>
          {filterCoffeeShops
            .filter((coffeeShop: CoffeeShop) => {
              if (bounds) {
                return checkBounds({ bounds, coffeeShop });
              }
              return true;
            })
            .map((nowItem: CoffeeShop) => (
              <CafeMaker key={nowItem.id} nowItem={nowItem} isActive={selectId === nowItem.id} />
            ))}
        </ConditionalRenderer>
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default CafeMap;
