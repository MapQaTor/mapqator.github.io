import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceCard from "@/components/GoogleMaps/Cards/PlaceCard";
import { AppContext } from "@/contexts/AppContext";
import SavedPlaceCard from "../Cards/SavedPlaceCard";

export default function SavedPlacesGrid({
	selectedPlacesMap,
	setSelectedPlacesMap,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{Object.keys(savedPlacesMap)
				.reverse()
				.map((placeId, index) => (
					<Grid item xs={12} sm={6} key={placeId}>
						<SavedPlaceCard
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
