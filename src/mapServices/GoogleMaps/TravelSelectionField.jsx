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
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function convertTravelModeToLabel(mode) {
	return mode === "WALK"
		? "Walking"
		: mode === "DRIVE"
		? "Driving"
		: mode === "BICYCLE"
		? "Bicycling"
		: mode === "TRANSIT"
		? "Transit"
		: mode === "TWO_WHEELER"
		? "Two Wheeler"
		: "Unknown";
}

export function convertTravelModeToIcon(mode) {
	return mode === "WALK" ? (
		<FontAwesomeIcon icon={faWalking} />
	) : mode === "DRIVE" ? (
		<FontAwesomeIcon icon={faCar} />
	) : mode === "BICYCLE" ? (
		<FontAwesomeIcon icon={faBicycle} />
	) : mode === "TRANSIT" ? (
		<FontAwesomeIcon icon={faBus} />
	) : mode === "TWO_WHEELER" ? (
		<FontAwesomeIcon icon={faMotorcycle} />
	) : (
		""
	);
}

export default function TravelSelectionField({ mode, setMode }) {
	return (
		<FormControl
			fullWidth
			className="input-field"
			variant="outlined"
			// style={{ width: "20rem" }}
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
				{[
					{ value: "WALK", label: "Walking" },
					{ value: "DRIVE", label: "Driving" },
					{ value: "BICYCLE", label: "Bicycling" },
					{ value: "TWO_WHEELER", label: "Two Wheeler" },
				].map((mode, index) => (
					<MenuItem
						key={index}
						value={mode.value}
						className="flex flex-row gap-2 items-center"
					>
						{convertTravelModeToIcon(mode.value)} {mode.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
