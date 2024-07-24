import React, { useContext } from "react";
import {
	Box,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	Chip,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import categories from "@/database/categories.json";
import { convertFromSnake } from "@/services/utils";

export default function CategorySelectionField() {
	const { query, setQuery } = useContext(GlobalContext);
	return (
		<FormControl
			variant="outlined"
			className="w-[20rem]"
			sx={{ mt: 2 }}
			// size="small"
			required
		>
			<InputLabel>Category</InputLabel>
			<Select
				required
				multiple
				label={"Category"}
				placeholder="Choose a category of the question"
				id="outlined-adornment"
				className="outlined-input"
				value={query.classification.split(",").filter(Boolean)}
				onChange={(e) => {
					setQuery((prev) => ({
						...prev,
						classification: e.target.value.join(","),
					}));
				}}
				renderValue={(selected) => (
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
								label={convertFromSnake(value)}
								size="small"
							/>
						))}
					</Box>
				)}
			>
				{categories.map((value, index) => (
					<MenuItem key={index} value={value}>
						{convertFromSnake(value)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}