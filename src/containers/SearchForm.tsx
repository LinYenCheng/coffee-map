import { useRef, useState } from 'react';
import { conditions } from '../constants/config';
import ConditionalRenderer from '../components/ConditionalRenderer';
import useCafeShopsStore, { clearFilterCoffeeShops, resetConditions } from '../store/useCafesStore';

type Props = {
  search: (keyword?: string) => void;
};

export default function SearchForm({ search }: Props) {
  const inputEl = useRef<HTMLInputElement>(null);
  const [strInput, setStrInput] = useState<string>('');
  const { checkedConditions, filterCoffeeShops } = useCafeShopsStore();

  const strCheckedConditions = conditions
    .filter((condition, index) => checkedConditions[index].checked)
    .map((condition) => condition.displayName)
    .join(' ');
  const hasSearchCondition = strCheckedConditions !== '' || filterCoffeeShops.length > 0;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStrInput(event.target.value);
  }

  function clearSearch() {
    clearFilterCoffeeShops();
    resetConditions();
    setStrInput('');
  }

  const onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    search(strInput);
  };

  const onSubmit = (event: any) => {
    if (event) event.preventDefault();
    search(strInput);
  };

  let placeholderCondition = '輸入店名、地址';
  if (strCheckedConditions) {
    placeholderCondition = `${strCheckedConditions}`;
  }

  return (
    <div className="search-container">
      <form onSubmit={onSubmit}>
        <input
          value={strInput}
          onChange={handleChange}
          ref={inputEl}
          placeholder={`${placeholderCondition}`}
        />
        <button type="submit" className="btn search__button" onClick={onClick}>
          <svg viewBox="0 0 100 100">
            <circle id="circle" cx="45" cy="45" r="30" />
            <path id="line" d="M45,45 L100,100" />
          </svg>
        </button>
        <ConditionalRenderer isShowContent={hasSearchCondition}>
          <button type="button" className="btn search__button" onClick={clearSearch}>
            <span>✕</span>
          </button>
        </ConditionalRenderer>
      </form>
    </div>
  );
}
