import { Tooltip } from 'primereact/tooltip';

import { CoffeeShop } from '../../types';
import CoffeeShopFeatureStar from './CoffeeShopFeatureStar';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void; // Adjust the type of item accordingly
}

function SearchCard({ item, onSelect }: SearchCardProps): JSX.Element {
  const { id, name, wifi, seat, quiet, tasty, cheap, music } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);

  return (
    <div
      role="presentation"
      className="card pt-3 ps-3"
      onClick={() => {
        onSelect(item);
      }}
      onFocus={() => {
        onSelect(item);
      }}
      onTouchMove={() => {
        onSelect(item);
      }}
    >
      <div className="card__title d-flex justify-content-start">
        <div className="title">
          <Tooltip target=".a-title" position="bottom" />
          <a
            data-pr-tooltip={name}
            className="h4 a-title"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {name}
          </a>
        </div>
        <div className="">
          <span className="ms-2 score">{score}</span>
          <i className="pi pi-star-fill score ms-1"></i>
        </div>
      </div>
      <CoffeeShopFeatureStar item={item} />
    </div>
  );
}

export default SearchCard;
