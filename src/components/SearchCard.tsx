import classNames from 'classnames';

import srcMRT from './assets/icon_mrt.png';
import srcChair from './assets/icon_chair.png';
import srcWIFI from './assets/icon_wifi.png';
import srcNoCell from './assets/icon_no_cell.png';
import srcCoffee from './assets/icon_coffee_maker.png';
import srcMoney from './assets/icon_money.png';
import srcStar from './assets/icon_star.png';
import { CoffeeShop } from '../types';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void; // Adjust the type of item accordingly
  inputEl: React.RefObject<HTMLInputElement>;
}

function getStars(num: number): string {
  switch (num) {
    case 5:
      return '☆☆☆☆☆';
    case 4:
      return '☆☆☆☆';
    case 3:
      return '☆☆☆';
    case 2:
      return '☆☆';
    default:
      return '☆';
  }
}

function SearchCard({ item, onSelect }: SearchCardProps): JSX.Element {
  const {
    id,
    name,
    wifi,
    seat,
    quiet,
    tasty,
    cheap,
    music,
    address,
    limited_time,
    socket,
    standing_desk,
    mrt,
    open_time,
  } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);

  return (
    <div
      role="presentation"
      className="card pt-3 ps-4"
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
      <div className="card__title">
        <a
          className="h4"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {name}
        </a>
        <span className="ms-2 score">{score}</span>
        <i className="pi pi-star-fill score ms-1"></i>
      </div>
      <ul>
        <li>
          <ol>
            {wifi > 3 && <li>WIFI</li>}
            <li className={classNames({ 'display-none': socket === 'no' })}>插座</li>
            <li className={classNames({ 'display-none': limited_time === 'yes' })}>無限時</li>
            <li className={classNames({ 'display-none': standing_desk === 'no' })}>站位</li>
          </ol>
        </li>
        <li>
          <i className="pi pi-map-marker me-2"></i>
          <span>{address}</span>
        </li>
        <li className={classNames({ 'display-none': !open_time })}>
          <i className="pi pi-clock me-2"></i>
          <span>{open_time}</span>
        </li>
        <hr />
        <li className={classNames('li-width-50', { 'display-none': !mrt })}>
          <img alt="" src={srcMRT} />
          <span className="ms-1">{`捷運：${mrt}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcChair} />
          <span className="ms-1">{`座位數量：${getStars(seat)}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcWIFI} />
          <span className="ms-1">{`WIFI：${getStars(wifi)}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcNoCell} />
          <span className="ms-1">{`安靜程度：${getStars(quiet)}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcCoffee} />
          <span className="ms-1">{`咖啡好喝：${getStars(tasty)}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcMoney} />
          <span className="ms-1">{`價位便宜：${getStars(cheap)}`}</span>
        </li>
        <li className="li-width-50">
          <img alt="" src={srcStar} />
          <span className="ms-1">{`裝潢音樂：${getStars(music)}`}</span>
        </li>
      </ul>
    </div>
  );
}

export default SearchCard;
