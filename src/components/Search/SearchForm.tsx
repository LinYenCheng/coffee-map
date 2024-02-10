import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';

import './search.scss';
import OtherConditions from '../../containers/OtherConditions';
import { classNames } from 'primereact/utils';
import CityConditions from '../../containers/CityConditions';
import ConditionFilters from './ConditionFilters';

type Props = {
  search: (keyword?: string) => void;
};

export default function SearchForm({ search }: Props) {
  const inputEl = useRef<HTMLInputElement>(null);
  const [strInput, setStrInput] = useState<string>('');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStrInput(event.target.value);
    if (event.target.value === '') {
      clearSearch();
    }
  }

  function clearSearch() {
    setStrInput('');
    setIsSubmit(false);
    search('');
  }

  const onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (strInput === '' || isSubmit) {
      clearSearch();
    } else {
      setIsSubmit(true);
      search(strInput);
    }
  };

  const onSubmit = (event: any) => {
    if (event) event.preventDefault();
    setIsSubmit(true);
    search(strInput);
  };

  return (
    <div className=" d-flex flex-wrap align-items-center align-content-center">
      <div className="mobile-hide">
        <ConditionFilters />
      </div>
      <form onSubmit={onSubmit}>
        <span className="p-input-icon-right">
          <i
            className={classNames('pi', {
              'pi-search': strInput === '' || !isSubmit,
              'pi-times': strInput !== '' && isSubmit,
            })}
            onClick={onClick}
          />
          <InputText
            value={strInput}
            onChange={handleChange}
            ref={inputEl}
            placeholder="輸入店名、地址"
          />
        </span>
      </form>
    </div>
  );
}
