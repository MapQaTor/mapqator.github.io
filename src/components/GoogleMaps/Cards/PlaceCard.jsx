/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	IconButton,
	Collapse,
	Box,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Divider,
	Paper,
	Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import { convertFromSnake } from "@/services/utils";
import PlaceDeleteButton from "../Buttons/PlaceDeleteButton";
import { template } from "@/database/templates";
import textualFields from "@/database/textualFields";
import { Delete } from "@mui/icons-material";
import SinglePlaceComponent from "../Embed/SinglePlaceComponent";
import { list as placeDetailsTools } from "@/tools/PlaceDetails";
import mapServices from "@/tools/MapServices";
function PlaceCardSummary({
	placeId,
	expanded,
	selectedPlacesMap,
	savedPlacesMap,
}) {
	return (
		<>
			<Box
				sx={{
					display: "flex",
					// alignItems: "center",
					mt: 1,
				}}
				className="justify-between items-start"
			>
				<div className="flex flex-col">
					<Typography variant="h6" component="div" noWrap>
						{savedPlacesMap[placeId].displayName?.text}
					</Typography>
					<Typography color="textSecondary" gutterBottom>
						{savedPlacesMap[placeId].shortFormattedAddress}
					</Typography>
				</div>

				<IconButton
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMoreIcon />
				</IconButton>
			</Box>
		</>
	);
}

function PlaceCardDetails({
	placeId,
	selectedPlacesMap,
	setSelectedPlacesMap,
}) {
	const handleAttributeChange = (placeId, newAttributes) => {
		setSelectedPlacesMap((prev) => ({
			...prev,
			[placeId]: {
				...prev[placeId],
				selectedAttributes: newAttributes,
			},
		}));
	};
	return <FormControl fullWidth sx={{ mt: 2, mb: 1 }}></FormControl>;
}
export default function PlaceCard({
	placeId,
	index,
	selectedPlacesMap,
	setSelectedPlacesMap,
	savedPlacesMap,
	mode,
}) {
	const [expanded, setExpanded] = useState(index === 0);
	const { setApiCallLogs, tools } = useContext(GlobalContext);
	// useEffect(() => {
	// 	setExpanded(index === 0);
	// }, [index]);

	console.log("Textual Fields:", tools.placeDetails.getFields());
	return (
		<Card variant="outlined">
			<CardContent
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					onClick={() => setExpanded((prev) => !prev)}
					className="cursor-pointer"
				>
					<PlaceCardSummary
						{...{
							placeId,
							expanded,
							selectedPlacesMap,
							savedPlacesMap,
						}}
					/>
				</Box>

				<Collapse in={expanded} timeout="auto">
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Paper elevation={2}>
								<Box>
									<Typography
										variant="h6"
										className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
									>
										Detailed Information
									</Typography>
								</Box>
								<Box className="h-[350px] overflow-auto">
									{placeDetailsTools[
										selectedPlacesMap[placeId].mapService
									][0].instance
										.getFields()
										.map((attribute, index) => (
											<Box key={attribute}>
												{index > 0 && <Divider />}

												<Typography
													variant="body2"
													className="p-2"
													// color="textSecondary"
												>
													<span className="font-bold underline">
														{convertFromSnake(
															attribute
														)}
														:
													</span>{" "}
													{template[attribute]
														? template[attribute](
																selectedPlacesMap[
																	placeId
																][attribute] ||
																	savedPlacesMap[
																		placeId
																	][attribute]
														  )
														: "N/A"}
												</Typography>
											</Box>
										))}
								</Box>
							</Paper>
						</Grid>

						{/* {mode === "edit" && (
						<PlaceCardDetails
							{...{
								placeId,
								selectedPlacesMap,
								setSelectedPlacesMap,
								mode,
							}}
						/>
					)} */}
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
								{/* <iframe
									width="100%"
									// className="aspect-square"
									height="350"
									// style="border:0"
									style={{
										border: 0,
										aspectRatio: "1 / 1",
									}}
									loading="lazy"
									// allowfullscreen
									referrerPolicy="no-referrer-when-downgrade"
									src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&language=en&q=place_id:${placeId}`}
								></iframe> */}
								<SinglePlaceComponent
									place={selectedPlacesMap[placeId]}
									height={"350px"}
								/>
							</Paper>
						</Grid>
					</Grid>
				</Collapse>

				{mode === "edit" && (
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							pt: "2",
							alignItems: "center",
						}}
						className="mt-2"
					>
						<img
							src={
								mapServices[savedPlacesMap[placeId].mapService]
									.image
							}
							alt=""
							className="h-6"
						/>
						<IconButton
							onClick={() => {
								setSelectedPlacesMap((prev) => {
									const newMap = { ...prev };

									// First delete from apiCallLogs with same uuid
									const uuid = newMap[placeId].uuid;
									setApiCallLogs((prev) =>
										prev.filter((log) => log.uuid !== uuid)
									);

									delete newMap[placeId];
									return newMap;
								});
							}}
						>
							<Delete color="error" />
						</IconButton>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}
