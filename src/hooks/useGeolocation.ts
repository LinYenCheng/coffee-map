import { useCallback, useEffect, useState } from 'react';

// The original UserLocation interface
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const defaultOptions: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};

export const useGeolocation = (options: Partial<PositionOptions> = defaultOptions) => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setError(null);
    setIsLoading(false);
    setIsPermissionDenied(false);
  }, []);

  const updateError = useCallback((err: GeolocationPositionError) => {
    if (err.code === 1) {
      setError('使用者拒絕定位');
      setIsPermissionDenied(true);
    } else {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const isSupported =
      typeof navigator !== 'undefined' && typeof navigator.geolocation !== 'undefined';

    if (!isSupported) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    // Get a quick initial position
    navigator.geolocation.getCurrentPosition(updatePosition, updateError, options);

    const watchId = navigator.geolocation.watchPosition(updatePosition, updateError, options);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, updateError, updatePosition]);

  return { location, error, isLoading, isPermissionDenied };
};
