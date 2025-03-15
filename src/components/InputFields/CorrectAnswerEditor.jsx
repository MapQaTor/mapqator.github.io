import React, { useContext } from "react";
import {
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	TextField,
	Box,
	Select,
	MenuItem,
	FormGroup,
	Checkbox,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import OptionsEditor from "./OptionsEditor";
import PlaceSuggestionEditor from "./PlaceSuggestionEditor";

const SingleAnswer = ({ value, options, onChange, index }) => (
	<>
		<OptionsEditor index={index} />
		<Typography variant="h6" sx={{ mt: 2 }}>
			Correct Answer:
		</Typography>
		<RadioGroup
			value={value}
			onChange={(e) => onChange(parseInt(e.target.value))}
		>
			{/* <FormControlLabel
				key={-1}
				value={-1}
				control={<Radio />}
				label="None"
			/> */}
			{options.map((option, index) => (
				<FormControlLabel
					key={index}
					value={index}
					control={<Radio />}
					label={`Option ${index + 1}`}
			/>
			))}
		</RadioGroup>
	</>
);

const MultipleAnswer = ({ value, options, onChange, index }) => {
	const handleCheckboxChange = (index) => {
		const newValue = [...value];
		if (newValue.includes(index)) {
			newValue.splice(newValue.indexOf(index), 1);
		} else {
			newValue.push(index);
		}
		onChange(newValue);
	};

	return (
		<>
			<OptionsEditor index={index} />
			<Typography variant="h6" sx={{ mt: 2 }}>
				Correct Answer:
			</Typography>
			<FormControl component="fieldset">
				<FormGroup>
					{options.map((option, index) => (
						<FormControlLabel
							key={index}
							control={
								<Checkbox
									checked={value.includes(index)}
									onChange={() => handleCheckboxChange(index)}
								/>
							}
							label={`Option ${index + 1}`}
						/>
					))}
				</FormGroup>
			</FormControl>
		</>
	);
};

const ShortAnswer = ({ value, onChange }) => (
	<>
		<Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
			Correct Answer:
		</Typography>
		<PlaceSuggestionEditor
			placeholder="Enter the correct answer"
			value={value || ""}
			onChange={(newValue) => onChange(newValue)}
			minRows={1}
		/>
		{/* <TextField
			fullWidth
			variant="outlined"
			value={value || ""}
			onChange={(e) => onChange(e.target.value)}
			placeholder="Enter the correct answer"
			sx={{ mt: 1 }}
			multiline
		/> */}
	</>
);

const YesNoAnswer = ({ value, onChange }) => (
	<>
		<Typography variant="h6" sx={{ mt: 2 }}>
			Correct Answer:
		</Typography>
		<RadioGroup
			value={value}
			onChange={(e) => onChange(parseInt(e.target.value))}
		>
			<FormControlLabel value={0} control={<Radio />} label="No" />
			<FormControlLabel value={1} control={<Radio />} label="Yes" />
		</RadioGroup>
	</>
);

// Answer type strategy
const answerTypes = {
	"single-choice": SingleAnswer,
	"open-ended": ShortAnswer,
	"multiple-choice": MultipleAnswer,
	"yes-no": YesNoAnswer,
};

const getDefaultValue = (type) => {
	switch (type) {
		case "single-choice":
			return -1;
		case "open-ended":
			return "";
		case "multiple-choice":
			return [];
		case "yes-no":
			return -1;
		default:
			return null;
	}
};

const getOptions = (type) => {
	switch (type) {
		case "single-choice":
			return ["Option 1", "Option 2", "Option 3", "Option 4"];
		case "yes-no":
			return ["No", "Yes"];
		case "multiple-choice":
			return ["Option 1", "Option 2", "Option 3", "Option 4"];
		case "open-ended":
			return [];
		default:
			return [];
	}
};

export default function CorrectAnswerEditor({ index }) {
	const { query, setQuery } = useContext(GlobalContext);

	const AnswerComponent =
		answerTypes[query.questions[index].answer.type] ||
		(() => <div>Unsupported answer type</div>);

	const handleChange = (newValue) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].answer.correct = newValue;
			return newQuery;
		});
	};

	const handleTypeChange = (newType) => {
		console.log(newType);
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].answer.type = newType;
			newQuery.questions[index].answer.correct = getDefaultValue(newType);
			newQuery.questions[index].answer.options = getOptions(newType);
			console.log(newQuery);
			return newQuery;
		});
	};

	return (
		<FormControl component="fieldset" sx={{ display: "block", mb: 2 }}>
			{/* <Typography variant="h6">Answer {index + 1}</Typography> */}
			<Box
				sx={{
					display: "flex",
					// alignItems: "center",
					flexDirection: "col",
					mb: 4,
					// justifyContent: "space-between",
					gap: 1,
				}}
				className="flex flex-col justify-between"
			>
				<Typography variant="h6">Answer Type:</Typography>
				<Select
					value={query.questions[index].answer.type}
					onChange={(e) => handleTypeChange(e.target.value)}
					sx={{ width: "20rem" }}
					// size="small"
				>
					<MenuItem value="yes-no">Yes/No</MenuItem>
					<MenuItem value="single-choice">Single Choice</MenuItem>
					<MenuItem value="multiple-choice">Multiple Choice</MenuItem>
					<MenuItem value="open-ended">Open Ended</MenuItem>
				</Select>
			</Box>

			<AnswerComponent
				value={query.questions[index].answer.correct}
				options={query.questions[index].answer.options}
				onChange={handleChange}
				index={index}
			/>
		</FormControl>
	);
}
