export const mapConfig = {
    googleMapsApiKey: import.meta.env.VITE_BASE_MAPS_API_KEY as string,
    libraries: ['places', 'geometry'] as ('places' | 'geometry')[],
    id: 'google-map-script',
    version: 'weekly'
  }