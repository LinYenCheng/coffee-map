import { useRef, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';

import { useParams } from 'react-router-dom';
import { CoffeeShop } from '../../types';
import CoffeeShopFeatureStar from './CoffeeShopFeatureStar';
import ConditionalRenderer from '../ConditionalRenderer';
import CoffeeTag from './CoffeeTag';
import CafeMaker from '../../containers/CafeMaker';
import useCafeShopsStore from '../../store/useCafesStore';
import { calculateDistance } from '../../util/calculateDistance';

interface SearchCardProps {
  item: CoffeeShop;
  onSelect: (item: any) => void;
}

function SearchCard({ item, onSelect }: SearchCardProps) {
  const { condition } = useParams();
  const { name, wifi, seat, quiet, tasty, cheap, music, latitude, longitude } = item;
  const score = ((cheap + music + quiet + seat + tasty + wifi) / 6).toFixed(1);
  const { userLocation } = useCafeShopsStore();

  const toast = useRef<Toast | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedItemInModal, setSelectedItemInModal] = useState<CoffeeShop | null>(null);

  // 計算距離（如果有用戶位置）
  let distance: number | null = null;
  if (userLocation) {
    distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(latitude),
      parseFloat(longitude),
    );
  }

  const isMobile = window.innerWidth < 768;

  const handleCardClick = () => {
    if (isMobile) {
      setShowMapModal(true);
      setSelectedItemInModal(item);
    } else {
      onSelect(item);
    }
  };

  return (
    <>
      <div role="presentation" className="card pt-3 ps-3" onClick={handleCardClick}>
        <div className="card__title d-flex ">
          <div className="flex-grow-1 justify-content-start title">
            <Tooltip target=".a-title" position="bottom" />
            <Toast ref={toast} />
            <a
              data-pr-tooltip={name}
              className="h4 a-title me-2"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(name);
                toast.current?.show({ severity: 'info', summary: name, detail: '已複製到剪貼簿' });
              }}
            >
              {name}
            </a>
            <ConditionalRenderer isShowContent={!!condition && window.innerWidth > 768}>
              <CoffeeTag item={item} />
            </ConditionalRenderer>
          </div>
          <div className="me-3 d-flex align-items-center gap-2">
            {distance !== null && (
              <span className="distance-info" title="距離">
                {distance.toFixed(1)} km
              </span>
            )}
            <span className="ms-2 score">{score}</span>
            <i className="pi pi-star-fill score ms-1" />
          </div>
        </div>
        <CoffeeShopFeatureStar item={item} />
      </div>

      {/* 手機版地圖 Modal */}
      <Dialog
        visible={showMapModal}
        onHide={() => {
          setShowMapModal(false);
          setSelectedItemInModal(null);
        }}
        modal
        header={name}
        maximized
        closable
      >
        {selectedItemInModal && (
          <MapContainer
            center={[parseFloat(latitude), parseFloat(longitude)]}
            zoom={16}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            />
            <CafeMaker
              nowItem={selectedItemInModal}
              isActive
              setSelectItem={setSelectedItemInModal}
            />
            {userLocation && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={20}
                pathOptions={{ color: '#0d6efd', fillColor: '#0d6efd', fillOpacity: 0.7 }}
              />
            )}
          </MapContainer>
        )}
      </Dialog>
    </>
  );
}

export default SearchCard;
