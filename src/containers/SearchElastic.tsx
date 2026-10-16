import { useState, useEffect, useRef } from 'react';

import TagNav from './TagNav';
import SearchCard from '../components/Search/SearchCard';
import ConditionalRenderer from '../components/ConditionalRenderer';

import useCafeShopsStore from '../store/useCafesStore';

import { CoffeeShop } from '../types';

interface SearchElasticProps {
  onChange: (item: CoffeeShop) => void;
  selectedItemId?: string;
  scrollToItemId?: string;
  onScrollToItem?: () => void;
  isPermissionDenied?: boolean;
}

function SearchElastic({
  onChange,
  selectedItemId,
  scrollToItemId,
  onScrollToItem,
  isPermissionDenied = false,
}: SearchElasticProps) {
  const intPageSize = 10;
  const observerTarget = useRef<HTMLDivElement>(null);
  const resultsContainer = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [displayFilterCoffeeShops, setDisplayFilterCoffeeShops] = useState<CoffeeShop[]>([]);

  const { filterCoffeeShops } = useCafeShopsStore();

  useEffect(() => {
    if (!selectedItemId) return;
    const selectedIndex = filterCoffeeShops.findIndex((item) => item.id === selectedItemId);
    if (selectedIndex >= 0) {
      setPage((currentPage) => Math.max(currentPage, Math.floor(selectedIndex / intPageSize) + 1));
    }
  }, [filterCoffeeShops, selectedItemId]);

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
  }, [page, filterCoffeeShops]);

  useEffect(() => {
    if (!scrollToItemId || !displayFilterCoffeeShops.some((item) => item.id === scrollToItemId)) return;

    const animationFrame = window.requestAnimationFrame(() => {
      const container = resultsContainer.current;
      const selectedCard = container?.querySelector<HTMLElement>(
        `[data-coffee-shop-id="${scrollToItemId}"]`,
      );
      if (!container || !selectedCard) return;

      const containerTop = container.getBoundingClientRect().top;
      const stickyBar = container.querySelector<HTMLElement>('.tag__container');
      const controls = container.parentElement?.querySelector<HTMLElement>(
        '.search-container--absolute',
      );
      const stickyBarBottom = stickyBar?.getBoundingClientRect().bottom ?? containerTop;
      const controlsBottom = controls?.getBoundingClientRect().bottom ?? containerTop;
      const visibleTop = Math.max(containerTop, stickyBarBottom, controlsBottom) + 8;
      const cardTop = selectedCard.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + cardTop - visibleTop,
        behavior: 'smooth',
      });
      onScrollToItem?.();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [displayFilterCoffeeShops, scrollToItemId, onScrollToItem]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page + 1 <= totalPage) {
        setPage(page + 1);
      }
    });

    const el = observerTarget.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [page, totalPage]);

  return (
    <div className="search__result" ref={resultsContainer}>
      <div className="tag__container d-flex">
        <span className="tag__title">排列順序</span>
        <TagNav isPermissionDenied={isPermissionDenied} />
      </div>
      <ConditionalRenderer isShowContent={displayFilterCoffeeShops.length > 0}>
        {displayFilterCoffeeShops.map((item) => (
          <SearchCard
            key={item?.id}
            item={item}
            onSelect={onChange}
            isSelected={item.id === selectedItemId}
          />
        ))}
      </ConditionalRenderer>
      <ConditionalRenderer isShowContent={page + 1 <= totalPage}>
        <div className="w-100 text-center mt-3 mb-3" ref={observerTarget}>
          <div className="spinner-border text-secondary" role="status" />
        </div>
      </ConditionalRenderer>
    </div>
  );
}

export default SearchElastic;
