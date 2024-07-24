"use client";

import React, { useContext, useEffect, useState } from "react";
import {
	IconButton,
	CardContent,
	Card,
	Chip,
	Collapse,
	List,
	ListItem,
	Box,
	Typography,
	ListItemText,
	Divider,
	ListItemIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowDown,
	faBicycle,
	faBus,
	faCar,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Delete, ExpandMore, ForkRight, JoinRight } from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";

function DistanceCardDetails({ from_id, to_id }) {
	const { distanceMatrix, setDistanceMatrix } = useContext(GlobalContext);
	const handleDelete = (mode) => {
		const newDistanceMatrix = {
			...distanceMatrix,
		};

		delete newDistanceMatrix[from_id][to_id][mode];
		if (Object.keys(newDistanceMatrix[from_id][to_id]).length === 0)
			delete newDistanceMatrix[from_id][to_id];
		if (Object.keys(newDistanceMatrix[from_id]).length === 0)
			delete newDistanceMatrix[from_id];
		setDistanceMatrix(newDistanceMatrix);
	};
	return (
		<List dense>
			{Object.keys(distanceMatrix[from_id][to_id]).map((mode, index3) => (
				<React.Fragment key={index3}>
					<ListItem
						secondaryAction={
							<IconButton
								edge="end"
								onClick={() => handleDelete(mode)}
								size="small"
							>
								<Delete color="error" />
							</IconButton>
						}
					>
						<ListItemIcon>
							{mode === "walking" ? (
								<FontAwesomeIcon icon={faWalking} />
							) : mode === "driving" ? (
								<FontAwesomeIcon icon={faCar} />
							) : mode === "bicycling" ? (
								<FontAwesomeIcon icon={faBicycle} />
							) : (
								<FontAwesomeIcon icon={faBus} />
							)}
						</ListItemIcon>
						<ListItemText
							primary={
								mode === "walking"
									? "Walking"
									: mode === "driving"
									? "Driving"
									: mode === "bicycling"
									? "Bicycling"
									: "Public transport"
							}
							secondary={
								distanceMatrix[from_id][to_id][mode].duration +
								" | " +
								distanceMatrix[from_id][to_id][mode].distance
							}
							primaryTypographyProps={{
								noWrap: true,
							}}
							secondaryTypographyProps={{
								noWrap: true,
							}}
						/>
					</ListItem>
					{index3 <
						Object.keys(distanceMatrix[from_id][to_id]).length -
							1 && <Divider component="li" />}
				</React.Fragment>
			))}
		</List>
	);
}

function DistanceCardSummary({ from_id, to_id, expanded }) {
	const { distanceMatrix } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<Box className="flex flex-col">
					<Typography variant="h6" component="div" align="center">
						{savedPlacesMap[from_id].name}
					</Typography>

					<FontAwesomeIcon icon={faArrowDown} />

					<Typography variant="h6" component="div" align="center">
						{savedPlacesMap[to_id].name}
					</Typography>
				</Box>
				<Box>
					{/* <IconButton onClick={handleFullDelete} size="small">
							<Delete color="error" />
						</IconButton> */}
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
			<Box
				display="flex"
				flexDirection={"row"}
				justifyContent={"end"}
				gap={1}
				mt={1}
			>
				<Chip
					label={
						Object.keys(distanceMatrix[from_id][to_id]).length +
						" travel modes"
					}
					color="primary"
					size="small"
				/>
			</Box>
		</>
	);
}

export default function DistanceCard({ from_id, to_id }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<DistanceCardSummary {...{ from_id, to_id, expanded }} />
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<DistanceCardDetails {...{ from_id, to_id }} />
			</Collapse>
		</Card>
	);
}
