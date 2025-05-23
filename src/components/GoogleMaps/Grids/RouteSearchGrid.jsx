import React, { useContext } from "react";
import { Grid } from "@mui/material";
import DirectionCard from "@/components/GoogleMaps/Cards/DirectionCard";
import { GlobalContext } from "@/contexts/GlobalContext";
import RoutePlacesCard from "../Cards/RoutePlacesCard";

export default function RouteSearchGrid({
	routePlacesMap,
	setRoutePlacesMap,
	directionInformation,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{routePlacesMap.map((entry, i) => (
				<Grid item xs={12} sm={12} md={12} key={i}>
					<RoutePlacesCard
						entry={entry}
						index={i}
						{...{
							routePlacesMap,
							setRoutePlacesMap,
							savedPlacesMap,
							mode,
						}}
					/>
				</Grid>
			))}
		</Grid>
	);
}
