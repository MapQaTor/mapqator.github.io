import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Typography,
	TextField,
	FormControl,
	List,
	ListItem,
	ListItemText,
	ListItemButton,
	Tooltip,
	IconButton,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceSuggestionEditor from "./PlaceSuggestionEditor";
import { SmartToy } from "@mui/icons-material";
import ContextGeneratorService from "@/services/contextGeneratorService";
import gptApi from "@/api/gptApi";
import { showError } from "@/contexts/ToastProvider";

export default function QuestionEditor() {
	const {
		query,
		setQuery,
		savedPlacesMap,
		selectedPlacesMap,
		nearbyPlacesMap,
		directionInformation,
		routePlacesMap,
	} = useContext(GlobalContext);
	const [isGenerating, setIsGenerating] = useState(false);
	const handleQuestionChange = (newValue) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.question = newValue;
			return newQuery;
		});
	};
	const handleGenerateQuestion = async () => {
		setIsGenerating(true);
		const text = ContextGeneratorService.convertContextToText(
			savedPlacesMap,
			selectedPlacesMap,
			nearbyPlacesMap,
			directionInformation,
			routePlacesMap
		);
		if (text === "") {
			showError("Context is empty. Please generate context first.");
		} else {
			const res = await gptApi.generateQuestion(text);
			if (res.success) {
				setQuery((prev) => {
					const newQuery = { ...prev };
					newQuery.question = res.data;
					return newQuery;
				});
			} else {
				showError(res.message);
			}
		}
		setIsGenerating(false);
	};
	return (
		<FormControl fullWidth>
			<PlaceSuggestionEditor
				placeholder="Write a question based on context..."
				value={query.question}
				onChange={handleQuestionChange}
			/>
			<Tooltip title="Generate Question with AI">
				<IconButton
					onClick={handleGenerateQuestion}
					disabled={isGenerating}
					// loading={isGenerating}
					sx={{
						position: "absolute",
						right: 6,
						bottom: 28,
						backgroundColor: "primary.main",
						color: "white",
						"&:hover": {
							backgroundColor: "primary.dark",
						},
						width: 40,
						height: 40,
					}}
				>
					<SmartToy />
				</IconButton>
			</Tooltip>
		</FormControl>
	);
}
