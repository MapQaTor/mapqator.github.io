"use client";

import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select, MenuItem, Box, Chip, Typography } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function PlaceSelectionField({
	label,
	onChange,
	value,
	multiple,
}) {
	const { selectedPlacesMap, savedPlacesMap } = useContext(GlobalContext);
	return (
		<FormControl fullWidth size="small">
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
											label={savedPlacesMap[value].name}
											size="small"
										/>
									))}
								</Box>
						  )
						: undefined
				}
			>
				{Object.keys(selectedPlacesMap).map((place_id) => (
					<MenuItem key={place_id} value={place_id}>
						{savedPlacesMap[place_id].name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
