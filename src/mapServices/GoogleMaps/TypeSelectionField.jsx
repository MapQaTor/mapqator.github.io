import types from "@/database/newtypes.json";
import {
	Autocomplete,
	FormControl,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { convertFromSnake } from "@/services/utils";
import React from "react";

const placeTypes = [];
for (const category in types) {
	placeTypes.push(...types[category]);
}

export default function TypeSelectionField({ type, setType }) {
	const options = Object.entries(types).reduce((acc, [group, list]) => {
		acc.push(
			...list.map((typeItem) => ({
				label: convertFromSnake(typeItem),
				group: group,
				value: typeItem,
			}))
		);
		return acc;
	}, []);

	return (
		<Autocomplete
			value={options.find((option) => option.value === type) || null}
			onChange={(e, newValue) => setType(newValue?.value || "")}
			options={options}
			groupBy={(option) => option.group}
			getOptionLabel={(option) => option.label}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Type"
					variant="outlined"
					size="small"
					required
					fullWidth
				/>
			)}
			isOptionEqualToValue={(option, value) =>
				convertFromSnake(option.value) === value.value
			}
		/>
	);
}

export function formatType(type) {
	return convertFromSnake(type);
}
