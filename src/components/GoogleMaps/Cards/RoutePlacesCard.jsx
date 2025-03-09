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
import RoutePlacesComponent from "../Embed/RoutePlacesComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

function RoutePlacesDetails({
	index,
	entry,
	routePlacesMap,
	setRoutePlacesMap,
	mode,
	savedPlacesMap,
}) {
	return (
		<>
			<PoiList
				places={entry.places}
				// handleTogglePlace={handleTogglePlace}
				mode={mode}
				// locationBias={place_id}
			/>
		</>
	);
}
function RoutePlacesSummary({
	index,
	entry,
	expanded,
	mode,
	routePlacesMap,
	setRoutePlacesMap,
	savedPlacesMap,
}) {
	// const handleDelete = () => {
	// 	const newNearbyPlacesMap = { ...routePlacesMap };
	// 	newNearbyPlacesMap[place_id].splice(index, 1);
	// 	if (newNearbyPlacesMap[place_id].length === 0)
	// 		delete newNearbyPlacesMap[place_id];
	// 	setRoutePlacesMap(newNearbyPlacesMap);
	// };
	// console.log("Nearby:", routePlacesMap[place_id][index]);
	const { setApiCallLogs, tools } = useContext(GlobalContext);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Box className={`flex flex-col items-center w-full`}>
					<h6 className="text-base md:text-xl text-center md:font-semibold">
						{
							savedPlacesMap[routePlacesMap[index].origin]
								.displayName?.text
						}
					</h6>
					<FontAwesomeIcon icon={faArrowDown} />
					<h6 className="text-base md:text-xl text-center md:font-semibold">
						{
							savedPlacesMap[routePlacesMap[index].destination]
								.displayName?.text
						}
					</h6>
				</Box>
				<Box className="flex flex-col justify-between h-full">
					{mode === "edit" && (
						<IconButton
							onClick={() => {
								const newRoutePlacesMap = [...routePlacesMap];
								const uuid = newRoutePlacesMap[index].uuid;
								setApiCallLogs((prev) =>
									prev.filter((log) => log.uuid !== uuid)
								);
								newRoutePlacesMap.splice(index, 1);
								setRoutePlacesMap(newRoutePlacesMap);
							}}
							size="small"
						>
							<Delete color="error" />
						</IconButton>
					)}
					<IconButton
						size="small"
						sx={{
							transform: expanded
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "0.3s",
						}}
					>
						<ExpandMore />
					</IconButton>
				</Box>
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
								tools.searchAlongRoute.formatPoiCategory(
									entry.type
								),
								routePlacesMap[index].places.length,
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

				{/* <IconButton
					size="small"
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMore />
				</IconButton> */}
			</Box>
		</>
	);
}
export default function RoutePlacesCard({
	index,
	routePlacesMap,
	setRoutePlacesMap,
	savedPlacesMap,
	mode,
	entry,
}) {
	const [expanded, setExpanded] = useState(false);
	const { tools } = useContext(GlobalContext);
	useEffect(() => {
		setExpanded(index === 0);
	}, [index]);

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<RoutePlacesSummary
					{...{
						index,
						entry,
						expanded,
						savedPlacesMap,
						routePlacesMap,
						setRoutePlacesMap,
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
									{Pluralize(
										tools.searchAlongRoute.formatPoiCategory(
											entry.type
										)
									)}{" "}
									Along Route
								</Typography>
							</Box>
							<Box className="h-[320px] overflow-auto">
								<RoutePlacesDetails
									{...{
										index,
										entry,
										routePlacesMap,
										setRoutePlacesMap,
										mode,
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
							<RoutePlacesComponent
								places={entry.places}
								height={"320px"}
								zoom={14}
								encodedPolyline={
									entry.routes[0].polyline.encodedPolyline
								}
							/>
						</Paper>
					</Grid>
				</Grid>
			</Collapse>
		</Card>
	);
}
