import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { conditions } from '../constants/config';
import TagNav from './TagNav';

import useCafeShopsStore, { resetConditions, searchWithKeyWord } from '../store/useCafesStore';
import SearchCard from '../components/SearchCard';
import ConditionalRenderer from '../components/ConditionalRenderer';

function SearchElastic({ forwardedRef, bounds, onChange }) {
  const { checkedConditions, coffeeShops } = useCafeShopsStore();
  const inputEl = useRef(null);
  const intPageSize = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [strInput, setStrInput] = useState('');
  const strCheckedConditions = conditions
    .filter((condition, index) => checkedConditions[index].checked)
    .map((condition) => condition.displayName)
    .join(' ');

  const hasSearchCondition = strInput !== '' || strCheckedConditions !== '';

  const searchWithKeyword = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      const result = await searchWithKeyWord({
        coffeeShops: coffeeShops,
        keyWord: `${strCheckedConditions} ${strInput}`,
        bounds,
      });

      setItems(result);
    },
    [strCheckedConditions, strInput, bounds, coffeeShops],
  );

  useImperativeHandle(forwardedRef, () => ({
    search: () => {
      console.log('search');
      searchWithKeyword();
    },
  }));

  function handleChange(event) {
    setStrInput(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      inputEl.current.blur();
    }
  }

  function clearSearch() {
    resetConditions();
    setStrInput('');
    searchWithKeyword();
  }

  function handleScroll(e) {
    if (
      e.target.scrollTop + 122 > e.target.clientHeight * page &&
      items.length > intPageSize * page
    ) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    if (strCheckedConditions !== '') {
      searchWithKeyword();
    } else {
      setTimeout(() => {
        searchWithKeyword();
      }, 50);
    }
  }, [strCheckedConditions, searchWithKeyword]);

  useEffect(() => {
    if (items.length) {
      setDisplayItems(items.slice(0, intPageSize * page));
    }
  }, [items, page]);

  let placeholderCondition = '輸入店名、地址';
  if (strCheckedConditions) {
    placeholderCondition = `查詢條件:${strCheckedConditions}`;
  }

  return (
    <>
      <div className="search-container">
        <form onSubmit={searchWithKeyword}>
          <input
            value={strInput}
            onChange={handleChange}
            ref={inputEl}
            onClick={searchWithKeyword}
            onKeyPress={handleKeyPress}
            placeholder={`${placeholderCondition}`}
          />
          <ConditionalRenderer isShowContent={!hasSearchCondition}>
            <button type="submit" className="btn search__button" onClick={searchWithKeyword}>
              <svg viewBox="0 0 100 100">
                <circle id="circle" cx="45" cy="45" r="30" />
                <path id="line" d="M45,45 L100,100" />
              </svg>
            </button>
          </ConditionalRenderer>
          <ConditionalRenderer isShowContent={hasSearchCondition}>
            <button type="button" className="btn search__button" onClick={clearSearch}>
              <span>✕</span>
            </button>
          </ConditionalRenderer>
        </form>
      </div>
      <div className="search__result" onScroll={handleScroll}>
        <div className="tag__container">
          <span className="tag__title">排列順序</span>
          <TagNav />
        </div>
        <ConditionalRenderer isShowContent={displayItems.length}>
          {displayItems.map((item) => (
            <SearchCard key={item?.id} item={item} onSelect={onChange} />
          ))}
        </ConditionalRenderer>
      </div>
    </>
  );
}

export default SearchElastic;
