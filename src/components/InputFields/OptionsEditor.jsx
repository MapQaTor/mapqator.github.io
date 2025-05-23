import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import { set } from "lodash";
import PlaceSuggestionEditor from "./PlaceSuggestionEditor";

export default function OptionsEditor({ index }) {
	const { query, setQuery } = useContext(GlobalContext);
	const handleOptionChange = (i, value) => {
		setQuery((prev) => {
			const options = [...prev.questions[index].answer.options];
			options[i] = value;
			return {
				...prev,
				questions: [
					...prev.questions.slice(0, index),
					{
						...prev.questions[index],
						answer: {
							...prev.questions[index].answer,
							options,
						},
					},
					...prev.questions.slice(index + 1),
				],
			};
		});
	};

	const addOption = () => {
		setQuery((prev) => {
			const options = [
				...prev.questions[index].answer.options,
				"Option " + (prev.questions[index].answer.options.length + 1),
			];
			return {
				...prev,
				questions: [
					...prev.questions.slice(0, index),
					{
						...prev.questions[index],
						answer: {
							...prev.questions[index].answer,
							options,
						},
					},
					...prev.questions.slice(index + 1),
				],
			};
		});
	};

	const removeOption = (i) => {
		if (query.questions[index].answer.correct === i) {
			setQuery((prev) => {
				const options = [...prev.questions[index].answer.options];
				options.splice(i, 1);
				return {
					...prev,
					questions: [
						...prev.questions.slice(0, index),
						{
							...prev.questions[index],
							answer: {
								...prev.questions[index].answer,
								options,
								correct: -1,
							},
						},
						...prev.questions.slice(index + 1),
					],
				};
			});
		} else {
			setQuery((prev) => {
				const options = [...prev.questions[index].answer.options];
				options.splice(i, 1);
				return {
					...prev,
					questions: [
						...prev.questions.slice(0, index),
						{
							...prev.questions[index],
							answer: {
								...prev.questions[index].answer,
								options,
							},
						},
						...prev.questions.slice(index + 1),
					],
				};
			});
		}

		// setQuery((prev) => {
		// 	const options = [...prev.answer.options];
		// 	options.splice(i, 1);
		// 	return {
		// 		...prev,
		// 		answer: {
		// 			...prev.answer,
		// 			options,
		// 		},
		// 	};
		// });
	};
	return (
		<FormControl component="fieldset" fullWidth>
			<Typography variant="h6" gutterBottom>
				Options:
			</Typography>
			{query.questions[index]?.answer.options.map((option, i) => (
				<Box
					key={i}
					sx={{
						display: "flex",
						alignItems: "center",
						mb: 2,
					}}
				>
					{/* <TextField
						fullWidth
						multiline
						autoComplete="off"
						label={`Option ${i + 1}`}
						value={option}
						onChange={(e) => handleOptionChange(i, e.target.value)}
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => removeOption(i)}
										sx={{ ml: 1 }}
									>
										<DeleteIcon color="error" />
									</IconButton>
								</InputAdornment>
							),
						}}
					/> */}
					<PlaceSuggestionEditor
						value={option}
						onChange={(value) => handleOptionChange(i, value)}
						InputProps
						label={`Option ${i + 1}`}
						minRows={1}
					/>
				</Box>
			))}
			{/* <Box>
				<Button
					startIcon={<AddIcon />}
					onClick={addOption}
					sx={{ mb: 2 }}
				>
					Add Option
				</Button>
			</Box> */}
		</FormControl>
	);
}
