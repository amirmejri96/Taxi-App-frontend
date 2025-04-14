// import React, { useState, useEffect } from 'react';
// import {
//   GoogleMap,
//   Marker,
//   DirectionsService,
//   DirectionsRenderer,
// } from '@react-google-maps/api';
// import io from 'socket.io-client';
// import api from '../../services/api';
// import '../../assets/css/trackingMap.css';

// const containerStyle = {
//   width: '100%',
//   height: '400px',
// };

// const center = {
//   lat: 48.8566,
//   lng: 2.3522,
// };

// const socket = io('http://localhost:5000', {
//   auth: {
//     token: localStorage.getItem('token'),
//   },
// });

// const TrackingMap = ({ pickupAddress, dropoffAddress }) => {
//   const [pickupCoords, setPickupCoords] = useState(null);
//   const [dropoffCoords, setDropoffCoords] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [userPosition, setUserPosition] = useState(null);
//   const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });
//   const [mapError, setMapError] = useState(null);
//   const userId = localStorage.getItem('userId') || 'user123';

//   useEffect(() => {
//     if (!window.google?.maps?.Geocoder) {
//       setMapError('Google Maps API non chargée. Vérifiez votre connexion ou la clé API.');
//       console.error('TrackingMap: Google Maps API not loaded');
//       return;
//     }

//     console.log('TrackingMap: Geocoding addresses', { pickupAddress, dropoffAddress });

//     const geocoder = new window.google.maps.Geocoder();

//     const geocodeAddress = (address, setCoords) => {
//       if (!address) return;
//       geocoder.geocode({ address }, (results, status) => {
//         if (status === 'OK') {
//           const { lat, lng } = results[0].geometry.location;
//           setCoords({ lat: lat(), lng: lng() });
//           console.log(`TrackingMap: Geocoded ${address} to`, { lat: lat(), lng: lng() });
//         } else {
//           console.error(`TrackingMap: Geocoding error for ${address}:`, status);
//           setMapError(`Impossible de géocoder ${address}`);
//         }
//       });
//     };

//     geocodeAddress(pickupAddress, setPickupCoords);
//     geocodeAddress(dropoffAddress, setDropoffCoords);
//   }, [pickupAddress, dropoffAddress]);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setMapError('Geolocation non supportée par le navigateur');
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const newPosition = { lat: latitude, lng: longitude };
//         setUserPosition(newPosition);
//         console.log('TrackingMap: Updated user position:', newPosition);

//         try {
//           await api.post('/location/update', {
//             userId,
//             latitude,
//             longitude,
//           });
//         } catch (error) {
//           console.error('TrackingMap: Error sending position:', error);
//         }
//       },
//       (error) => {
//         console.error('TrackingMap: GPS error:', error.message);
//         setMapError('Impossible d’obtenir la position GPS');
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0,
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [userId]);

//   useEffect(() => {
//     socket.on('locationUpdate', (data) => {
//       if (data.userId === userId) {
//         setUserPosition({ lat: data.latitude, lng: data.longitude });
//         console.log('TrackingMap: Received socket location update:', data);
//       }
//     });

//     return () => {
//       socket.off('locationUpdate');
//     };
//   }, [userId]);

//   const directionsCallback = (response) => {
//     if (response !== null && response.status === 'OK') {
//       setDirections(response);
//       const route = response.routes[0].legs[0];
//       setRouteInfo({
//         distance: route.distance.text,
//         duration: route.duration.text,
//       });
//       console.log('TrackingMap: Directions received:', routeInfo);
//     } else {
//       console.error('TrackingMap: Directions error:', response?.status || 'No response');
//       setMapError('Impossible de calculer l’itinéraire');
//     }
//   };

