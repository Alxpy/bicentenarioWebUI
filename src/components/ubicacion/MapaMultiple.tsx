import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { IUbicacionGeneral } from '../interface'
import { useCallback, useRef } from 'react'
import { mapConfig } from '../../config/map'
const containerStyle = {
  width: '100%',
  height: '400px'
}

interface Props {
  ubicaciones: IUbicacionGeneral[]
  onClick?: (id: number) => void
}

const libraries: ("places" | "geometry")[] = ['places', 'geometry']

export const MapaMultiple = ({ ubicaciones, onClick }: Props) => {
  const mapRef = useRef<google.maps.Map | null>(null)
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapConfig.googleMapsApiKey,
    libraries: mapConfig.libraries,
    id: mapConfig.id,
    version: mapConfig.version
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    const bounds = new window.google.maps.LatLngBounds()
    ubicaciones.forEach(ubicacion => {
      bounds.extend({
        lat: Number(ubicacion.latitud),
        lng: Number(ubicacion.longitud)
      })
    })
    map.fitBounds(bounds)
  }, [ubicaciones])

  return isLoaded ? (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true
        }}
      >
        {ubicaciones.map((ubicacion, index) => (
          <Marker
            key={`${ubicacion.id}-${index}`}
            position={{
              lat: Number(ubicacion.latitud),
              lng: Number(ubicacion.longitud)
            }}
            title={ubicacion.nombre}
            onClick={() => onClick?.(ubicacion.id)}
            label={{
              text: (index + 1).toString(),
              color: '#FFFFFF',
              fontWeight: 'bold'
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              labelOrigin: new google.maps.Point(11, 12)
            }}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
      Cargando mapa...
    </div>
  )
}