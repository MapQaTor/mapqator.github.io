import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	GoogleMap,
	LoadScript,
	Marker,
	PolylineF,
	CircleF,
	Circle,
} from "@react-google-maps/api";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

export default function NearbyComponent({
	height,
	places,
	locationBias,
	radius,
}) {
	console.log("Radius: ", radius);
	const [locations, setLocations] = useState([]);
	const [center, setCenter] = useState(locationBias);

	useEffect(() => {
		const list = [];
		places?.map((place) => {
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		setLocations(list);
	}, [places]);

	useEffect(() => {
		const lat = locationBias.location.latitude;
		const lng = locationBias.location.longitude;
		setCenter({ lat, lng });
	}, [locationBias]);

	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);

	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			bounds.extend(center);
			mapRef.current.fitBounds(bounds);
		}
	};
	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};
	useEffect(() => {
		adjustBounds(); // Recenter and adjust zoom whenever coords change
	}, [locations]);

	// Define the custom icon with the desired color
	const customIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // URL to the custom icon
		scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
	};
	const blueIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		scaledSize: new window.google.maps.Size(32, 32),
	};

	// Define predefined symbols
	const circleSymbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: "#0F53FF",
		fillOpacity: 0.8,
		strokeWeight: 2,
		strokeColor: "#0000FF",
	};

	return (
		<GoogleMap
			mapContainerStyle={mapStyles}
			// zoom={zoom || 12}
			// center={locations[locations.length - 1]}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			{locations.map((location, index) => (
				<Marker key={index} position={location} />
			))}
			<Marker position={center} icon={circleSymbol} />
			{/* {radius ? (
				<Circle
					center={center}
					radius={radius}
					options={{
						fillColor: "#FF0000",
						fillOpacity: 0.35,
						strokeColor: "#FF0000",
						strokeOpacity: 0.8,
						strokeWeight: 2,
					}}
				/>
			) : (
				<></>
			)} */}
			{/* <Circle
				center={center}
				radius={radius}
				options={{
					fillColor: "#FF0000",
					fillOpacity: 0.35,
					strokeColor: "#FF0000",
					strokeOpacity: 0.8,
					strokeWeight: 2,
				}}
			/> */}
		</GoogleMap>
	);
}
