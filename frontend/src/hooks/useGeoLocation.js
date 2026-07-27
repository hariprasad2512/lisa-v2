import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState(null);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          console.warn("Geolocation warning:", error.message);
          resolve(null);
        }
      );
    });
  }, []);

  return { location, requestLocation };
}
