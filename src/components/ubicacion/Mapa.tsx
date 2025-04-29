import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { IUbicacion } from '../interface'

const containerStyle = {
  width: '100%',
  height: '400px'
}

interface Props {
  ubicacion: IUbicacion
}

export const Mapa = ({ ubicacion }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_BASE_MAPS_API_KEY as string,
    libraries: ['places']
  })

  const center = {
    lat: Number(ubicacion.latitud),
    lng: Number(ubicacion.longitud)
  }

  return isLoaded ? (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker 
          position={center}
          title={ubicacion.nombre}
        />
      </GoogleMap>
    </div>
  ) : (
    <div className="h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">
      Cargando mapa...
    </div>
  )
}