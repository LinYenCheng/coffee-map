import useCafeShopsStore, { toggleConditions } from '../store/useCafesStore';
import { MultiSelect } from 'primereact/multiselect';

import { conditions } from '../constants/config';
import { Condition } from '../types';

function OtherConditions() {
  const { checkedConditions } = useCafeShopsStore();

  const handleConditionToggle = (e: any) => {
    const tempCheckedConditions: Condition[] = [
      ...checkedConditions.map((elm) => ({ ...elm, checked: false })),
    ];
    e.value.forEach((value: string) => {
      const index = tempCheckedConditions.findIndex((elm) => elm.name === value);
      tempCheckedConditions[index].checked = true;
    });
    toggleConditions(tempCheckedConditions);
  };

  const dropdownOptions = conditions.map((condition) => ({
    label: condition.displayName,
    value: condition.name, // Use 'name' for unique values
  }));

  // Selected options based on checked conditions
  const selectedOptions = checkedConditions
    .filter((condition) => condition.checked)
    .map((condition) => condition.name);

  return (
    <MultiSelect
      className="me-2"
      value={selectedOptions} // Set initial selected values
      options={dropdownOptions}
      onChange={handleConditionToggle}
      placeholder="其他"
      maxSelectedLabels={3} // Limit the number of displayed labels
    />
  );
}

export default OtherConditions;
