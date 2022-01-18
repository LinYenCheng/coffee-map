
// Deprecated
// import React, { useState, useEffect } from 'react';
// import Autocomplete from 'react-autocomplete';

// import PropTypes from 'prop-types';

// function Search({ items, onChange }) {
//   const [value, setValue] = useState('');
//   const [isMobile, setIsMobile] = useState(false);

//   const styles = {
//     item: {
//       padding: '2px 6px',
//       cursor: 'default',
//     },

//     highlightedItem: {
//       color: 'white',
//       padding: '2px 6px',
//       cursor: 'default',
//     },

//     menu: {
//       maxWidth: '300px',
//       border: 'solid 1px #ccc',
//     },
//   };

//   function matchCoffeeToTerm(poi, nowValue) {
//     return (
//       poi.name.toLowerCase().indexOf(nowValue.toLowerCase()) !== -1 ||
//       poi.address.toLowerCase().indexOf(nowValue.toLowerCase()) !== -1 ||
//       poi.id.toLowerCase().indexOf(nowValue.toLowerCase()) !== -1 ||
//       (nowValue === '插座' && poi.socket === 'yes')
//     );
//   }

//   function sortCoffees(a, b, nowValue) {
//     return a.name.toLowerCase().indexOf(nowValue.toLowerCase()) >
//       b.name.toLowerCase().indexOf(nowValue.toLowerCase())
//       ? 1
//       : -1;
//   }

//   function handleSelect(nowValue, item) {
//     setValue(nowValue);
//     onChange(item);
//   }

//   useEffect(() => {
//     if (window && window.innerWidth < 500 && !isMobile) {
//       setIsMobile(true);
//     }
//   }, [isMobile]);

//   return (
//     <>
//       <Autocomplete
//         value={value}
//         inputProps={{
//           name: 'Coffee',
//           id: 'Coffee-autocomplete',
//           placeholder: '輸入店名、地址、插座',
//         }}
//         menuStyle={{
//           borderRadius: '3px',
//           boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
//           background: 'rgba(255, 255, 255, 0.9)',
//           padding: '2px 0',
//           fontSize: '90%',
//           position: 'fixed',
//           overflow: 'auto',
//           maxWidth: isMobile ? '300px' : '360px',
//           maxHeight: 'calc( 100vh - 70px )',
//         }}
//         items={items}
//         getItemValue={(item) => item.name}
//         shouldItemRender={matchCoffeeToTerm}
//         sortItems={sortCoffees}
//         onChange={(event, nowValue) => {
//           setValue(nowValue);
//         }}
//         onSelect={handleSelect}
//         renderItem={(item, isHighlighted) => (
//           <div
//             className="card"
//             style={isHighlighted ? styles.highlightedItem : styles.item}
//             key={item.id}
//           >
//             <h4>{item.name}</h4>
//             <ul>
//               <li>
//                 <ol>
//                   {item.limited_time === 'no' ? <li>無限時</li> : ''}
//                   {item.socket !== '' || item.socket !== 'no' ? <li>插座</li> : ''}
//                   {item.wifi > 3 ? <li>WIFI</li> : ''}
//                   {item.quiet > 3 ? <li>較安靜</li> : ''}
//                   {item.cheap > 3 ? <li>較便宜</li> : ''}
//                 </ol>
//               </li>
//               <li>{`地址:${item.address}`}</li>
//               {item.open_time ? <li>{`營業時間: ${item.open_time}`}</li> : ''}
//               <li>
//                 <a href={item.url}>粉絲專頁</a>
//               </li>
//             </ul>
//           </div>
//         )}
//       />
//       <button type="button" className="btn search__button">
//         <svg viewBox="0 0 100 100">
//           <circle id="circle" cx="45" cy="45" r="30" />
//           <path id="line" d="M45,45 L100,100" />
//         </svg>
//       </button>
//     </>
//   );
// }

// Search.propTypes = {
//   onChange: PropTypes.func.isRequired,
// };

// export default Search;
