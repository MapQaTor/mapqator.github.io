import { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import { Clear, Route } from "@mui/icons-material";
import DirectionGrid from "@/components/GoogleMaps/Grids/DirectionGrid";
import NearbyGrid from "@/components/GoogleMaps/Grids/NearbyGrid";
import PlacesGrid from "@/components/GoogleMaps/Grids/PlacesGrid";
import RouteSearchGrid from "./Grids/RouteSearchGrid";

export default function ContextPreview({
	savedPlacesMap,
	selectedPlacesMap,
	nearbyPlacesMap,
	routePlacesMap,
	directionInformation,
}) {
	const steps = [
		{
			label: "Add details of Places",
			description: `Start by searching for a location. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			additional: "Places you have added to the context.",
			grid: selectedPlacesMap &&
				Object.keys(selectedPlacesMap).length > 0 && (
					<>
						{/* <MapComponent /> */}
						<PlacesGrid
							{...{
								savedPlacesMap,
								selectedPlacesMap,
							}}
						/>
					</>
				),
		},
		{
			label: "Search for Nearby places",
			additional:
				"List of places whose nearby pois are added to the context",
			icon: <PlaceIcon />,
			grid: nearbyPlacesMap &&
				Object.keys(nearbyPlacesMap).length > 0 && (
					<NearbyGrid
						{...{
							nearbyPlacesMap,
							savedPlacesMap,
						}}
					/>
				),
		},
		{
			abel: "Compute Routes",
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <DirectionsIcon />,
			grid: directionInformation &&
				Object.keys(directionInformation).length > 0 && (
					<DirectionGrid
						{...{
							directionInformation,
							savedPlacesMap,
						}}
					/>
				),
		},
		{
			label: "Search Along Route",
			description: `Utilize the Places API to find places along a route. Choose a route to find places along the route.`,
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <Route />,
			grid: routePlacesMap && Object.keys(routePlacesMap).length > 0 && (
				<RouteSearchGrid
					{...{
						routePlacesMap,
						directionInformation,
						savedPlacesMap,
					}}
					mode="edit"
				/>
			),
		},
	];

	return steps.map(
		(step, index) =>
			step.grid && (
				<div key={index}>
					<Typography
						sx={{
							whiteSpace: "pre-line",
							paddingTop: "8px",
						}}
					>
						{step.additional}
					</Typography>
					<Box>{step.grid}</Box>
					{/* {index < steps.length - 1 && <Divider />} */}
				</div>
			)
	);
}
