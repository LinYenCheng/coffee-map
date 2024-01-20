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

function PopupContent({ item }) {
  if (!item) return <></>;
  const { url, name, address, wifi, seat, quiet, tasty, cheap, music, limited_time } = item;
  return (
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
        {limited_time === 'no' && <span>不限時</span>}
      </span>
      {url ? <a href={url}>粉絲專頁</a> : ''}
    </div>
  );
}

export default PopupContent;
