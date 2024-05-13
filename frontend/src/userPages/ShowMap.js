import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const ShowMap = ({peopleLocation}) => {

  
  mapboxgl.accessToken = 'pk.eyJ1Ijoic25la2FuNyIsImEiOiJjbGo0ZTBndXYwMWl2M2pxeWp1eDQ2NG9uIn0.bE3IY5XI57Qrtck_EfsMxg';
  console.log("map : ",peopleLocation);
  const markerCoordinates = peopleLocation.map((item) => [item[1][1],item[1][0]]);
  useEffect(() => {
    // Create a new map instance
    const bounds = new mapboxgl.LngLatBounds();
    markerCoordinates.forEach((coord) => {
      bounds.extend(coord);
    });

    // Create the map with an initial center and zoom level
    const map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // replace with your own style
    });

    // After adding markers, fit the map to the bounds of the markers
    map.on('load', () => {
      map.fitBounds(bounds, {
        padding: 50, // Adjust padding as needed
        maxZoom: 15, // Set a maximum zoom level if desired
      });
    });

    
    if(peopleLocation){
      peopleLocation.forEach((marker) => {
        new mapboxgl.Marker()
          .setLngLat([marker[1][1],marker[1][0]])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker[0]}</h3>`)) // Popup content
          .addTo(map);
      });
    }
    // Clean up the map when the component unmounts
    return () => map.remove();
  }, []);

  return (
    <div id="map" style={{ position:'relative',top:'60%',width:'100%', height: '400px' }}>
      {/* Map container */}
    </div>
  );
};

export default ShowMap;