//   if (mapError) {
//     return (
//       <div className="tracking-map-container">
//         <h2>Suivi GPS</h2>
//         <p className="error-message">{mapError}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="tracking-map-container">
//       <h2>Suivi GPS</h2>
//       {routeInfo.distance && (
//         <div className="route-info">
//           <p>Distance : {routeInfo.distance}</p>
//           <p>Durée estimée : {routeInfo.duration}</p>
//         </div>
//       )}
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={userPosition || center}
//         zoom={12}
//       >
//         {pickupCoords && (
//           <Marker position={pickupCoords} title="Point de départ" />
//         )}
//         {dropoffCoords && (
//           <Marker position={dropoffCoords} title="Destination" />
//         )}
//         {userPosition && (
//           <Marker
//             position={userPosition}
//             title="Votre position"
//             icon={{
//               url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
//             }}
//           />
//         )}
//         {pickupCoords && dropoffCoords && (
//           <DirectionsService
//             options={{
//               origin: pickupCoords,
//               destination: dropoffCoords,
//               travelMode: 'DRIVING',
//             }}
//             callback={directionsCallback}
//           />
//         )}
//         {directions && (
//           <DirectionsRenderer
//             options={{
//               directions,
//               suppressMarkers: true,
//             }}
//           />
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default TrackingMap;

import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';
import io from 'socket.io-client';
import api from '../../services/api';
import '../../assets/css/trackingMap.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 36.8065, // Tunis
  lng: 10.1815,
};

const boundsTunisia = {
  north: 37.5,
  south: 30.0,
  west: 7.5,
  east: 11.8,
};

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token'),
  },
});

const TrackingMap = ({ pickupAddress, dropoffAddress }) => {
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });
  const [mapError, setMapError] = useState(null);
  const userId = localStorage.getItem('userId') || 'user123';

  useEffect(() => {
    if (!window.google?.maps?.Geocoder) {
      setMapError('Google Maps API non chargée. Vérifiez votre connexion ou la clé API.');
      console.error('TrackingMap: Google Maps API not loaded');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    const geocodeAddress = (address, setCoords) => {
      if (!address) return;
      geocoder.geocode(
        {
          address,
          componentRestrictions: { country: 'TN' },
        },
        (results, status) => {
          if (status === 'OK') {
            const { lat, lng } = results[0].geometry.location;
            setCoords({ lat: lat(), lng: lng() });
          } else {
            setMapError(`Impossible de géocoder ${address}`);
          }
        }
      );
    };

    geocodeAddress(pickupAddress, setPickupCoords);
    geocodeAddress(dropoffAddress, setDropoffCoords);
  }, [pickupAddress, dropoffAddress]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapError('Geolocation non supportée par le navigateur');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = { lat: latitude, lng: longitude };
        setUserPosition(newPosition);

        try {
          await api.post('/location/update', {
            userId,
            latitude,
            longitude,
          });
        } catch (error) {
          console.error('TrackingMap: Error sending position:', error);
        }
      },
      (error) => {
        setMapError('Impossible d’obtenir la position GPS');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);

  useEffect(() => {
    socket.on('locationUpdate', (data) => {
      if (data.userId === userId) {
        setUserPosition({ lat: data.latitude, lng: data.longitude });
      }
    });

    return () => {
      socket.off('locationUpdate');
    };
  }, [userId]);

  const directionsCallback = (response) => {
    if (response && response.status === 'OK') {
      setDirections(response);
      const route = response.routes[0].legs[0];
      setRouteInfo({
        distance: route.distance.text,
        duration: route.duration.text,
      });
    } else {
      setMapError('Impossible de calculer l’itinéraire');
    }
  };

  if (mapError) {
    return (
      <div className="tracking-map-container">
        <h2>Suivi GPS</h2>
        <p className="error-message">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="tracking-map-container">
      <h2>Suivi GPS</h2>
      {routeInfo.distance && (
        <div className="route-info">
          <p>Distance : {routeInfo.distance}</p>
          <p>Durée estimée : {routeInfo.duration}</p>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPosition || center}
        zoom={7}
        restriction={{
          latLngBounds: boundsTunisia,
          strictBounds: true,
        }}
      >
        {pickupCoords && <Marker position={pickupCoords} title="Point de départ" />}
        {dropoffCoords && <Marker position={dropoffCoords} title="Destination" />}
        {userPosition && (
          <Marker
            position={userPosition}
            title="Votre position"
            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
          />
        )}
        {pickupCoords && dropoffCoords && (
          <DirectionsService
            options={{
              origin: pickupCoords,
              destination: dropoffCoords,
              travelMode: 'DRIVING',
            }}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions,
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default TrackingMap;
