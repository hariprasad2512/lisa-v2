import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.warn("Geolocation warning:", error.message)
      );
    }
  }, []);

  return location;
}