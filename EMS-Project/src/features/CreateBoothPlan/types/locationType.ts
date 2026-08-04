export interface HeadquartersCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPickerMapProps {
  initialCoordinates: HeadquartersCoordinates | null;
  onLocationSelect: (coordinates: HeadquartersCoordinates) => void;
}
