import { useParams } from 'react-router-dom';

import { classNames } from 'primereact/utils';

import CoffeeTag from './CoffeeTag';
import ConditionalRenderer from '../ConditionalRenderer';

import srcMRT from './assets/icon_mrt.png';
import srcChair from './assets/icon_chair.png';
import srcWIFI from './assets/icon_wifi.png';
import srcNoCell from './assets/icon_no_cell.png';
import srcCoffee from './assets/icon_coffee_maker.png';
import srcMoney from './assets/icon_money.png';
import srcStar from './assets/icon_star.png';
import srcLocation from './assets/icon_location_on.png';
import srcTime from './assets/icon_access_time.png';

import { CoffeeShop } from '../../types';

import './CoffeeShopFeatureStar.scss';

type Props = {
  item: CoffeeShop;
};

function Stars({ num }: { num: number }) {
  // Handle edge cases (0 or negative values) gracefully
  const rating = Math.max(0, num);

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const filled = i < rating;

    stars.push(<span key={i} className={filled ? 'pi pi-star-fill' : 'pi pi-star'} />);
  }

  return <>{stars}</>;
}

export default function CoffeeShopFeatureStar({ item }: Props) {
  const { condition } = useParams();
  const { wifi, seat, quiet, tasty, cheap, music, address, mrt, open_time } = item;

  return (
    <>
      <ConditionalRenderer isShowContent={!condition || window.innerWidth < 768}>
        <CoffeeTag item={item} />
      </ConditionalRenderer>
      <div className="CoffeeShopFeature">
        <ul className="coffee-information flex-grow-1">
          <li>
            <img alt="" src={srcLocation} />
            <span className="ms-1 feature-title">{address}</span>
          </li>
          <li className={classNames({ 'display-none': !mrt })}>
            <img alt="" src={srcMRT} />
            <span className="ms-1 feature-title">捷運：</span>
            <span>{mrt}</span>
          </li>
          <li className={classNames({ 'display-none': !open_time })}>
            <img alt="" src={srcTime} />
            <span className="ms-1 feature-title">{open_time}</span>
          </li>
          <hr />
        </ul>
        <div className="search-card">
          <div className="icon-rating">
            <img alt="" src={srcChair} />
            <span className="ms-1 feature-title">座位數量：</span>
            <Stars num={seat} />
          </div>
          <div className="icon-rating">
            <img alt="" src={srcWIFI} />
            <span className="ms-1 feature-title">WIFI：</span>
            <Stars num={wifi} />
          </div>
          <div className="icon-rating">
            <img alt="" src={srcNoCell} />
            <span className="ms-1 feature-title">安靜程度：</span>
            <Stars num={quiet} />
          </div>
          <div className="icon-rating">
            <img alt="" src={srcCoffee} />
            <span className="ms-1 feature-title">咖啡好喝：</span>
            <Stars num={tasty} />
          </div>
          <div className="icon-rating">
            <img alt="" src={srcMoney} />
            <span className="ms-1 feature-title">價位便宜：</span>
            <Stars num={cheap} />
          </div>
          <div className="icon-rating">
            <img alt="" src={srcStar} />
            <span className="ms-1 feature-title">裝潢音樂：</span>
            <Stars num={music} />
          </div>
        </div>
      </div>
    </>
  );
}
