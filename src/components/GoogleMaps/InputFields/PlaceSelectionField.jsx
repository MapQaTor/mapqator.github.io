/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select, MenuItem, Box, Chip, Typography } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import mapServices from "@/tools/MapServices";

export default function PlaceSelectionField({
	label,
	onChange,
	value,
	multiple,
	handlePlaceAdd,
}) {
	const { selectedPlacesMap, savedPlacesMap } = useContext(GlobalContext);

	return (
		<>
			<FormControl fullWidth size="small" required>
				<InputLabel>{label}</InputLabel>
				<Select
					value={value}
					onChange={onChange}
					label={label}
					multiple={multiple}
					renderValue={
						multiple
							? (selected) => (
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 0.5,
										}}
									>
										{selected.map((value) => (
											<Chip
												key={value}
												label={
													savedPlacesMap[value]
														.displayName?.text
												}
												size="small"
											/>
										))}
									</Box>
							  )
							: (selected) => (
									<Box className="flex flex-row gap-2">
										<img
											src={
												mapServices[
													savedPlacesMap[selected]
														.mapService
												].image
											}
											alt=""
											className="h-6"
										/>
										<Typography noWrap>
											{
												savedPlacesMap[selected]
													?.displayName?.text
											}
										</Typography>
									</Box>
							  )
					}
				>
					{Object.keys(savedPlacesMap).map((place_id) => (
						<MenuItem
							key={place_id}
							value={place_id}
							className="flex flex-row gap-2"
						>
							<img
								src={
									mapServices[
										savedPlacesMap[place_id].mapService
									].image
								}
								alt=""
								className="h-6"
							/>
							<Typography
								noWrap
								className="max-w-[26rem] truncate text-ellipsis"
							>
								{savedPlacesMap[place_id].displayName?.text} |{" "}
								<span className="text-gray-500">
									{
										savedPlacesMap[place_id]
											.shortFormattedAddress
									}
								</span>
							</Typography>
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<h6 className="px-2  text-xs">
				If your desired place is not listed here, you need to{" "}
				<a
					className="underline font-semibold cursor-pointer hover:text-blue-500"
					onClick={handlePlaceAdd}
				>
					add it
				</a>{" "}
				first.
			</h6>
		</>
	);
}
