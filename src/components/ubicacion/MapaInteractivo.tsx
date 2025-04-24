import React, { useRef, useState, ChangeEvent } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { iUbicacionCreate } from '../interface';
import { Button } from '../ui';
import { apiService } from '@/service/apiservice';

// Configuración del mapa
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = { lat: -16.5, lng: -68.15 };

export const MapaInteractivo = ({onSucces}:{onSucces?:() => void}) => {
  // Estados del mapa y ubicación
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_BASE_MAPS_API_KEY as string,
    libraries: ['places']
  });

  const [ubicacion, setUbicacion] = useState<iUbicacionCreate | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [mensaje, setMensaje] = useState('');

  // Estados para gestión de imágenes
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [modoImagen, setModoImagen] = useState<'url' | 'archivo'>('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const [archivoTemporal, setArchivoTemporal] = useState<File | null>(null);
  const [imagenTemporal, setImagenTemporal] = useState('');
  const [urlTemporal, setUrlTemporal] = useState('');

  // Referencias
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // Función para guardar la ubicación
  const guardarUbicacion = async (ubicacion: iUbicacionCreate) => {
    
      // Aquí iría la lógica real para guardar la ubicación
      console.log('Ubicación guardada:', ubicacion, urlTemporal);
      await apiService.post('location',ubicacion).then((res) => {
        console.log(res)
        localStorage.setItem('ubicacion', JSON.stringify(res.data));
        setMensaje('✅ Ubicación guardada con éxito');
        onSucces && onSucces();
      }).catch( (error) => {
      console.error('Error al guardar ubicación:', error);
      setMensaje('❌ Error al guardar la ubicación');
    });
  };

  // Función para subir imagen al servidor
  const uploadImage = async () => {
    if (!archivoTemporal) {
      console.error('No file selected to upload.');
      return;
    }

    try {
      const imageFormData = new FormData();
      imageFormData.append('file', archivoTemporal);
      
      const response: any = await apiService.postFiles(
        'files/upload?max_file_size=10485760', 
        imageFormData
      );
      
      setUrlTemporal(response.data.file_url);
      setUbicacion(prev => ({
        ...prev!,
        imagen: response.data.file_url
      }));
      
      setShowImageDialog(false);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setMensaje('❌ Error al subir la imagen');
    }
  };

  // Actualiza la dirección basada en coordenadas
  const actualizarDireccion = async (lat: number, lng: number, name?: string) => {
    if (!geocoder.current) {
      geocoder.current = new window.google.maps.Geocoder();
    }

    geocoder.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        if (inputRef.current) {
          inputRef.current.value = results[0].formatted_address || '';
        }
        
        setUbicacion(prev => ({
          ...prev!,
          nombre: name || results[0].formatted_address || '',
          latitud: lat,
          longitud: lng,
          imagen: `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&key=${import.meta.env.VITE_BASE_MAPS_API_KEY}`
        }));
      }
    });
  };

  // Manejadores de eventos del mapa
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    actualizarDireccion(lat, lng);
  };

  const onDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    actualizarDireccion(lat, lng);
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry?.location) {
      setMensaje('❌ Ubicación no válida');
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const nombre = place.name;
    
    setMarker({ lat, lng });
    actualizarDireccion(lat, lng, nombre);
  };

  // Manejadores de formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUbicacion(prev => ({
      ...prev!,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoTemporal(file);
      setImagenTemporal('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGuardar = async () => {
    if (!ubicacion) {
      setMensaje('❌ Primero selecciona una ubicación');
      return;
    }

    if (!ubicacion.imagen) {
      setShowImageDialog(true);
      return;
    }

    await guardarUbicacion(ubicacion);
  };

  // Renderizado condicional mientras carga el mapa
  if (!isLoaded) {
    return <p>Cargando mapa...</p>;
  }

  return (
    <div className='bg-slate-500 flex flex-col items-center justify-center w-full h-full p-4 gap-4'>
      {/* Barra de búsqueda */}
      <div className="w-full max-w-2xl">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
            autocomplete.setFields(['geometry', 'name', 'formatted_address']);
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

      {/* Mapa interactivo */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker ?? center}
        zoom={15}
        onClick={onMapClick}
        onLoad={map => { mapRef.current = map; }}
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
          {/* Formulario de ubicación */}
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
                className="w-full p-2 border rounded bg-gray-800"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Longitud:</label>
              <input
                value={ubicacion.longitud}
                readOnly
                className="w-full p-2 border rounded bg-gray-800"
              />
            </div>
          </div>

          {/* Sección de gestión de imágenes */}
          <ImageSection 
            ubicacion={ubicacion}
            showImageDialog={showImageDialog}
            setShowImageDialog={setShowImageDialog}
            modoImagen={modoImagen}
            setModoImagen={setModoImagen}
            previewUrl={previewUrl}
            imagenTemporal={imagenTemporal}
            setImagenTemporal={setImagenTemporal}
            setPreviewUrl={setPreviewUrl}
            handleFileChange={handleFileChange}
            uploadImage={uploadImage}
            archivoTemporal={archivoTemporal}
          />

          {/* Botón de guardar */}
          <button
            onClick={handleGuardar}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Guardar ubicación
          </button>
        </div>
      )}

      {/* Mensajes de estado */}
      {mensaje && (
        <div className={`mt-4 p-3 rounded-lg ${mensaje.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

// Componente separado para la sección de imágenes
const ImageSection = ({
  ubicacion,
  showImageDialog,
  setShowImageDialog,
  modoImagen,
  setModoImagen,
  previewUrl,
  imagenTemporal,
  setImagenTemporal,
  setPreviewUrl,
  handleFileChange,
  uploadImage,
  archivoTemporal
}: any) => {
  return (
    <div className="space-y-4">
      {/* Vista previa de la imagen existente */}
      <Button onClick={() => setShowImageDialog(true)}>
        {ubicacion.imagen ? 'Cambiar Imagen' : 'Agregar Imagen'}
      </Button>

      {!showImageDialog && ubicacion.imagen && (
        <div>
          <label className="block mb-2 font-medium">Vista previa actual:</label>
          <img
            src={ubicacion.imagen}
            alt="Street View"
            className="w-full h-48 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Diálogo para selección de imagen */}
      {showImageDialog && (
        <>
          <h2 className="text-xl font-bold border-b pb-2">Imagen de la ubicación</h2>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${modoImagen === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-500 border border-gray-300'}`}
              onClick={() => setModoImagen('url')}
            >
              Usar URL
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${modoImagen === 'archivo' ? 'bg-blue-600 text-white' : 'bg-slate-500 border border-gray-300'}`}
              onClick={() => setModoImagen('archivo')}
            >
              Subir Archivo
            </button>
          </div>

          {modoImagen === 'url' && (
            <div>
              <label className="block mb-2 font-medium">URL de la Imagen</label>
              <input
                name="imagen"
                value={imagenTemporal}
                onChange={(e) => {
                  setImagenTemporal(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {modoImagen === 'archivo' && (
            <div>
              <label className="block mb-2 font-medium">Subir Archivo de Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {previewUrl && (
            <div className="mt-4">
              <label className="block mb-2 font-medium">Vista Previa:</label>
              <img
                src={previewUrl}
                alt="Vista previa"
                className="mt-2 rounded-lg shadow-md max-h-48 w-full object-cover border"
              />
            </div>
          )}

          {(imagenTemporal || archivoTemporal) && (
            <button
              onClick={uploadImage}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Confirmar Imagen
            </button>
          )}
        </>
      )}
    </div>
  );
};