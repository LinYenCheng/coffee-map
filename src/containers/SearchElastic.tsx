import { useState, useEffect, useRef } from 'react';

import TagNav from './TagNav';
import SearchCard from '../components/SearchCard';
import ConditionalRenderer from '../components/ConditionalRenderer';

import useCafeShopsStore from '../store/useCafesStore';

import { CoffeeShop } from '../types';

interface SearchElasticProps {
  onChange: (item: CoffeeShop) => void;
}

function SearchElastic({ onChange }: SearchElasticProps) {
  const intPageSize = 10;
  const observerTarget = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [displayFilterCoffeeShops, setDisplayFilterCoffeeShops] = useState<CoffeeShop[]>([]);

  const { filterCoffeeShops } = useCafeShopsStore();

  const totalPage =
    filterCoffeeShops && filterCoffeeShops.length
      ? Math.ceil(filterCoffeeShops.length / intPageSize)
      : 0;

  useEffect(() => {
    if (filterCoffeeShops.length > 0) {
      setDisplayFilterCoffeeShops(filterCoffeeShops.slice(0, intPageSize * page));
    } else {
      setDisplayFilterCoffeeShops([]);
    }
  }, [filterCoffeeShops, page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page + 1 <= totalPage) {
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
  }, [observerTarget, page, totalPage]);

  return (
    <div className="search__result">
      <div className="tag__container">
        <span className="tag__title">排列順序</span>
        <TagNav />
      </div>
      <ConditionalRenderer isShowContent={displayFilterCoffeeShops.length > 0}>
        {displayFilterCoffeeShops.map((item) => (
          <SearchCard key={item?.id} item={item} onSelect={onChange} />
        ))}
      </ConditionalRenderer>
      <ConditionalRenderer isShowContent={page + 1 <= totalPage}>
        <div className="w-100 text-center mt-3 mb-3" ref={observerTarget}>
          <div className="spinner-border text-secondary" role="status"></div>
        </div>
      </ConditionalRenderer>
    </div>
  );
}

export default SearchElastic;
