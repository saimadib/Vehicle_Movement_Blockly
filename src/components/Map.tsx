import { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';

const Map = () => {
  
  // Load the Google Maps API with the necessary libraries
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
    libraries: ["geometry"], 
  });

  // State hooks for managing map data and vehicle state
  const [directions, setDirections] = useState<any>(null); // Store the directions fetched from Google Maps
  const [vehiclePosition, setVehiclePosition] = useState<{ lat: number; lng: number } | null>(null); // Current vehicle position on the map
  const [routePoints, setRoutePoints] = useState<{ lat: number; lng: number }[]>([]); // Points representing the route
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Angle for rotating vehicle marker
  const [origin, setOrigin] = useState<string>('Dhigori, Nagpur'); // Default origin
  const [destination, setDestination] = useState<string>('Wadi, Nagpur'); // Default destination
  const [speed, setSpeed] = useState<number>(10); // Speed for vehicle movement
  const [journeyComplete, setJourneyComplete] = useState<boolean>(false); // Tracks whether the journey has completed

  // Minimum interval for updating vehicle position (1000ms = 1 second)
  const minInterval = 1000;

  /**
   * Fetch directions from Google Maps API based on the origin and destination.
   * The result contains the entire route and is used to move the vehicle on the map.
   */
  const fetchDirections = async (origin: string, destination: string) => {
    
    // Check if Google Maps API is loaded in the browser
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();

      // Make a directions request to the Google Maps Directions API
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING, // Set the mode to driving
        },
        (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
          
          // If the request is successful, set the directions and initialize vehicle position
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result); // Save the directions result
            setVehiclePosition({
              lat: result.routes[0].legs[0].start_location.lat(),
              lng: result.routes[0].legs[0].start_location.lng(),
            });

            // Decode the polyline points into latitude and longitude coordinates
            const points: { lat: number; lng: number }[] = []; // Initialize array for route points
            result.routes[0].legs[0].steps.forEach(step => {
              
              if (step.encoded_lat_lngs) {
                const decodedPath = google.maps.geometry.encoding.decodePath(step.encoded_lat_lngs);
                decodedPath.forEach(point => {
                  points.push({ lat: point.lat(), lng: point.lng() });
                });
              }
            });
            setRoutePoints(points); 
            setJourneyComplete(false); 
          } else {
            console.error('Error fetching directions: ', result); 
          }
        }
      );
    } else {
      console.error("Google Maps API is not loaded"); 
    }
  };

  /**
   * This useEffect hook animates the vehicle along the route.
   * It updates the vehicle's position at intervals based on the route points.
   */
  useEffect(() => {

    if (routePoints.length > 0) {
      let pointIndex = 0; 
      let previousPosition = routePoints[0]; 
      const intervalTime = speed > 0 ? minInterval / speed : 60000;

      // Interval to move the vehicle along the route
      const interval = setInterval(() => {
        if (pointIndex < routePoints.length) {
          const newPosition = routePoints[pointIndex]; // Get the new position from the route
          const angle = window.google.maps.geometry.spherical.computeHeading(
            previousPosition,
            newPosition
          ); 
          
          setRotationAngle(angle);
          setVehiclePosition(newPosition); 
          previousPosition = newPosition; 
          pointIndex++; 
        } else {
          setJourneyComplete(true);
          clearInterval(interval); 
        }
      }, intervalTime);

      // Cleanup the interval when component unmounts or points change
      return () => clearInterval(interval);
    }
  }, [routePoints, speed]);

  /**
   * Handle form submission to fetch new directions based on the entered origin and destination.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 

    // Clear previous journey data before starting a new one
    setDirections(null);
    setVehiclePosition(null);
    setRoutePoints([]);
    setRotationAngle(0);
    setJourneyComplete(false);

    if (origin && destination) {
      fetchDirections(origin, destination); // Fetch new directions
    }
  };

  if (!isLoaded) return <div>Loading...</div>; 

  return (
    <>
      {/* Form for setting origin, destination, and speed */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>
            Origin:
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin"
            />
          </label>
        </div>
        <div>
          <label>
            Destination:
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="Enter destination"
            />
          </label>
        </div>
        <div>
          <label>
            Speed (1-50):
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} 
              placeholder="Speed (higher = faster)"
              min="1"
              max="50"
            />
          </label>
        </div>
        <button type="submit">Start</button>
      </form>

      {/* Render Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        zoom={14}
        center={vehiclePosition || { lat: 21.1458, lng: 79.0882 }} // Default to Nagpur if no vehicle position
      >
        {/* Render vehicle marker on the map */}
        {vehiclePosition && (
          <Marker
            position={vehiclePosition}
            icon={{
              url: "https://png.pngtree.com/png-vector/20210729/ourmid/pngtree-red-car-top-view-icon-png-image_3745904.jpg", // Car icon
              scaledSize: new window.google.maps.Size(30, 40), 
              anchor: new window.google.maps.Point(20, 20), 
              rotation: rotationAngle, 
            }}
          />
        )}

        {/* Render the directions route on the map */}
        {directions && !journeyComplete && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true, 
              polylineOptions: {
                strokeColor: '#FF0000', 
                strokeOpacity: 1.0, 
                strokeWeight: 2,
              },
            }}
          />
        )}
      </GoogleMap>
    </>
  );
};

export default Map;
