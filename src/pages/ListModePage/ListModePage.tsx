import { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel';
import ConditionalRenderer from '../../components/ConditionalRenderer';
import './ListModePage.scss';
import SearchElastic from '../../containers/SearchElastic';
import useCafeShopsStore, {
  getShops,
  searchWithKeyword,
  setUserLocation,
  autoSelectCityByLocation,
} from '../../store/useCafesStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useParams } from 'react-router-dom';
import SearchForm from '../../components/Search/SearchForm';
import ConditionFilters from '../../components/Search/ConditionFilters';

type Props = {};

export default function ListModePage({}: Props) {
  const { condition } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { coffeeShops } = useCafeShopsStore();
  const { location: userLocation, error: geoError, isLoading: isGeoLoading } = useGeolocation();

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      await getShops();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  // 當用戶位置改變時更新 store 並自動選擇最近的城市
  useEffect(() => {
    if (userLocation && !isGeoLoading) {
      setUserLocation(userLocation);
      autoSelectCityByLocation(userLocation);
    }
  }, [userLocation, isGeoLoading]);

  useEffect(() => {
    searchWithKeyword('', condition);
  }, [coffeeShops, condition, userLocation]);

  return (
    <>
      <ConditionalRenderer isShowContent={isLoading}>
        <div className="loading__overlay d-flex align-items-center align-content-center justify-content-center">
          <div className="spinner-grow" role="status" />
        </div>
      </ConditionalRenderer>
      <Carousel />
      <div className="search-container search-container--shadow d-flex pt-2 pb-2 mb-1 justify-content-center">
        <SearchForm />
      </div>
      <div className="desktop-hide p-2 w-100 d-flex  align-items-center align-content-center justify-content-center border-bottom">
        <ConditionFilters />
      </div>
      <div className="container list-mode">
        <div className="row">
          <div className="col">
            <SearchElastic onChange={(item) => {}} />
          </div>
        </div>
      </div>
    </>
  );
}
