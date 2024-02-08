import { useState, useEffect } from 'react';
import Carousel from '../../components/Carousel';
import ConditionalRenderer from '../../components/ConditionalRenderer';
import './ListModePage.scss';
import SearchElastic from '../../containers/SearchElastic';
import useCafeShopsStore, { getShops, searchWithKeyword } from '../../store/useCafesStore';
import { conditions } from '../../constants/config';
import { useParams } from 'react-router-dom';

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
  const { coffeeShops, checkedConditions } = useCafeShopsStore();

  const strCheckedConditions = conditions
    .filter((condition, index) => checkedConditions[index].checked)
    .map((condition) => condition.displayName)
    .join(' ');

  const search = async (keyword = '') => {
    const result = await searchWithKeyword({
      coffeeShops,
      keyWord: `${keyword} ${strCheckedConditions}`,
      bounds: false,
    });
    return result;
  };

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
      search(keyword);
    } else {
      search('');
    }
  }, [strCheckedConditions, coffeeShops, condition]);

  return (
    <>
      <ConditionalRenderer isShowContent={isLoading}>
        <div className="loading__overlay d-flex align-items-center align-content-center justify-content-center">
          <div className="spinner-grow" role="status" />
        </div>
      </ConditionalRenderer>
      <Carousel />
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
