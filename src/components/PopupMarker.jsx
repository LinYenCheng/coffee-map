import React, { useState, useRef, useEffect } from 'react';

function getStars(num) {
  switch (num) {
    case 5:
      return '★★★★★';
    case 4:
      return '★★★★';
    case 3:
      return '★★★';
    case 2:
      return '★★';
    default:
      return '★';
  }
}

const PopupMarker = ({ position, item, isActive, map }) => {
  const { url, name, address, wifi, seat, quiet, tasty, cheap, music } = item;
  const [refReady, setRefReady] = useState(false);
  let popupRef = useRef();

  useEffect(() => {
    if (refReady && isActive) {
      popupRef.openOn(map);
      map.panTo({ lat: position[0], lng: position[1] });
    }
  }, [isActive, refReady, map, position]);
  if (!isActive) return null;

  return (
    <Marker position={{ lat: position[0], lng: position[1] }}>
      <Popup
        ref={(r) => {
          popupRef = r;
          setRefReady(true);
        }}
      >
        <div>
          <span style={{ fontWeight: 800, fontSize: '16px' }}>{name}</span>
          <br />
          <span>
            {address}
            <br />
            {wifi > 0 ? `WIFI穩定: ${getStars(wifi)} ` : ' '}
            {wifi > 0 ? <br /> : ''}
            {seat > 0 ? `通常有位:  ${getStars(seat)} ` : ' '}
            {seat > 0 ? <br /> : ''}
            {quiet > 0 ? `安靜程度:  ${getStars(quiet)} ` : ' '}
            {quiet > 0 ? <br /> : ''}
            {tasty > 0 ? `咖啡好喝:  ${getStars(tasty)} ` : ' '}
            {tasty > 0 ? <br /> : ''}
            {cheap > 0 ? `價格便宜:  ${getStars(cheap)} ` : ' '}
            {cheap > 0 ? <br /> : ''}
            {music > 0 ? `裝潢音樂:  ${getStars(music)} ` : ' '}
            {music > 0 ? <br /> : ''}
          </span>
          {url ? <a href={url}>粉絲專頁</a> : ''}
        </div>
      </Popup>
    </Marker>
  );
};

export default PopupMarker;