import { classNames } from 'primereact/utils';
import './CoffeeTag.css';
import { CoffeeShop } from '../../types';

interface Props {
  item: CoffeeShop;
}

export default function CoffeeTag({ item }: Props) {
  const { wifi, limited_time, socket, standing_desk } = item;
  return (
    <div className="CoffeeTag ">
      <ol>
        {wifi > 3 && <li>WIFI</li>}
        <li className={classNames({ 'display-none': socket === 'no' })}>插座</li>
        <li className={classNames({ 'display-none': limited_time === 'yes' })}>無限時</li>
        <li className={classNames({ 'display-none': standing_desk === 'no' })}>站位</li>
      </ol>
    </div>
  );
}
