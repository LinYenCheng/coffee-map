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

  useEffect(() => {
    // 檢查瀏覽器是否支持 Geolocation API
    if (!navigator.geolocation) {
      setError('瀏覽器不支持地理定位');
      return;
    }

    setIsLoading(true);

    // 獲取用戶位置
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
        console.log('地理定位錯誤:', err.message);
        setError(err.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  return { location, error, isLoading };
};
