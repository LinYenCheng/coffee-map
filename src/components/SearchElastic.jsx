import React, { useState, useEffect, useRef, useCallback } from 'react';
import APICoffee from '../api/APICoffee';
import { conditions } from '../config';
import TagNav from '../containers/TagNav';

function SearchElastic({ onHover, checkedConditions, nowItem, toggleCondition }) {
  let blockCards = '';
  const inputEl = useRef(null);
  const intPageSize = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [strInput, setStrInput] = useState('');
  const strCheckedConditions = conditions
    .filter((condition, index) => checkedConditions[index])
    .map((condition) => condition.displayName)
    .join(' ');

  const searchWithKeyword = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      const result = await APICoffee.searchWithKeyWord(`${strCheckedConditions} ${strInput}`);
      setItems(result);
    },
    [strCheckedConditions, strInput],
  );

  useEffect(() => {
    setTimeout(() => {
      searchWithKeyword();
    }, 800);
  }, []);

  function handleChange(event) {
    setStrInput(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      inputEl.current.blur();
    }
  }

  function onSelect(item) {
    if (item && nowItem && item.id !== nowItem.id) {
      // console.log(item);
      onHover(item);
      inputEl.current.blur();
    }
  }

  function clearSearch() {
    toggleCondition();
    setStrInput('');
    setDisplayItems([]);
  }

  function handleScroll(e) {
    if (e.target.scrollTop > e.target.clientHeight * page && items.length > intPageSize * page) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    if (strCheckedConditions !== '') {
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

  if (displayItems.length) {
    blockCards = displayItems.map((item) => {
      const { cheap, music, quiet, seat, tasty, wifi } = item;
      const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);
      return (
        <div
          role="presentation"
          key={item.id}
          className="card"
          onClick={() => {
            onSelect(item);
            inputEl.current.blur();
          }}
          onFocus={() => {
            onSelect(item);
          }}
          // onMouseOver={() => {
          //   onSelect(item);
          // }}
          onTouchMove={() => {
            onSelect(item);
          }}
          // onPointerOver={() => {
          //   onSelect(item);
          // }}
        >
          <div className="card__title">
            <a
              className="h4"
              href={item.url}
              target="_blank"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {item.name}
            </a>
            <span className="ms-2 score">{score}</span>
            <i className="pi pi-star-fill score ms-1"></i>
          </div>
          <ul>
            <li>
              <ol>
                {item.limited_time === 'no' && <li>無限時</li>}
                {item.socket !== '' || item.socket !== 'no' ? <li>插座</li> : ''}
                {item.wifi > 3 && <li>WIFI</li>}
                {item.quiet > 3 && <li>較安靜</li>}
                {item.cheap > 3 ? <li>較便宜</li> : ''}
              </ol>
            </li>
            <li>
              <i className="pi pi-map-marker me-2"></i>
              <span>{item.address}</span>
            </li>
            {item.open_time && (
              <li>
                <i className="pi pi-clock me-2"></i>
                <span>{item.open_time}</span>
              </li>
            )}
          </ul>
        </div>
      );
    });
  }
  let placeholderCondition = '輸入店名 地址';
  if (strCheckedConditions) {
    placeholderCondition = `查詢條件:${strCheckedConditions}`;
  }
  let blockSearch = (
    <button type="submit" className="btn search__button" onClick={searchWithKeyword}>
      <svg viewBox="0 0 100 100">
        <circle id="circle" cx="45" cy="45" r="30" />
        <path id="line" d="M45,45 L100,100" />
      </svg>
    </button>
  );

  if (strInput !== '' || strCheckedConditions !== '') {
    blockSearch = (
      <button type="button" className="btn search__button" onClick={clearSearch}>
        <span>✕</span>
      </button>
    );
  }

  return (
    <>
      <div className="search-container">
        <form onSubmit={searchWithKeyword}>
          <input
            value={strInput}
            onChange={handleChange}
            ref={inputEl}
            onClick={() => {
              searchWithKeyword();
            }}
            onKeyPress={handleKeyPress}
            placeholder={`${placeholderCondition}`}
          />

          {blockSearch}
        </form>
      </div>
      <div className="search__result" onScroll={handleScroll}>
        <div className="tag__container">
          <span className="tag__title">排列順序</span>
          <TagNav />
        </div>
        <div>{blockCards}</div>
      </div>
    </>
  );
}

export default SearchElastic;
