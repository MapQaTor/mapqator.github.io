import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useRef, useState } from "react";

export default function SearchComponent({
	place,
	savedPlacesMap,
	height,
	zoom,
}) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};
	const [locations, setLocations] = useState([]);

	console.log("Got Place: ", place?.id, {
		lat: place?.location.latitude,
		lng: place?.location.longitude,
	});
	const mapRef = useRef(null);
	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			if (place) {
				bounds.extend({
					lat: place.location.latitude,
					lng: place.location.longitude,
				});
			}
			mapRef.current.fitBounds(bounds);
		}
	};

	// After the map has adjusted the bounds, check the zoom level
	const onIdle = () => {
		if (mapRef.current) {
			const currentZoom = mapRef.current.getZoom();
			console.log("Current Zoom: ", currentZoom);
			if (currentZoom > zoom) {
				mapRef.current.setZoom(zoom);
			}
			if (locations.length === 0 && !place) {
				mapRef.current.setZoom(1);
			}
		}
	};

	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};

	useEffect(() => {
		const list = [];
		Object.keys(savedPlacesMap).map((place_id) => {
			const place = savedPlacesMap[place_id];
			if (!place.location || place.hidden) return;
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		console.log(list);
		setLocations(list);
	}, [savedPlacesMap]);

	useEffect(() => {
		adjustBounds(); // Recenter and adjust zoom whenever coords change
	}, [locations, place]);

	const circleSymbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: "#EA4335",
		fillOpacity: 0.9,
		strokeWeight: 2,
		strokeColor: "#B41412",
	};
	return (
		<GoogleMap
			mapContainerStyle={mapStyles}
			// zoom={zoom || 12}
			onIdle={onIdle} // Listen for the idle event to check the zoom level
			// center={locations[locations.length - 1]}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			{locations?.map((location, index) => (
				<Marker key={index} position={location} icon={circleSymbol} />
			))}

			{place && (
				<Marker
					position={{
						lat: place.location.latitude,
						lng: place.location.longitude,
					}}
				/>
			)}
		</GoogleMap>
	);
}
