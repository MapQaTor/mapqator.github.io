import React, { useContext } from "react";
import NearbyCard from "@/components/GoogleMaps/Cards/NearbyCard";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Grid } from "@mui/material";
import { AppContext } from "@/contexts/AppContext";

export default function NearbyGrid({
	mode,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{nearbyPlacesMap.map((entry, index) => (
				<Grid item xs={12} sm={12} md={12} key={index}>
					<NearbyCard
						{...{
							index,
							entry,
							savedPlacesMap,
							nearbyPlacesMap,
							setNearbyPlacesMap,
							distanceMatrix,
							setDistanceMatrix,
							mode,
						}}
					/>
				</Grid>
			))}
		</Grid>
	);
}
