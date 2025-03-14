import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceCard from "@/components/GoogleMaps/Cards/PlaceCard";
import { AppContext } from "@/contexts/AppContext";

export default function PlacesGrid({
	selectedPlacesMap,
	setSelectedPlacesMap,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{Object.keys(selectedPlacesMap)
				.reverse()
				.map((placeId, index) => (
					<Grid item xs={12} sm={12} md={12} key={placeId}>
						<PlaceCard
							{...{
								placeId,
								index,
								selectedPlacesMap,
								setSelectedPlacesMap,
								savedPlacesMap,
								mode,
							}}
						/>
					</Grid>
				))}
		</Grid>
	);
}
