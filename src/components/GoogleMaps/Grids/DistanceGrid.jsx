import React, { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import DistanceCard from "@/components/GoogleMaps/Cards/DistanceCard";
import { Grid } from "@mui/material";
import { AppContext } from "@/contexts/AppContext";

export default function DistanceGrid({
	distanceMatrix,
	setDistanceMatrix,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{Object.keys(distanceMatrix).map((from_id, i) =>
				Object.keys(distanceMatrix[from_id]).map((to_id, j) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={6}
						key={from_id + "-" + to_id}
					>
						<DistanceCard
							{...{
								from_id,
								to_id,
								distanceMatrix,
								setDistanceMatrix,
								savedPlacesMap,
								mode,
							}}
							index={i + j}
						/>
					</Grid>
				))
			)}
		</Grid>
	);
}
