import { Tooltip } from 'primereact/tooltip';

import { CoffeeShop } from '../../types';
import CoffeeShopFeatureStar from './CoffeeShopFeatureStar';
import ConditionalRenderer from '../ConditionalRenderer';
import { useParams } from 'react-router-dom';
import CoffeeTag from './CoffeeTag';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void; // Adjust the type of item accordingly
}

function SearchCard({ item, onSelect }: SearchCardProps): JSX.Element {
  const { condition } = useParams();
  const { name, wifi, seat, quiet, tasty, cheap, music } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);

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
        <div className="me-3">
          <span className="ms-2 score">{score}</span>
          <i className="pi pi-star-fill score ms-1"></i>
        </div>
      </div>
      <CoffeeShopFeatureStar item={item} />
    </div>
  );
}

export default SearchCard;
