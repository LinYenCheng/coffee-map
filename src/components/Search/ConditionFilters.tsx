import CityConditions from '../../containers/CityConditions';
import OtherConditions from '../../containers/OtherConditions';

type Props = {};

export default function ConditionFilters({}: Props) {
  return (
    <>
      <CityConditions />
      <OtherConditions />
    </>
  );
}
