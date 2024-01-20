import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import { conditions } from '../constants/config';
import TagNav from './TagNav';

import useCafeShopsStore, { resetConditions, searchWithKeyWord } from '../store/useCafesStore';
import SearchCard from '../components/SearchCard';
import ConditionalRenderer from '../components/ConditionalRenderer';

function SearchElastic({ forwardedRef, bounds, onChange }) {
  const intPageSize = 10;

  const inputEl = useRef(null);
  const observerTarget = useRef(null);

  const { checkedConditions, coffeeShops } = useCafeShopsStore();

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(page + 1);
      }
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, page]);

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
      <div className="search__result">
        <div className="tag__container">
          <span className="tag__title">排列順序</span>
          <TagNav />
        </div>
        <ConditionalRenderer isShowContent={displayItems.length}>
          {displayItems.map((item) => (
            <SearchCard key={item?.id} item={item} onSelect={onChange} inputEl={inputEl} />
          ))}
        </ConditionalRenderer>
        <div className="w-100 text-center mt-3 mb-3" ref={observerTarget}>
          <div className="spinner-border text-secondary" role="status"></div>
        </div>
      </div>
    </>
  );
}

export default SearchElastic;
