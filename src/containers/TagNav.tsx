import useCafeShopsStore, { toggleSortConditions } from '../store/useCafesStore';

import '../styles/menu-nav.css';

import { defaultSortConditions } from '../constants/config';
import { Condition } from '../types';

interface TagNavProps {
  isPermissionDenied?: boolean;
}

function TagNav({ isPermissionDenied = false }: TagNavProps) {
  const { sortConditions } = useCafeShopsStore();

  const handleConditionToggle = (index: number) => {
    const tempsortConditions: Condition[] = [
      ...sortConditions.map((elm) => ({ ...elm, checked: false })),
    ];
    tempsortConditions[index].checked = !sortConditions[index].checked;
    toggleSortConditions(tempsortConditions);
  };

  const blockConditionList = defaultSortConditions
    .map((condition, index) => {
      // 如果定位被拒絕且是距離選項，就隱藏
      if (isPermissionDenied && condition.name === 'distance') {
        return null;
      }
      return (
        <li className="nav__li" key={condition.name}>
          <input
            id={condition.name}
            type="checkbox"
            checked={sortConditions[index].checked}
            onChange={() => handleConditionToggle(index)}
          />
          <label htmlFor={condition.name} className="nav__label nav__label--condition">
            {condition.displayName}
          </label>
        </li>
      );
    })
    .filter(Boolean); // 過濾掉 null 值

  return <ul className="ms-2 mb-0 ps-0">{blockConditionList}</ul>;
}

export default TagNav;
