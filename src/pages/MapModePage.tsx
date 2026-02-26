import { useState, useEffect, useRef } from 'react';

import CafeMap from '../containers/CafeMap';
import SearchElastic from '../containers/SearchElastic';
import SearchForm from '../components/Search/SearchForm';
import ConditionalRenderer from '../components/ConditionalRenderer';

import useCafeShopsStore, {
  getShops,
  searchWithKeyword,
  setUserLocation,
  autoSelectCityByLocation,
} from '../store/useCafesStore';
import { useGeolocation } from '../hooks/useGeolocation';

import ConditionFilters from '../components/Search/ConditionFilters';
import { CoffeeShop } from '../types';
import { DISABLE_CLUSTER_LEVEL } from '../constants/config';
import ErrorBoundary from '../components/ErrorBoundary';

function MapModePage() {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectItem, setSelectItem] = useState<any>(null);
  const { coffeeShops, cityConditions } = useCafeShopsStore();
  const { location: userLocation, error: geoError, isLoading: isGeoLoading } = useGeolocation();

  const [initialPosition, setInitialPosition] = useState<{ lat: number; lng: number }>({
    lat: 25.08,
    lng: 121.5598,
  });

  const handleSelect = (item: CoffeeShop) => {
    const map = mapRef.current as any;

    if (!map) {
      return;
    }

    if (item) {
      map.setView(
        { lng: parseFloat(item.longitude), lat: parseFloat(item.latitude) },
        map.getZoom() >= DISABLE_CLUSTER_LEVEL ? map.getZoom() : DISABLE_CLUSTER_LEVEL,
      );
    }
    setTimeout(() => {
      setSelectItem(item);
    }, 250);
  };

  // 初始化咖啡店數據
  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      await getShops();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  // 計算初始地圖中心點：優先用 GPS，否則 localStorage，最後用已選城市
  useEffect(() => {
    let pos = { lat: 25.08, lng: 121.5598 };
    const lastCenter = localStorage.getItem('lastCenter');
    if (lastCenter) {
      try {
        pos = JSON.parse(lastCenter);
      } catch {
        // ignore parse error
      }
    }

    if (userLocation) {
      pos = { lat: userLocation.latitude, lng: userLocation.longitude };
    } else if (geoError) {
      // 若有錯誤且為拒絕定位，已經沒有 userLocation
      // 使用 lastCenter 或所選城市
      if (!lastCenter) {
        const checkedCity = cityConditions.find((c) => c.checked);
        if (checkedCity) {
          pos = { lat: checkedCity.lat, lng: checkedCity.lng };
        }
      }
    }

    setInitialPosition(pos);
  }, [userLocation, geoError, cityConditions]);

  // 當用戶位置改變時更新 store 並自動選擇最近的城市，並移動地圖中心點
  useEffect(() => {
    if (userLocation && !isGeoLoading) {
      setUserLocation(userLocation);
      autoSelectCityByLocation(userLocation);

      // 移動地圖中心點到用戶位置
      const map = mapRef.current as any;
      if (map) {
        map.setView(
          { lng: userLocation.longitude, lat: userLocation.latitude },
          map.getZoom() >= DISABLE_CLUSTER_LEVEL ? map.getZoom() : DISABLE_CLUSTER_LEVEL,
        );
      }
    }
  }, [userLocation, isGeoLoading]);

  // 當咖啡店加載或用戶位置改變時更新搜索結果
  useEffect(() => {
    searchWithKeyword('');
  }, [coffeeShops, userLocation]);

  return (
    <>
      <ConditionalRenderer isShowContent={isLoading}>
        <div className="loading__overlay d-flex align-items-center align-content-center justify-content-center">
          <div className="spinner-grow" role="status" />
        </div>
      </ConditionalRenderer>
      <div className="container-fluid map-mode">
        <div className="row">
          <div className="col-md-4 col-sm-12 result__container p-0">
            <div className="search-container search-container--absolute">
              <SearchForm />
            </div>
            <div className="desktop-hide p-2 w-100 d-flex  align-items-center align-content-center justify-content-center border-bottom">
              <ConditionFilters />
            </div>
            <ErrorBoundary>
              <SearchElastic onChange={handleSelect} />
            </ErrorBoundary>
          </div>
          <ConditionalRenderer isShowContent={window.innerWidth > 768}>
            <div className="col-md-8 col-sm-12 map__container p-0">
              <ConditionalRenderer isShowContent={coffeeShops.length > 0}>
                <ErrorBoundary>
                  <CafeMap
                    position={{ lng: initialPosition.lng, lat: initialPosition.lat }}
                    selectItem={selectItem}
                    setSelectItem={handleSelect}
                    ref={mapRef}
                  />
                </ErrorBoundary>
              </ConditionalRenderer>
            </div>
          </ConditionalRenderer>
        </div>
      </div>
    </>
  );
}

export default MapModePage;
