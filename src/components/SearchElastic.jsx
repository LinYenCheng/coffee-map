import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
import APICoffee from '../api/APICoffee';
import { conditions } from '../config';
import TagNav from '../containers/TagNav';
import classNames from 'classnames';

import srcMRT from './assets/icon_mrt.png';
import srcChair from './assets/icon_chair.png';
import srcWIFI from './assets/icon_wifi.png';
import srcNoCell from './assets/icon_no_cell.png';
import srcCoffee from './assets/icon_coffee_maker.png';
import srcMoney from './assets/icon_money.png';
import srcStar from './assets/icon_star.png';

function getStars(num) {
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

function SearchElastic({
  onHover,
  checkedConditions,
  nowItem,
  toggleCondition,
  forwardedRef,
  bounds,
}) {
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
      const result = await APICoffee.searchWithKeyWord({
        keyWord: `${strCheckedConditions} ${strInput}`,
        bounds,
      });

      setItems(result);
    },
    [strCheckedConditions, strInput, bounds],
  );

  useImperativeHandle(forwardedRef, () => ({
    search: () => {
      console.log('search');
      searchWithKeyword();
    },
  }));

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

  if (displayItems.length) {
    blockCards = displayItems.map((item) => {
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
        latitude,
        longitude,
        url,
        limited_time,
        // yes => Yes，一律有限時
        // maybe => 看情況，假日或客滿限時
        // no => No，一律不限時
        socket,
        // yes => Yes，很多
        // maybe => 還好，看座位
        // no => No，很少
        standing_desk,
        // yes => Yes，有些座位可以
        // no => No，無法
        mrt,
        // 	這欄位是直接紀錄用戶回報時輸入的一串文字，因此格式沒有一致化，可能會有些亂。
        open_time,
        // 這欄位是直接紀錄用戶回報時輸入的一串文字，因此格式沒有一致化，可能會有些亂。
      } = item;
      const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);
      return (
        <div
          role="presentation"
          key={id}
          className="card pt-3 ps-4"
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
              {name}
            </a>
            <span className="ms-2 score">{score}</span>
            <i className="pi pi-star-fill score ms-1"></i>
          </div>
          <ul>
            <li>
              <ol>
                {wifi > 3 && <li>WIFI</li>}
                <li
                  className={classNames({
                    'display-none': socket === 'no',
                  })}
                >
                  插座
                </li>
                <li
                  className={classNames({
                    'display-none': limited_time === 'yes',
                  })}
                >
                  無限時
                </li>
                <li
                  className={classNames({
                    'display-none': standing_desk === 'no',
                  })}
                >
                  站位
                </li>
              </ol>
            </li>
            <li>
              <i className="pi pi-map-marker me-2"></i>
              <span>{address}</span>
            </li>
            <li
              className={classNames({
                'display-none': !open_time,
              })}
            >
              <i className="pi pi-clock me-2"></i>
              <span>{open_time}</span>
            </li>
            <hr />
            <li
              className={classNames('li-width-50', {
                'display-none': !mrt,
              })}
            >
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
            onClick={searchWithKeyword}
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
        {blockCards}
      </div>
    </>
  );
}

export default SearchElastic;
