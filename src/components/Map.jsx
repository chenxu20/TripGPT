import React from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch'
import "./Map.css"
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-control-geocoder';
// import { Routing } from 'react-leaflet-routing-machine'

export default function Map() {
    const position = [1.3147, 103.8]; // Example coordinates

    const AddSearchControl = () => {
        const map = useMap();

        React.useEffect(() => {
            const provider = new OpenStreetMapProvider();
            const searchControl = new GeoSearchControl({
                provider,
                style: 'bar',
                autoClose: true,
                autoComplete: true,
                autoCompleteDelay: 250,
                keepResult: true,
                updateMap: true,
            });

            map.addControl(searchControl);

            return () => map.removeControl(searchControl);
        }, [map]);

        return null;
    };

    const AddRoutingControl = () => {
        const map = useMap();

        React.useEffect(() => {
            if (!map) return;

            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(1.345010, 103.983208), // Start point
                    L.latLng(1.3140, 103.8444),   // End point
                ],
                routeWhileDragging: true,
                geocoder: L.Control.Geocoder.nominatim(),
            }).addTo(map);

            return () => {
                map.removeControl(routingControl);
            };
        }, [map]);

        return null;
    };

    return (
        <MapContainer center={position} zoom={13} className='map-container'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <AddSearchControl />
            <AddRoutingControl />
        </MapContainer>
    );
};