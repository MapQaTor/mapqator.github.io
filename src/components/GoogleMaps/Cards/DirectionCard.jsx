import React, { useContext, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Collapse,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Switch,
	Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import Pluralize from "pluralize";
import RoutesList from "../Lists/RoutesList";
import RouteSummary from "../Box/RouteSummary";

function DirectionCardDetails({
	direction,
	index,
	directionInformation,
	setDirectionInformation,
	savedPlacesMap,
	mode,
}) {
	return (
		<Paper
			// elevation={1}
			sx={{
				bgcolor: "grey.100",
				// m: 2,
				// mt: 0,
			}}
		>
			{/* <Box className="w-full p-3 pb-0 flex flex-row justify-end items-center">
				<h6 className="text-xs text-zinc-500">Show Steps</h6>
				<Switch
					onChange={() => {
						const newDirectionMatrix = [...directionInformation];
						newDirectionMatrix[index].showSteps =
							!newDirectionMatrix[index].showSteps;

						console.log(newDirectionMatrix);
						setDirectionInformation(newDirectionMatrix);
					}}
					checked={direction.showSteps}
					size="small"
					disabled={mode !== "edit"}
				/>
			</Box> */}
			<RoutesList
				waypoints={[
					direction.origin,
					...(direction.optimizeWaypointOrder &&
					direction.intermediates.length > 1
						? direction.routes[0].optimizedIntermediateWaypointIndex.map(
								(i) => direction.intermediates[i]
						  )
						: direction.intermediates.map(
								(intermediate) => intermediate
						  )),
					direction.destination,
				]}
				routes={direction.routes}
				showSteps={direction.showSteps}
				savedPlacesMap={savedPlacesMap}
			/>
		</Paper>
	);
}

const avoidMap = {
	avoidTolls: "Tolls",
	avoidHighways: "Highways",
	avoidFerries: "Ferries",
};
const transitModeMap = {
	BUS: "Bus",
	LIGHT_RAIL: "Tram and Light rail",
	SUBWAY: "Subway",
	TRAIN: "Train",
	// RAIL: "Rail", // This is equivalent to a combination of SUBWAY, TRAIN, and LIGHT_RAIL.
};
function DirectionCardSummary({
	direction,
	expanded,
	index,
	directionInformation,
	setDirectionInformation,
	savedPlacesMap,
	mode,
}) {
	const { setApiCallLogs, tools } = useContext(GlobalContext);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<RouteSummary
					{...{
						from_id: direction.origin,
						to_id: direction.destination,
						intermediates: direction.intermediates,
						optimized:
							direction.optimizeWaypointOrder &&
							direction.intermediates.length > 1
								? direction.routes[0].optimizedIntermediateWaypointIndex.map(
										(i) => direction.intermediates[i]
								  )
								: undefined,
						savedPlacesMap,
					}}
				/>
				<Box className="flex flex-col justify-between h-full">
					{mode === "edit" && (
						<IconButton
							onClick={() => {
								const newDirectionMatrix = [
									...directionInformation,
								];
								const uuid = newDirectionMatrix[index].uuid;
								setApiCallLogs((prev) =>
									prev.filter((log) => log.uuid !== uuid)
								);
								newDirectionMatrix.splice(index, 1);
								setDirectionInformation(newDirectionMatrix);
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
			<div className="flex flex-row justify-between w-full items-center mt-1">
				<Box
					display="flex"
					flexDirection={"row"}
					justifyContent={"start"}
					alignItems={"center"}
					gap={1}
					// mt={1}
				>
					{tools.computeRoutes.convertTravelModeToIcon(
						direction.travelMode
					)}
					{direction.intermediates.length === 0 ? (
						<Chip
							label={Pluralize(
								"route",
								direction.routes.length,
								true
							)}
							color="primary"
							size="small"
						/>
					) : (
						<Chip
							label={Pluralize(
								"waypoint",
								direction.intermediates.length,
								true
							)}
							color="primary"
							size="small"
						/>
					)}

					{["DRIVE", "TWO_WHEELER"].includes(direction.travelMode) &&
						Object.entries(direction.routeModifiers).map(
							([key, value]) =>
								value && (
									<Chip
										key={key}
										label={"Avoid " + avoidMap[key]}
										color="success"
										size="small"
									/>
								)
						)}
					{["TRANSIT"].includes(direction.travelMode) &&
						direction.transitPreferences.allowedTravelModes.map(
							(mode) => (
								<Chip
									key={mode}
									label={"Use " + transitModeMap[mode]}
									color="success"
									size="small"
								/>
							)
						)}
				</Box>
				{direction.optimizeWaypointOrder && (
					<Box className="w-[46%] flex justify-center mr-[34px]">
						<Typography className="text-center border-t-2 border-zinc-500 w-2/3">
							Optimized route
						</Typography>
					</Box>
				)}
			</div>
		</>
	);
}
export default function DirectionCard({
	direction,
	index,
	directionInformation,
	setDirectionInformation,
	savedPlacesMap,
	mode,
}) {
	const [expanded, setExpanded] = useState(index === 0);
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<DirectionCardSummary
					{...{
						direction,
						expanded,
						index,
						directionInformation,
						setDirectionInformation,
						savedPlacesMap,
						mode,
					}}
				/>
			</CardContent>
			<Collapse in={expanded} timeout="auto">
				<Divider />
				<DirectionCardDetails
					{...{
						direction,
						index,
						directionInformation,
						setDirectionInformation,
						savedPlacesMap,
						mode,
					}}
				/>
			</Collapse>
		</Card>
	);
}
