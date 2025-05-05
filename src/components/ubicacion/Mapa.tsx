import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { IUbicacion } from '../interface'
import { mapConfig } from '../../config/map'

const containerStyle = {
  width: '100%',
  height: '400px'
}

interface Props {
  ubicacion: IUbicacion
}

export const Mapa = ({ ubicacion }: Props) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapConfig.googleMapsApiKey,
    libraries: mapConfig.libraries,
    id: mapConfig.id,
    version: mapConfig.version
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
        key={`map-${ubicacion.id}`}
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