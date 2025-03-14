import React, { useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import PlaceSelectionField from "@/components/GoogleMaps/InputFields/PlaceSelectionField";
import TravelSelectionField from "@/mapServices/GoogleMaps/TravelSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";

export default function DistanceForm({
	handlePlaceAdd,
	newDistance,
	setNewDistance,
}) {
	const { selectedPlacesMap, distanceMatrix, setDistanceMatrix } =
		useContext(GlobalContext);
	const initialData = {
		origins: [],
		destinations: [],
		travelMode: "WALK",
	};

	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	setNewDistance(initialData);
	// }, []);

	const handleDistanceAdd = async () => {
		console.log(newDistance);
		if (
			newDistance.origins.length === 0 ||
			newDistance.destinations.length === 0
		)
			return;
		setLoading(true);
		// Fetch the distance between the two places from google maps
		const response = await mapApi.getDistanceNew(newDistance);
		if (response.success) {
			const origins = newDistance.origins;
			const destinations = newDistance.destinations;
			const elements = response.data;
			const newDistanceMatrix = { ...distanceMatrix };
			// distanceMatrix[origin][destination][travelMode] = { duration, distance }
			for (const route of elements) {
				const {
					originIndex,
					destinationIndex,
					condition,
					localizedValues,
				} = route;

				if (
					origins[originIndex] === destinations[destinationIndex] ||
					condition === "ROUTE_NOT_FOUND"
				) {
					continue;
				}
				const distance = localizedValues.distance.text;
				const duration = localizedValues.staticDuration.text;
				const o = origins[originIndex];
				const d = destinations[destinationIndex];
				if (newDistanceMatrix[o])
					newDistanceMatrix[o][d] = {
						...newDistanceMatrix[o][d],
						[newDistance.travelMode]: {
							duration,
							distance,
						},
					};
				else {
					newDistanceMatrix[o] = {
						[d]: {
							[newDistance.travelMode]: {
								duration,
								distance,
							},
						},
					};
				}
			}
			setDistanceMatrix(newDistanceMatrix);
		} else {
			showError("Couldn't find the distance between the places");
		}
		// setNewDistance((prev) => ({
		// 	...initialData,
		// 	travelMode: prev.travelMode,
		// }));
		setLoading(false);
	};
	return (
		newDistance && (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<PlaceSelectionField
						label="Origins (Multiple allowed)"
						multiple={true}
						onChange={(event) => {
							setNewDistance((prev) => ({
								...prev,
								origins: event.target.value,
							}));
						}}
						value={newDistance.origins}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>

				<Grid item xs={12}>
					<PlaceSelectionField
						label="Destinations (Multiple allowed)"
						multiple={true}
						value={newDistance.destinations}
						onChange={(event) => {
							setNewDistance((prev) => ({
								...prev,
								destinations: event.target.value,
							}));
						}}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>

				<Grid item xs={12}>
					<TravelSelectionField
						mode={newDistance.travelMode}
						setMode={(value) =>
							setNewDistance((prev) => ({
								...prev,
								travelMode: value,
							}))
						}
					/>
				</Grid>

				<Grid item xs={12}>
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={handleDistanceAdd}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
					>
						Add Distance and Duration
					</LoadingButton>
				</Grid>
			</Grid>
		)
	);
}
