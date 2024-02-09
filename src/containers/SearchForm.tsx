import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import ConditionalRenderer from '../components/ConditionalRenderer';
import { resetConditions } from '../store/useCafesStore';

type Props = {
  search: (keyword?: string) => void;
};

export default function SearchForm({ search }: Props) {
  const inputEl = useRef<HTMLInputElement>(null);
  const [strInput, setStrInput] = useState<string>('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setStrInput(event.target.value);
  }

  function clearSearch() {
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

  return (
    <div className="search-container">
      <form onSubmit={onSubmit}>
        <InputText
          value={strInput}
          onChange={handleChange}
          ref={inputEl}
          placeholder="輸入店名、地址"
        />
        <ConditionalRenderer isShowContent={strInput === ''}>
          <Button type="submit" className="search__button" onClick={onClick} icon="pi pi-search" />
        </ConditionalRenderer>
        <ConditionalRenderer isShowContent={strInput !== ''}>
          <Button
            type="button"
            className="search__button"
            onClick={clearSearch}
            icon="pi pi-times"
          />
        </ConditionalRenderer>
      </form>
    </div>
  );
}
