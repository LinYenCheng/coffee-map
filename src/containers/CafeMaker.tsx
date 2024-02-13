import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import CoffeeShopFeatureStar from '../components/Search/CoffeeShopFeatureStar';

import { CoffeeShop } from '../types';
import calculateScore from '../util/calculateScore';

type Props = {
  nowItem: CoffeeShop;
  isActive: boolean;
};

export default function CafeMaker({ nowItem, isActive }: Props) {
  const markerRef = useRef<L.Marker>(null);
  const { latitude, longitude, name, url } = nowItem;
  const score = calculateScore(nowItem);

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }

    return () => {
      markerRef.current?.closePopup();
    };
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
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
}
