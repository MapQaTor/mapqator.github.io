import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	GoogleMap,
	LoadScript,
	Marker,
	DirectionsRenderer,
	DirectionsService,
	PolylineF,
} from "@react-google-maps/api";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

const POLYLINE_OPTIONS = {
	strokeColor: "#0F53FF",
	strokeOpacity: 0.9,
	strokeWeight: 5,
	clickable: true,
};

function decodePolyline(polylineStr) {
	let index = 0,
		lat = 0,
		lng = 0;
	const coordinates = [];
	const changes = { latitude: 0, longitude: 0 };

	while (index < polylineStr.length) {
		// Decode latitude and longitude alternately
		for (const unit of ["latitude", "longitude"]) {
			let shift = 0;
			let result = 0;

			while (index < polylineStr.length) {
				let byte = polylineStr.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
				if (byte < 0x20) break; // Break out of loop when byte is less than 0x20
			}

			changes[unit] = result & 1 ? ~(result >> 1) : result >> 1;
		}

		lat += changes.latitude;
		lng += changes.longitude;

		// Append the decoded lat/lng to the coordinates array
		coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
	}

	return coordinates;
}

export default function MultiStopComponent({
	height,
	zoom,
	routes,
	origin,
	destination,
	intermediates,
}) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const coords = useMemo(() => {
		const list = [];
		if (routes?.length > 0) {
			for (const leg of routes[0].legs) {
				const polyline = leg.polyline.encodedPolyline;
				list.push(decodePolyline(polyline));
			}
			return list;
		}
		return [[]];
	}, [routes]);

	const [polylineOptions, setPolylineOptions] = useState(
		JSON.stringify(POLYLINE_OPTIONS)
	);

	const [mapCenter, setMapCenter] = useState(null);
	const [mapZoom, setMapZoom] = useState(zoom || 12);

	const po = useMemo(() => {
		try {
			return JSON.parse(polylineOptions);
		} catch (e) {
			return POLYLINE_OPTIONS;
		}
	}, [polylineOptions]);
	const mapRef = useRef(null);

	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			// coords.forEach((coord) => bounds.extend(coord));
			for (const coord of coords) {
				for (const c of coord) {
					bounds.extend(c);
				}
			}

			if (origin) {
				bounds.extend({
					lat: origin.location.latitude,
					lng: origin.location.longitude,
				});
			}

			if (destination) {
				bounds.extend({
					lat: destination.location.latitude,
					lng: destination.location.longitude,
				});
			}
			mapRef.current.fitBounds(bounds);
		}
	};

	useEffect(() => {
		adjustBounds();
	}, [coords, origin, destination]);

	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};

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
			// zoom={mapZoom}
			// center={mapCenter}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			{(origin || coords.length > 0) && (
				<Marker
					position={
						coords.length > 0
							? coords[0][0]
							: {
									lat: origin.location.latitude,
									lng: origin.location.longitude,
							  }
					}
				/>
			)}

			{(intermediates.length > 0 || coords.length > 0) &&
			coords.length > 1
				? coords.map((coord, index) => (
						<Marker
							key={index}
							position={coord[0]}
							icon={circleSymbol}
						/>
				  ))
				: intermediates.map((inter, index) => (
						<Marker
							key={index}
							position={{
								lat: inter.location.latitude,
								lng: inter.location.longitude,
							}}
							icon={circleSymbol}
						/>
				  ))}

			{(destination || coords.length > 0) && (
				<Marker
					position={
						coords.length > 0
							? coords[coords.length - 1][
									coords[coords.length - 1].length - 1
							  ]
							: {
									lat: destination.location.latitude,
									lng: destination.location.longitude,
							  }
					}
				/>
			)}

			{/* {coords.length > 1 && (
				<PolylineF
					path={coords[1]}
					options={{
						strokeColor: "#808080",
						strokeOpacity: 0.7,
						strokeWeight: 4,
						clickable: true,
					}}
				/>
			)}
			{coords.length > 2 && (
				<PolylineF
					path={coords[2]}
					options={{
						strokeColor: "#808080",
						strokeOpacity: 0.6,
						strokeWeight: 4,
						clickable: true,
					}}
				/>
			)} */}

			{coords.length > 0 &&
				coords.map((coord, index) => (
					<PolylineF
						key={index}
						path={coord}
						options={{
							strokeColor: "#0F53FF",
							strokeOpacity: 0.9,
							strokeWeight: 5,
							clickable: true,
							zIndex: 10,
						}}
					/>
				))}
		</GoogleMap>
	);
}
