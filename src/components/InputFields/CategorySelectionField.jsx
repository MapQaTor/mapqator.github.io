// import React, { useContext } from "react";
// import {
// 	FormControl,
// 	Select,
// 	MenuItem,
// 	InputLabel,
// 	Tooltip,
// 	IconButton,
// } from "@mui/material";
// import { Info } from "@mui/icons-material";
// import { GlobalContext } from "@/contexts/GlobalContext";
// import categories from "@/database/categories.json";
// import { convertFromSnake } from "@/services/utils";
// import { useRouter } from "next/navigation";

// export default function CategorySelectionField() {
// 	const { query, setQuery } = useContext(GlobalContext);
// 	const router = useRouter();

// 	const navigateToHelpPage = () => {
// 		router.push("/home/categories");
// 	};

// 	return (
// 		<FormControl fullWidth variant="outlined">
// 			<InputLabel>Category</InputLabel>
// 			<Select
// 				required
// 				label="Category"
// 				value={query.classification || ""}
// 				onChange={(e) => {
// 					setQuery((prev) => ({
// 						...prev,
// 						classification: e.target.value,
// 						question: "",
// 					}));
// 				}}
// 				endAdornment={
// 					<Tooltip title="Learn more about categories">
// 						<IconButton
// 							size="small"
// 							sx={{ mr: 2 }}
// 							onClick={navigateToHelpPage}
// 						>
// 							<Info />
// 						</IconButton>
// 					</Tooltip>
// 				}
// 			>
// 				{categories.map((value, index) => (
// 					<MenuItem key={index} value={value}>
// 						{convertFromSnake(value)}
// 					</MenuItem>
// 				))}
// 			</Select>
// 		</FormControl>
// 	);
// }

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

export default function CategorySelectionField({ index }) {
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
				value={query.questions[index].classification}
				onChange={(e) => {
					setQuery((prev) => {
						const newQuery = { ...prev };
						newQuery.questions[index].classification =
							e.target.value;
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
