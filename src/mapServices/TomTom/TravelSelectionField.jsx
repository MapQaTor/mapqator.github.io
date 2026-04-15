import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem } from "@mui/material";
import {
	faBicycle,
	faBiking,
	faBus,
	faCar,
	faMotorcycle,
	faShuttleVan,
	faTaxi,
	faTruck,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const travelModes = [
	"pedestrian",
	"car",
	"bicycle",
	"bus",
	"motorcycle",
	"van",
	"taxi",
	"truck",
];

export function convertTravelModeToLabel(mode) {
	// Make capital first letter
	if (!mode) return "";
	return mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
}

export function convertTravelModeToIcon(mode) {
	return mode === "pedestrian" ? (
		<FontAwesomeIcon icon={faWalking} />
	) : mode === "car" ? (
		<FontAwesomeIcon icon={faCar} />
	) : mode === "bicycle" ? (
		<FontAwesomeIcon icon={faBicycle} />
	) : mode === "bus" ? (
		<FontAwesomeIcon icon={faBus} />
	) : mode === "motorcycle" ? (
		<FontAwesomeIcon icon={faMotorcycle} />
	) : mode === "van" ? (
		<FontAwesomeIcon icon={faShuttleVan} />
	) : mode === "taxi" ? (
		<FontAwesomeIcon icon={faTaxi} />
	) : mode === "truck" ? (
		<FontAwesomeIcon icon={faTruck} />
	) : (
		<></>
	);
}

export default function TravelSelectionField({ mode, setMode }) {
	return (
		<FormControl
			fullWidth
			className="input-field"
			variant="outlined"
			size="small"
			required
		>
			<InputLabel htmlFor="outlined-adornment" className="input-label">
				Travel mode
			</InputLabel>
			<Select
				required
				id="outlined-adornment"
				className="outlined-input"
				value={mode}
				onChange={(event) => setMode(event.target.value)}
				input={<OutlinedInput label={"Travel mode"} />}
				renderValue={(value) => (
					<div className="flex flex-row gap-2 items-center">
						{convertTravelModeToIcon(value)}{" "}
						{convertTravelModeToLabel(value)}
					</div>
				)}
			>
				{travelModes.map((mode, index) => (
					<MenuItem
						key={index}
						value={mode}
						className="flex flex-row gap-2 items-center"
					>
						{convertTravelModeToIcon(mode)}
						{convertTravelModeToLabel(mode)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
