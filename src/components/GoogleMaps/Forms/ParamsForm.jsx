import { IconButton, Box } from "@mui/material";
import { Clear } from "@mui/icons-material";
import PlaceSelectionField from "@/components/GoogleMaps/InputFields/PlaceSelectionField";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import DaySelectionField from "../../InputFields/DaySelectionField";
import TimeSelectionField from "../../InputFields/TimeSelectionField";
import CurrentLocationSelectionField from "../InputFields/CurrentLocationSelectionField";

function ClearButton({ onClick }) {
	return (
		<IconButton onClick={onClick} sx={{ height: "2rem", width: "2rem" }}>
			<Clear />
		</IconButton>
	);
}

export default function ParamsForm({ handlePlaceAdd }) {
	const { currentInformation, setCurrentInformation } =
		useContext(GlobalContext);
	return (
		<Box className="flex flex-col gap-4 w-full">
			<div className="flex flex-row items-center w-full gap-2">
				<Box className="w-full">
					<TimeSelectionField
						label="Current Time"
						value={currentInformation.time}
						onChange={(newValue) =>
							setCurrentInformation((prev) => ({
								...prev,
								time: newValue,
							}))
						}
					/>
				</Box>

				<ClearButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							time: null,
						}));
					}}
				/>
			</div>

			<div className="flex flex-row items-center w-full gap-2">
				<DaySelectionField
					label="Current Day"
					value={currentInformation.day}
					onChange={(event) => {
						setCurrentInformation((prev) => ({
							...prev,
							day: event.target.value,
						}));
					}}
				/>
				<ClearButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							day: "",
						}));
					}}
				/>
			</div>

			<div>
				<div className="flex flex-row items-center w-full gap-2">
					<CurrentLocationSelectionField
						label="Current location"
						value={currentInformation.location}
						onChange={(event) => {
							setCurrentInformation((prev) => ({
								...prev,
								location: event.target.value,
							}));
						}}
					/>

					<ClearButton
						onClick={() => {
							setCurrentInformation((prev) => ({
								...prev,
								location: "",
							}));
						}}
					/>
				</div>
				<h6 className="px-2 text-sm">
					If your current location is not listed here, you need to{" "}
					<a
						className="underline font-semibold cursor-pointer hover:text-blue-500"
						onClick={handlePlaceAdd}
					>
						add it
					</a>{" "}
					first.
				</h6>
			</div>
		</Box>
	);
}
