import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { IUbicacionGeneral } from '../interface'

const containerStyle = {
  width: '100%',
  height: '400px'
}

interface Props {
  ubicaciones: IUbicacionGeneral[]
}

export const MapaMultiple = ({ ubicaciones }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_BASE_MAPS_API_KEY as string,
    libraries: ['places', 'geometry']
  })

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [] as google.maps.MapTypeStyle[]
  }

  const getBounds = () => {
    const bounds = new window.google.maps.LatLngBounds()
    ubicaciones.forEach(ubicacion => {
      bounds.extend({
        lat: Number(ubicacion.latitud),
        lng: Number(ubicacion.longitud)
      })
    })
    return bounds
  }

  return isLoaded ? (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        zoom={10}
        onLoad={map => {
          if (ubicaciones.length > 0) {
            const bounds = getBounds()
            map.fitBounds(bounds)
            
            if (ubicaciones.length > 1) {
              map.panBy(0, -50)
            }
          }
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
    <div className="h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
      Cargando mapa...
    </div>
  )
}