import React, { useContext } from "react";
import { Grid } from "@mui/material";
import DirectionCard from "../Cards/DirectionCard";

export default function DirectionGrid({
	directionInformation,
	setDirectionInformation,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{directionInformation.map((direction, index) => (
				<Grid item xs={12} sm={12} md={12} key={index}>
					<DirectionCard
						{...{
							direction,
							index,
							directionInformation,
							setDirectionInformation,
							savedPlacesMap,
							mode,
						}}
					/>
				</Grid>
			))}
		</Grid>
	);
}
