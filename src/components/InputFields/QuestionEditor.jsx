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

export default function QuestionEditor({ index }) {
	const { query, setQuery, savedPlacesMap } = useContext(GlobalContext);
	const handleQuestionChange = (newValue) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].title = newValue;
			return newQuery;
		});
	};

	return (
		<FormControl fullWidth>
			<PlaceSuggestionEditor
				placeholder="Write a question based on context..."
				value={query.questions[index].title}
				onChange={handleQuestionChange}
			/>
		</FormControl>
	);
}
