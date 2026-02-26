import { useParams } from 'react-router-dom';

import useCafeShopsStore, { toggleConditions } from '../store/useCafesStore';
import { MultiSelect } from 'primereact/multiselect';

import { Condition } from '../types';
import { defaultFilterConditions } from '../constants/config';

function OtherConditions() {
  const { condition } = useParams();
  const { cityConditions, filterConditions } = useCafeShopsStore();

  const handleConditionToggle = (e: any) => {
    const tempCheckedConditions: Condition[] = [
      ...filterConditions.map((elm) => ({ ...elm, checked: false })),
    ];
    e.value.forEach((value: string) => {
      const index = tempCheckedConditions.findIndex((elm) => elm.name === value);
      tempCheckedConditions[index].checked = true;
    });
    toggleConditions({ cityConditions, filterConditions: tempCheckedConditions, condition });
  };

  const dropdownOptions = defaultFilterConditions.map((condition) => ({
    label: condition.displayName,
    value: condition.name, // Use 'name' for unique values
  }));

  // Selected options based on checked conditions
  const selectedOptions = filterConditions
    .filter((condition) => condition.checked)
    .map((condition) => condition.name);

  return (
    <MultiSelect
      className="me-2 other-conditions__select"
      style={{ minWidth: '180px' }}
      value={selectedOptions} // Set initial selected values
      options={dropdownOptions}
      onChange={handleConditionToggle}
      placeholder="其他"
    />
  );
}

export default OtherConditions;
