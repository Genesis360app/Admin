//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {GoogleMap, Marker, Circle, Autocomplete,DirectionsRenderer,useJsApiLoader,} from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { TfiLocationArrow, TfiTime } from 'react-icons/tfi';
import { InfinitySpin } from 'react-loader-spinner';


const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null); // Replace 'any' with the appropriate type
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // const originRef = useRef();
  // const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Provide a default value if the environment variable is not defined
    libraries: ['places'],
  });

  useEffect(() => {
    fetchUserShippingAddress();
  }, []);

  const fetchUserShippingAddress = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getShippingAddress.php?userid=${userid}`, {
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      // console.log(res);
      if (res.code === 200) {
        setLatitude(res.payload.latitude);
        setLongitude(res.payload.longitude);
        setLandmark(res.payload.landmark);
        setMapCenter({ lat: parseFloat(res.payload.latitude), lng: parseFloat(res.payload.longitude) });
      } else if (res.code === 401) {
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {

      toast.error(`Error fetching user shipping address: ${error}`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // Handle the error as needed (e.g., show an error message)
    }
  };

  const [mapCenter, setMapCenter] = useState({ lat: 9.6000359, lng: 7.9999721});
  const originRef = useRef(null); // Make sure you initialize the ref properly
  const destinationRef = useRef(null); // Make sure you initialize the ref properly
  const circleRadius = 100;

  if (!isLoaded) {
    return <div>
      <center>
    <InfinitySpin 
  width='200'
  color="#00b09b"
    />
      </center>
  </div>;
  }
  
  async function calculateRoute() {
    if (originRef.current && destinationRef.current) {
      if (originRef.current.value === '' || destinationRef.current.value === '') {
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      if (results.routes && results.routes.length > 0) {
        const route = results.routes[0];
        if (route.legs && route.legs.length > 0) {
          const leg = route.legs[0];
          if (leg.distance && leg.duration) {
            setDirectionsResponse(results);
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);
          }
        }
      }

      // Clear input values after calculating the route
      if (originRef.current) {
        originRef.current.value = '';
      }
      if (destinationRef.current) {
        destinationRef.current.value = '';
      }
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');

    if (originRef.current) {
      originRef.current.value = '';
    }
    if (destinationRef.current) {
      destinationRef.current.value = '';
    }
  }

  

  const blueMarkerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: 'green',
    fillOpacity: 1,
    strokeColor: 'black',
    strokeOpacity: 1,
    strokeWeight: 1,
    scale: 8,
  };

  return (
    <>
      <div className='border-2 p-5 mt-3 border-[#000000] relative h-96'>
        <div className="absolute inset-0">
          {/* Google Map Box */}
          <GoogleMap
            center={mapCenter}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
            onLoad={map => setMap(map)}
          >
            <Marker position={mapCenter}
             icon={blueMarkerIcon}
              />
            <Circle center={mapCenter} radius={circleRadius} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
      {/* Rest of the code */}
    </>
  );
}

export default Map;





