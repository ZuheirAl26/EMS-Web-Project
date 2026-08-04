import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationPickerMapProps } from "../../types/locationType";

const DAMASCUS_CENTER: L.LatLngExpression = [33.5138, 36.2765];

export function LocationPickerMap({
  initialCoordinates,
  onLocationSelect,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLatitude = initialCoordinates?.latitude;
  const initialLongitude = initialCoordinates?.longitude;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const hasInitialCoordinates =
      initialLatitude !== undefined && initialLongitude !== undefined;
    const center: L.LatLngExpression = hasInitialCoordinates
      ? [initialLatitude, initialLongitude]
      : DAMASCUS_CENTER;
    const map = L.map(container, {
      center,
      zoom: hasInitialCoordinates ? 15 : 12,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    let marker: L.CircleMarker | null = null;

    const placeMarker = (coordinates: L.LatLngExpression) => {
      if (marker) {
        marker.setLatLng(coordinates);
        return;
      }

      marker = L.circleMarker(coordinates, {
        color: "#ffffff",
        fillColor: "#0d9488",
        fillOpacity: 1,
        radius: 9,
        weight: 3,
      }).addTo(map);
    };

    if (hasInitialCoordinates) {
      placeMarker(center);
    }

    map.on("click", (event: L.LeafletMouseEvent) => {
      placeMarker(event.latlng);
      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    });

    return () => {
      map.remove();
    };
  }, [initialLatitude, initialLongitude, onLocationSelect]);

  return <div className="company-location-picker__map" ref={containerRef} />;
}
