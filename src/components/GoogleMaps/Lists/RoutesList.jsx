import React, { useContext, useState } from "react";
import {
	Box,
	Button,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	ArrowForward,
	ArrowRight,
	ArrowRightAlt,
	DoubleArrow,
	KeyboardDoubleArrowRight,
	Search,
} from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";
import DirectionComponent from "../Embed/DirectionComponent";

function formatDuration(value) {
	return (
		(value.staticDuration.text ? value.staticDuration.text : "") +
		(value.distance.text ? " (" + value.distance.text + ")" : "")
	);
}

function SingleRoute({ route, index, length }) {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		activeStep,
		setActiveStep,
		setNewNearbyPlaces,
		setNewRoutePlaces,
	} = useContext(GlobalContext);

	return (
		<>
			{index !== 0 && <Divider />}
			<Box className="p-4">
				<div className="flex flex-row justify-between w-full">
					<h1 className="w-[60%] text-wrap text-lg font-semibold">
						{route.description ? "Via " + route.description : ""}{" "}
						{index === 0 && length > 1 && "(Recommended)"}
					</h1>
					<div className="flex flex-col w-[40%] text-right">
						<h1 className="font-semibold">
							{formatDuration(route.localizedValues)}
						</h1>
					</div>
				</div>
			</Box>
			<Grid container spacing={2} className="px-4 mb-4">
				<Grid item xs={12} md={6}>
					<Paper elevation={2}>
						<Typography
							variant="h6"
							className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
						>
							Navigation Instructions
						</Typography>
						<Box className="h-[350px] overflow-auto">
							{route.legs.map((leg, i) => (
								<>
									{leg.steps.map(
										(step, j) =>
											step.navigationInstruction && (
												<>
													{j > 0 && <Divider />}
													<p
														key={i + j}
														// className="text-sm"
														dangerouslySetInnerHTML={{
															__html: step
																.navigationInstruction
																.instructions,
														}}
														className="p-2"
													/>
													<h1 className="text-sm text-right px-2 py-1 text-zinc-500">
														{formatDuration(
															step.localizedValues
														)}
													</h1>
												</>
											)
									)}
								</>
							))}
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
						<DirectionComponent
							polyline={route.legs[0].polyline.encodedPolyline}
							height={"350px"}
						/>
					</Paper>
				</Grid>
			</Grid>
			{/* <Box className="flex flex-row justify-center pb-4">
				<Button
					startIcon={<Search />}
					variant="contained"
					onClick={() => {
						setNewRoutePlaces((prev) => ({
							...prev,
							encodedPolyline: route.polyline.encodedPolyline,
						}));
						setActiveStep(5);
					}}
				>
					Search Along Route
				</Button>
			</Box> */}
		</>
	);
}

function MultiLeg({ route, savedPlacesMap, waypoints }) {
	return (
		<>
			<Box className="p-4">
				<div className="flex flex-row justify-between w-full">
					<h1 className="w-[60%] text-wrap text-lg font-semibold">
						{route.description ? "Via " + route.description : ""}
					</h1>
					<div className="flex flex-col w-[40%] text-right">
						<h1 className="font-semibold">
							{formatDuration(route.localizedValues)}
						</h1>
					</div>
				</div>
			</Box>
			{route.legs.map((leg, i) => (
				<>
					<Paper elevation={2} className="mx-4 mb-4">
						<div
							className="flex flex-row justify-between items-center bg-zinc-200 px-4 py-2"
							key={i}
						>
							<Typography className="pt-1 text-black">
								{savedPlacesMap[waypoints[i]].displayName.text}
								<ArrowRightAlt />
								{
									savedPlacesMap[waypoints[i + 1]].displayName
										.text
								}
							</Typography>
							<Typography
								variant="body2"
								className="w-[10rem] text-right"
							>
								{formatDuration(leg.localizedValues)}
							</Typography>
						</div>
					</Paper>

					<Grid container spacing={2} className="px-4 mb-4">
						<Grid item xs={12} md={6}>
							<Paper elevation={2}>
								<Typography
									variant="h6"
									className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
								>
									Navigation Instructions
								</Typography>
								<Box className="h-[350px] overflow-auto">
									{leg.steps.map(
										(step, j) =>
											step.navigationInstruction && (
												<>
													{j > 0 && <Divider />}
													<p
														key={i + j}
														// className="text-sm"
														dangerouslySetInnerHTML={{
															__html: step
																.navigationInstruction
																.instructions,
														}}
														className="p-2"
													/>
													<h1 className="text-sm text-right px-2 py-1 text-zinc-500">
														{formatDuration(
															step.localizedValues
														)}
													</h1>
												</>
											)
									)}
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
								<DirectionComponent
									polyline={leg.polyline.encodedPolyline}
									height={"350px"}
								/>
							</Paper>
						</Grid>
					</Grid>
				</>
			))}
		</>
	);
}
export default function RoutesList({
	routes,
	showSteps,
	waypoints,
	savedPlacesMap,
}) {
	return (
		<List dense>
			{routes.map((route, index) => (
				<React.Fragment key={index}>
					{route.legs.length === 1 ? (
						<SingleRoute
							route={route}
							index={index}
							length={routes.length}
						/>
					) : (
						<MultiLeg
							route={route}
							savedPlacesMap={savedPlacesMap}
							waypoints={waypoints}
						/>
					)}
					{/* <Divider /> */}
					{/* <ListItem>
						<div className="flex flex-col gap-2 w-full">
							<ListItemText
								primary={
									<div className="flex flex-row justify-between w-full">
										<h1 className="w-[60%] text-wrap text-lg font-semibold">
											{"Via " + route.description}
										</h1>
										<div className="flex flex-col w-[40%] text-right">
											<h1 className="font-semibold">
												{route.localizedValues
													.staticDuration.text +
													" (" +
													route.localizedValues
														.distance.text +
													")"}
											</h1>
										</div>
									</div>
								}
								secondary={
									<div className="flex flex-col gap-0">
										{route.legs.map((leg, i) => (
											<>
												{route.legs.length > 1 && (
													<div className="flex flex-row justify-between items-center">
														<Typography className="pt-1 text-black">
															{
																savedPlacesMap[
																	waypoints[i]
																].displayName
																	.text
															}
															<ArrowRightAlt />
															{
																savedPlacesMap[
																	waypoints[
																		i + 1
																	]
																].displayName
																	.text
															}
														</Typography>
														<Typography variant="body2">
															{leg.localizedValues
																.staticDuration
																.text +
																" (" +
																leg
																	.localizedValues
																	.distance
																	.text +
																")"}
														</Typography>
													</div>
												)}

												{showSteps &&
													leg.steps.map(
														(step, j) =>
															step.navigationInstruction && (
																<p
																	key={i + j}
																	// className="text-sm"
																	dangerouslySetInnerHTML={{
																		__html:
																			"- " +
																			step
																				.navigationInstruction
																				.instructions,
																	}}
																/>
															)
													)}
											</>
										))}
									</div>
								}
								primaryTypographyProps={{
									noWrap: true,
								}}
								secondaryTypographyProps={{
									noWrap: true,
								}}
							/>
						</div>
					</ListItem> */}
				</React.Fragment>
			))}
		</List>
	);
}
