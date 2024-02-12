import { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel';
import ConditionalRenderer from '../../components/ConditionalRenderer';
import './ListModePage.scss';
import SearchElastic from '../../containers/SearchElastic';
import useCafeShopsStore, { getShops, searchWithKeyword } from '../../store/useCafesStore';
import { useParams } from 'react-router-dom';
import SearchForm from '../../components/Search/SearchForm';

type Props = {};
interface IConditionMap {
  'no-limited-time': string;
  'remote-work': string;
}
const NO_LIMITED_TIME = 'no-limited-time';
const REMOTE_WORK = 'remote-work';

type ConditionType = typeof NO_LIMITED_TIME | typeof REMOTE_WORK;

const objCondition: IConditionMap = {
  'no-limited-time': '不限時',
  'remote-work': '插座 網路',
};

export default function ListModePage({}: Props) {
  const { condition } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { coffeeShops, filterConditions } = useCafeShopsStore();

  useEffect(() => {
    async function getCoffee() {
      setIsLoading(true);
      await getShops();
      setIsLoading(false);
    }
    getCoffee();
  }, []);

  useEffect(() => {
    if (condition) {
      const keyword = objCondition[condition as ConditionType];
      searchWithKeyword(keyword, condition);
    } else {
      searchWithKeyword('', condition);
    }
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
