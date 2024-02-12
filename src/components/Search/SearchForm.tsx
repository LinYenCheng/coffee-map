import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { useParams } from 'react-router-dom';

import './search.scss';
import { classNames } from 'primereact/utils';
import ConditionFilters from './ConditionFilters';
import { searchWithKeyword } from '../../store/useCafesStore';

export default function SearchForm() {
  const { condition } = useParams();
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
    searchWithKeyword('', condition);
  }

  const onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (strInput === '' || isSubmit) {
      clearSearch();
    } else {
      setIsSubmit(true);
      searchWithKeyword(strInput, condition);
    }
  };

  const onSubmit = (event: any) => {
    if (event) event.preventDefault();
    setIsSubmit(true);
    searchWithKeyword(strInput, condition);
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
