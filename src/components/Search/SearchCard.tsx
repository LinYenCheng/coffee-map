import { Tooltip } from 'primereact/tooltip';

import { CoffeeShop } from '../../types';
import CoffeeShopFeatureStar from './CoffeeShopFeatureStar';
import ConditionalRenderer from '../ConditionalRenderer';
import { useParams } from 'react-router-dom';
import CoffeeTag from './CoffeeTag';
import useCafeShopsStore from '../../store/useCafesStore';
import { calculateDistance } from '../../util/calculateDistance';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void; // Adjust the type of item accordingly
}

function SearchCard({ item, onSelect }: SearchCardProps): JSX.Element {
  const { condition } = useParams();
  const { name, wifi, seat, quiet, tasty, cheap, music, latitude, longitude } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);
  const { userLocation } = useCafeShopsStore();

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
          <a
            data-pr-tooltip={name}
            className="h4 a-title me-2"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
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
          <i className="pi pi-star-fill score ms-1"></i>
        </div>
      </div>
      <CoffeeShopFeatureStar item={item} />
    </div>
  );
}

export default SearchCard;
