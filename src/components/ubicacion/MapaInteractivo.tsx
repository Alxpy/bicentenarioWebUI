import React, { useRef, useState } from 'react'
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
    Autocomplete
} from '@react-google-maps/api'
import { iUbicacionCreate } from '../interface'

const containerStyle = {
    width: '100%',
    height: '400px'
}

const center = { lat: -16.5, lng: -68.15 }

export const MapaInteractivo = () => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_BASE_MAPS_API_KEY as string,
        libraries: ['places']
    })

    const [ubicacion, setUbicacion] = useState<iUbicacionCreate | null>(null)
    const [mensaje, setMensaje] = useState('')
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null)
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const mapRef = useRef<google.maps.Map | null>(null)
    const geocoder = useRef<google.maps.Geocoder | null>(null)
    const [guardarPendiente, setGuardarPendiente] = useState(false)
    const [showImageDialog, setShowImageDialog] = useState(false)

    const guardarUbicacion = async (ubicacion: iUbicacionCreate) => {
        console.log('Ubicación guardada:', ubicacion)
    }

    

    const actualizarDireccion = async (lat: number, lng: number) => {
        if (!geocoder.current) geocoder.current = new window.google.maps.Geocoder()

        geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
                if (inputRef.current) {
                    inputRef.current.value = results[0].formatted_address || ''
                }
                setUbicacion(prev => ({
                    ...prev!,
                    descripcion: results[0].formatted_address || '',
                    latitud: lat,
                    longitud: lng,
                    imagen: `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&key=${import.meta.env.VITE_BASE_MAPS_API_KEY}`
                }))
            }
        })
    }

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setMarker({ lat, lng })
        actualizarDireccion(lat, lng)
    }

    const onDragEnd = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setMarker({ lat, lng })
        actualizarDireccion(lat, lng)
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()

            if (!place.geometry?.location) {
                setMensaje('❌ Ubicación no válida')
                return
            }

            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()

            setMarker({ lat, lng })
            actualizarDireccion(lat, lng)
            setUbicacion(prev => ({
                ...prev!,
                nombre: place.name || '',
                descripcion: place.formatted_address || ''
            }))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUbicacion(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const handleGuardar = async () => {
        if (!ubicacion) {
            setMensaje('❌ Primero selecciona una ubicación')
            return
        }

        // Verificar si existe imagen
        if (!ubicacion.imagen) {
            setGuardarPendiente(true)
            setShowImageDialog(true)
            return
        }

        // Si ya tiene imagen, guardar directamente
        try {
            await guardarUbicacion(ubicacion)
            setMensaje('✅ Ubicación guardada con éxito')
        } catch (error) {
            setMensaje('❌ Error al guardar la ubicación')
        }
    }

    return isLoaded ? (
        <div className='bg-slate-500 flex flex-col items-center justify-center w-full h-full p-4 gap-4'>
            <div className="w-full max-w-2xl">
                <Autocomplete
                    onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete
                        autocomplete.setFields(['geometry', 'name', 'formatted_address'])
                    }}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar ubicación"
                        className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Autocomplete>
            </div>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={marker ?? center}
                zoom={15}
                onClick={onMapClick}
                onLoad={map => {
                    mapRef.current = map;
                }}
            >
                {marker && (
                    <Marker
                        position={marker}
                        draggable={true}
                        onDragEnd={onDragEnd}
                    />
                )}
            </GoogleMap>

            {ubicacion && (
                <div className="w-full max-w-2xl space-y-4">
                    <div>
                        <label className="block mb-2 font-medium">Nombre:</label>
                        <input
                            name="nombre"
                            value={ubicacion.nombre}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Descripción:</label>
                        <input
                            name="descripcion"
                            value={ubicacion.descripcion}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">Latitud:</label>
                            <input
                                value={ubicacion.latitud}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Longitud:</label>
                            <input
                                value={ubicacion.longitud}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                    </div>

                    {ubicacion.imagen && (
                        <div>
                            <label className="block mb-2 font-medium">Vista previa:</label>
                            <img
                                src={ubicacion.imagen}
                                alt="Street View"
                                className="w-full h-48 object-cover rounded-lg border"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleGuardar}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        Guardar ubicación
                    </button>
                </div>
            )}

            {mensaje && (
                <div className={`mt-4 p-3 rounded-lg ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {mensaje}
                </div>
            )}
        </div>
    ) : (
        <p>Cargando mapa...</p>
    )
}