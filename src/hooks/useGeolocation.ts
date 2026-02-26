import { useEffect, useState } from 'react';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPrompted, setHasPrompted] = useState<boolean>(false); // 記錄是否已提示過拒絕權限
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false); // 記錄是否被拒絕定位

  useEffect(() => {
    // 內部函式用於請求位置，並在被拒時提示用戶重新授權
    const requestLocation = () => {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          setError(null);
          setIsLoading(false);
        },
        (err) => {
          console.log('地理定位錯誤:', err);
          setIsLoading(false);

          if (err.code === 1) {
            // PERMISSION_DENIED
            setIsPermissionDenied(true);
            if (!hasPrompted) {
              setHasPrompted(true);
              window.alert(
                '定位權限被拒絕，請在瀏覽器設定允許定位後刷新頁面。'
              );
            }
            setError('使用者拒絕定位');
          } else {
            setError(err.message);
          }
        },
        {
          enableHighAccuracy: false, // 使用較不精確的模式以避免高精準耗時
          timeout: 15000,
          maximumAge: 60000, // 允許使用一分鐘內的快取位置
        },
      );
    };

    // 檢查瀏覽器是否支持 Geolocation API
    if (!navigator.geolocation) {
      setError('瀏覽器不支持地理定位');
      return;
    }

    // 首次請求位置
    requestLocation();
  }, []);

  return { location, error, isLoading, isPermissionDenied };
};
