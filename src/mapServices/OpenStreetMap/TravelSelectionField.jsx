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
	faPersonHiking,
	faShuttleVan,
	faTaxi,
	faTruck,
	faTruckMoving,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertFromSnake } from "@/services/utils";
import { DeliveryDining, TwoWheeler } from "@mui/icons-material";

// Limitation on free account
export const travelModes = [
	"car",
	// "small_truck",
	// "truck",
	// "scooter",
	"foot",
	// "hike",
	"bike",
	// "mtb",
	// "racingbike",
];

export function convertTravelModeToLabel(mode) {
	// Make capital first letter
	if (!mode) return "";
	if (mode === "mtb") return "Mountain bike";
	if (mode === "racingbike") return "Racing bike";
	return convertFromSnake(mode);
}

export function convertTravelModeToIcon(mode) {
	return mode === "car" ? (
		<FontAwesomeIcon icon={faCar} />
	) : mode === "small_truck" ? (
		<FontAwesomeIcon icon={faTruck} />
	) : mode === "truck" ? (
		<FontAwesomeIcon icon={faTruckMoving} />
	) : mode === "scooter" ? (
		<DeliveryDining />
	) : mode === "foot" ? (
		<FontAwesomeIcon icon={faWalking} />
	) : mode === "hike" ? (
		<FontAwesomeIcon icon={faPersonHiking} />
	) : mode === "bike" ? (
		<FontAwesomeIcon icon={faBicycle} />
	) : mode === "mtb" ? (
		<FontAwesomeIcon icon={faMotorcycle} />
	) : mode === "racingbike" ? (
		<TwoWheeler />
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
					<MenuItem key={index} value={mode}>
						<div className="flex flex-row gap-2 items-center w-full">
							<div className="w-[25%]">
								{convertTravelModeToIcon(mode)}
							</div>
							<div className="w-[75%]">
								{convertTravelModeToLabel(mode)}
							</div>
						</div>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
