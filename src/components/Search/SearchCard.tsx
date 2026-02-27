import { useRef } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';

import { useParams } from 'react-router-dom';
import { CoffeeShop } from '../../types';
import CoffeeShopFeatureStar from './CoffeeShopFeatureStar';
import ConditionalRenderer from '../ConditionalRenderer';
import CoffeeTag from './CoffeeTag';
import useCafeShopsStore from '../../store/useCafesStore';
import { calculateDistance } from '../../util/calculateDistance';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void; // Adjust the type of item accordingly
}

function SearchCard({ item, onSelect }: SearchCardProps) {
  const { condition } = useParams();
  const { name, wifi, seat, quiet, tasty, cheap, music, latitude, longitude } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);
  const { userLocation } = useCafeShopsStore();

  const toast = useRef<Toast | null>(null);

  // 計算距離（如果有用戶位置）
  let distance: number | null = null;
  if (userLocation) {
    distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }

  return (
    <div
      role="presentation"
      className="card pt-3 ps-3"
      onClick={() => {
        onSelect(item);
      }}
    >
      <div className="card__title d-flex ">
        <div className="flex-grow-1 justify-content-start title">
          <Tooltip target=".a-title" position="bottom" />
          <Toast ref={toast} />
          <a
            data-pr-tooltip={name}
            className="h4 a-title me-2"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(name);
              toast.current?.show({ severity: 'info', summary: name, detail: '已複製到剪貼簿' });
            }}
          >
            {name}
          </a>
          <ConditionalRenderer isShowContent={!!condition && window.innerWidth > 768}>
            <CoffeeTag item={item} />
          </ConditionalRenderer>
        </div>
        <div className="me-3 d-flex align-items-center gap-2">
          {distance !== null && (
            <span className="distance-info" title="距離">
              {distance.toFixed(1)} km
            </span>
          )}
          <span className="ms-2 score">{score}</span>
          <i className="pi pi-star-fill score ms-1" />
        </div>
      </div>
      <CoffeeShopFeatureStar item={item} />
    </div>
  );
}

export default SearchCard;
