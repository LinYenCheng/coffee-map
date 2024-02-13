import { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel';
import ConditionalRenderer from '../../components/ConditionalRenderer';
import './ListModePage.scss';
import SearchElastic from '../../containers/SearchElastic';
import useCafeShopsStore, { getShops, searchWithKeyword } from '../../store/useCafesStore';
import { useParams } from 'react-router-dom';
import SearchForm from '../../components/Search/SearchForm';

type Props = {};

export default function ListModePage({}: Props) {
  const { condition } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { coffeeShops } = useCafeShopsStore();

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      await getShops();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  useEffect(() => {
    searchWithKeyword('', condition);
  }, [coffeeShops, condition]);

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
