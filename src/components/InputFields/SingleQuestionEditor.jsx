import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Typography,
	TextField,
	FormControl,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceSuggestionEditor from "./PlaceSuggestionEditor";

export default function QuestionEditor() {
	const { query, setQuery, savedPlacesMap } = useContext(GlobalContext);
	const handleQuestionChange = (newValue) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.question = newValue;
			return newQuery;
		});
	};

	return (
		<FormControl fullWidth>
			<PlaceSuggestionEditor
				placeholder="Write a question based on context..."
				value={query.question}
				onChange={handleQuestionChange}
			/>
		</FormControl>
	);
}
