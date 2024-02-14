import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import CoffeeShopFeatureStar from '../components/Search/CoffeeShopFeatureStar';

import { CoffeeShop } from '../types';
import calculateScore from '../util/calculateScore';
import ConditionalRenderer from '../components/ConditionalRenderer';

type Props = {
  nowItem: CoffeeShop;
  isActive: boolean;
  setSelectItem: any;
};

export default function CafeMaker({ nowItem, isActive, setSelectItem }: Props) {
  const markerRef = useRef<L.Marker>(null);
  const { latitude, longitude, name, url } = nowItem;
  const score = calculateScore(nowItem);

  const onMarkerClick = () => {
    setSelectItem(nowItem);
  };

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }

    if (!isActive && markerRef.current) {
      markerRef.current.closePopup();
    }

    return () => {
      if (markerRef.current) markerRef.current.closePopup();
    };
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
      opacity={0.5}
      eventHandlers={{ click: onMarkerClick }}
      position={{ lng: parseFloat(longitude), lat: parseFloat(latitude) }}
      icon={L.divIcon({
        html: `<div class="custom-marker">
                            <span>${score} ★ ${nowItem.name}</span>
                        </div>`,
      })}
    >
      <ConditionalRenderer isShowContent={isActive}>
        <Popup>
          <div className="card border-none" style={{ minWidth: '400px' }}>
            <div className="card__title mb-2 d-flex">
              <div className="flex-grow-1">
                <a className="h6" href={url} target="_blank">
                  {name}
                </a>
              </div>
              <div>
                <span className="ms-2 score">{score}</span>
                <i className="pi pi-star-fill score ms-1"></i>
              </div>
            </div>
            <CoffeeShopFeatureStar item={nowItem} />
          </div>
        </Popup>
      </ConditionalRenderer>
    </Marker>
  );
}
