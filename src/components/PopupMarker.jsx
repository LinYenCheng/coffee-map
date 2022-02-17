import React, { useState, useRef, useEffect } from 'react';
import { Marker, Popup } from 'react-leaflet';

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
  const nowItem = { ...item };
  if (nowItem) nowItem.openTime = item.open_time;
  const { url, name, address, wifi, seat, quiet, tasty, cheap, music, openTime, mrt } = nowItem;
  const [refReady, setRefReady] = useState(false);
  let popupRef = useRef();

  useEffect(() => {
    if (refReady && isActive) {
      popupRef.openOn(map);
      map.panTo({ lat: position[0], lng: position[1] });
    }
  }, [isActive, refReady, map, position]);
  if (!isActive) return null;

  function renderContentWithStars({ value, msg }) {
    return (
      <>
        {value > 0 ? `${msg}: ${getStars(value)} ` : ' '}
        {value > 0 ? <br /> : ''}
      </>
    );
  }

  function renderContentWithWord({ value, msg }) {
    return (
      <>
        {value !== '' ? `${msg}: ${value} ` : ' '}
        {value !== '' ? <br /> : ''}
      </>
    );
  }

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
            {renderContentWithStars({ msg: 'WIFI穩定', value: wifi })}
            {renderContentWithStars({ msg: '通常有位', value: seat })}
            {renderContentWithStars({ msg: '安靜程度', value: quiet })}
            {renderContentWithStars({ msg: '咖啡好喝', value: tasty })}
            {renderContentWithStars({ msg: '價格便宜', value: cheap })}
            {renderContentWithStars({ msg: '裝潢音樂', value: music })}
            {renderContentWithWord({ msg: '營業時間', value: openTime })}
            {renderContentWithWord({ msg: '鄰近捷運', value: mrt })}
          </span>
          {url ? <a href={url}>粉絲專頁</a> : ''}
        </div>
      </Popup>
    </Marker>
  );
};

export default PopupMarker;
