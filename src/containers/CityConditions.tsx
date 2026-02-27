import { useParams } from 'react-router-dom';

import { MultiSelect } from 'primereact/multiselect';
import useCafeShopsStore, { toggleConditions } from '../store/useCafesStore';

import { ICity } from '../types';

function CityConditions() {
  const { condition } = useParams();
  const { cityConditions, filterConditions } = useCafeShopsStore();

  const handleConditionToggle = (e: any) => {
    const tempCheckedConditions: ICity[] = [
      ...cityConditions.map((elm) => ({ ...elm, checked: false })),
    ];
    e.value.forEach((value: string) => {
      const index = tempCheckedConditions.findIndex((elm) => elm.name === value);
      tempCheckedConditions[index].checked = true;
    });
    toggleConditions({ cityConditions: tempCheckedConditions, filterConditions, condition });
  };

  const dropdownOptions = cityConditions.map((city) => ({
    label: city.displayName,
    value: city.name, // Use 'name' for unique values
  }));

  // Selected options based on checked conditions
  const selectedOptions = cityConditions.filter((city) => city.checked).map((city) => city.name);

  return (
    <MultiSelect
      className="me-2"
      style={{ minWidth: '84px' }}
      value={selectedOptions} // Set initial selected values
      options={dropdownOptions}
      onChange={handleConditionToggle}
      placeholder="地區"
    />
  );
}

export default CityConditions;
