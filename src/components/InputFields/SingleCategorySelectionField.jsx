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
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";

export default function CategorySelectionField() {
	const { query, setQuery } = useContext(GlobalContext);
	const router = useRouter();
	const navigateToHelpPage = () => {
		router.push("/home/categories");
	};
	return (
		<FormControl
			variant="outlined"
			className="w-[20rem]"
			// sx={{ mt: 2 }}
			// size="small"
			required
		>
			<InputLabel>Category</InputLabel>
			<Select
				required
				label={"Category"}
				placeholder="Choose a category of the question"
				id="outlined-adornment"
				className="outlined-input"
				value={query.classification}
				onChange={(e) => {
					console.log("Changing category");
					setQuery((prev) => {
						const newQuery = { ...prev };
						newQuery.classification = e.target.value;
						return newQuery;
					});
				}}
			>
				{categories.map((value, index) => (
					<MenuItem key={index} value={value}>
						{convertFromSnake(value)}
					</MenuItem>
				))}
			</Select>
			<Tooltip title="Learn more about categories">
				<IconButton
					size="small"
					sx={{
						position: "absolute",
						right: 30,
						top: "50%",
						transform: "translateY(-50%)",
					}}
					onClick={navigateToHelpPage}
				>
					<InfoIcon />
				</IconButton>
			</Tooltip>
		</FormControl>
	);
}
