import React, { useContext, useEffect, useState } from "react";
import {
	IconButton,
	Typography,
	Card,
	CardContent,
	Box,
	Collapse,
	Chip,
	Divider,
	Grid,
	Paper,
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import PoiList from "@/components/GoogleMaps/Lists/PoiList";
import Pluralize from "pluralize";
import { convertFromSnake } from "@/services/utils";
import TravelSelectionField from "../../../mapServices/GoogleMaps/TravelSelectionField";
import { LoadingButton } from "@mui/lab";
import mapApi from "@/api/mapApi";
import MapComponent from "../Embed/MapComponent";
import NearbyComponent from "../Embed/NearbyComponent";

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

function NearbyCardDetails({
	index,

	entry,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
	mode,
	savedPlacesMap,
}) {
	// const handleDistanceAdd = async () => {
	// 	setLoading(true);
	// 	const origins = [place_id];
	// 	const destinations = entry.places
	// 		.filter((place) => place.selected)
	// 		.map((place) => place.place_id);
	// 	const response = await mapApi.getDistanceNew({
	// 		origins,
	// 		destinations,
	// 		travelMode,
	// 	});
	// 	if (response.success) {
	// 		const elements = response.data;
	// 		const newDistanceMatrix = { ...distanceMatrix };
	// 		for (const route of elements) {
	// 			const {
	// 				originIndex,
	// 				destinationIndex,
	// 				condition,
	// 				localizedValues,
	// 			} = route;

	// 			if (
	// 				origins[originIndex] === destinations[destinationIndex] ||
	// 				condition === "ROUTE_NOT_FOUND"
	// 			) {
	// 				continue;
	// 			}
	// 			const distance = localizedValues.distance.text;
	// 			const duration = localizedValues.staticDuration.text;
	// 			const o = origins[originIndex];
	// 			const d = destinations[destinationIndex];
	// 			if (newDistanceMatrix[o])
	// 				newDistanceMatrix[o][d] = {
	// 					...newDistanceMatrix[o][d],
	// 					[travelMode]: {
	// 						duration,
	// 						distance,
	// 					},
	// 				};
	// 			else {
	// 				newDistanceMatrix[o] = {
	// 					[d]: {
	// 						[travelMode]: {
	// 							duration,
	// 							distance,
	// 						},
	// 					},
	// 				};
	// 			}
	// 		}
	// 		setDistanceMatrix(newDistanceMatrix);
	// 	} else {
	// 		showError("Couldn't find the distance between the places");
	// 	}
	// 	setLoading(false);
	// };

	return (
		<>
			<PoiList
				places={entry.places}
				// handleTogglePlace={handleTogglePlace}
				routingSummaries={entry.routingSummaries}
				mode={mode}
				locationBias={entry.locationBias}
			/>
		</>
	);
}
function NearbyCardSummary({
	index,
	entry,
	expanded,
	mode,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	savedPlacesMap,
}) {
	const { setApiCallLogs, tools } = useContext(GlobalContext);
	const handleDelete = () => {
		const newNearbyPlacesMap = [...nearbyPlacesMap];

		const uuid = newNearbyPlacesMap[index].uuid;
		setApiCallLogs((prev) => prev.filter((log) => log.uuid !== uuid));

		newNearbyPlacesMap.splice(index, 1);
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="start"
				className="gap-1"
			>
				<Typography variant="h6" component="div">
					{savedPlacesMap[entry.locationBias].displayName?.text}
				</Typography>
				{mode === "edit" && (
					<Box className="flex flex-col items-end justify-start">
						<IconButton onClick={handleDelete} size="small">
							<Delete color="error" />
						</IconButton>
					</Box>
				)}
			</Box>
			<Box display="flex" justifyContent="space-between">
				<Box
					display="flex"
					flexDirection={"column"}
					flexWrap="wrap"
					gap={1}
					mt={1}
				>
					<div className="flex gap-2">
						<Chip
							label={Pluralize(
								tools.nearbySearch.formatPoiCategory(
									entry.type
								),
								nearbyPlacesMap[index].places.length,
								true
							)}
							color="primary"
							size="small"
						/>
						{entry.rankPreference === "DISTANCE" && (
							<Chip
								label={"Rankby " + entry.rankPreference}
								color="success"
								size="small"
							/>
						)}
						{entry.minRating > 0 && (
							<Chip
								label={"Rating ≥ " + entry.minRating}
								color="secondary"
								size="small"
							/>
						)}
					</div>
					<div className="flex gap-2">
						{entry.priceLevels.length > 0 && (
							<Chip
								label={
									"Prices: " +
									entry.priceLevels
										.map((p) => priceMap[p])
										.join(", ")
								}
								color="primary"
								size="small"
							/>
						)}
					</div>
				</Box>
				<IconButton
					size="small"
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMore />
				</IconButton>
			</Box>
		</>
	);
}
export default function NearbyCard({
	index,
	entry,
	mode,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
}) {
	const [expanded, setExpanded] = useState(false);
	const [locations, setLocations] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setNewDistance, setActiveStep, tools } = useContext(GlobalContext);
	useEffect(() => {
		setExpanded(index === 0);
	}, [index]);

	useEffect(() => {
		const list = [];
		entry.places.map((np) => {
			const place = savedPlacesMap[np.id];
			if (!place) return;
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		console.log(list);
		setLocations(list);
	}, [entry.places]);

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<NearbyCardSummary
					{...{
						index,
						entry,
						expanded,
						savedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						mode,
					}}
				/>
			</CardContent>
			<Collapse in={expanded} timeout="auto">
				{/* <Divider /> */}
				<Grid container spacing={2} className="px-4 mb-4">
					<Grid item xs={12} md={6}>
						<Paper elevation={2}>
							<Box>
								<Typography
									variant="h6"
									className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
								>
									Nearby{" "}
									{Pluralize(
										tools.nearbySearch.formatPoiCategory(
											entry.type
										)
									)}
								</Typography>
							</Box>
							<Box className="h-[320px] overflow-auto">
								<NearbyCardDetails
									{...{
										index,
										entry,
										nearbyPlacesMap,
										setNearbyPlacesMap,
										mode,
										distanceMatrix,
										setDistanceMatrix,
										savedPlacesMap,
									}}
								/>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={2}>
							<Box>
								<Typography
									variant="h6"
									className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
								>
									Map View
								</Typography>
							</Box>
							<NearbyComponent
								height={"320px"}
								zoom={14}
								places={entry.places}
								locationBias={
									savedPlacesMap[entry.locationBias]
								}
							/>
						</Paper>
					</Grid>
				</Grid>
				{/* {mode === "edit" && (
					<div className="flex flex-col gap-4 p-4 items-center">
						<Typography variant="body2">
							Add travel time from{" "}
							{savedPlacesMap[place_id].displayName?.text} to
							nearby {Pluralize(entry.type)}
						</Typography>
						<LoadingButton
							variant="contained"
							onClick={() => {
								setNewDistance({
									origins: [place_id],
									destinations: entry.places
										// .filter((place) => place.selected)
										.map((place) => place.place_id),
									travelMode: "WALK",
								});
								setActiveStep(4);
							}}
							startIcon={<Add />}
							loading={loading}
							loadingPosition="start"
						>
							Add Travel Time
						</LoadingButton>
					</div>
				)} */}
			</Collapse>
		</Card>
	);
}
