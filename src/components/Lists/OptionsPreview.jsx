import React, { useEffect } from "react";
import {
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Grid,
	Card,
	CardContent,
	Divider,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const SingleAnswer = ({ answer }) => (
	<Box>
		<Typography variant="h6" gutterBottom>
			Options:
		</Typography>
		<Grid container spacing={2} className="mt-2">
			{answer.options.map((option, index) => (
				<Grid item xs={12} sm={6} key={index}>
					<Card variant="outlined" className="bg-white h-full">
						<CardContent className="h-full">
							<h1>
								<b>({index + 1})</b> {option}
								{index === answer.correct && (
									<CheckCircle
										className="text-green-500 ml-2"
										fontSize="small"
									/>
								)}
							</h1>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	</Box>
);

const MultipleAnswer = ({ answer }) => (
	<Box>
		<Typography variant="h6" gutterBottom>
			Options:
		</Typography>
		<Grid container spacing={2} className="mt-2">
			{answer.options.map((option, index) => (
				<Grid item xs={12} sm={6} key={index}>
					<Card variant="outlined" className="bg-white h-full">
						<CardContent className="h-full">
							<h1>
								<b>({index + 1})</b> {option}
								{answer.correct.includes(index) && (
									<CheckCircle
										className="text-green-500 ml-2"
										fontSize="small"
									/>
								)}
							</h1>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	</Box>
);

const ShortAnswer = ({ answer }) => (
	<Box>
		<Typography variant="h6" gutterBottom>
			Correct Answer:
		</Typography>
		<Divider />
		<h1 className="text-base py-2">{answer.correct}</h1>
		{/* <Card variant="outlined" className="bg-white h-full">
			<CardContent className="h-full"></CardContent>
		</Card> */}
	</Box>
);

const YesNoAnswer = ({ answer }) => (
	<Box>
		<Typography variant="h6" gutterBottom>
			Correct Answer: <b>{answer.correct ? "Yes" : "No"}</b>
		</Typography>
		{/* <Card variant="outlined" className="bg-white h-full">
			<CardContent className="h-full">
				<Typography variant="body1">
					{answer.correct ? "Yes" : "No"}
				</Typography>
			</CardContent>
		</Card> */}
	</Box>
);

// Answer type strategy
const answerTypes = {
	"single-choice": SingleAnswer,
	"open-ended": ShortAnswer,
	"multiple-choice": MultipleAnswer,
	"yes-no": YesNoAnswer,
};

export default function OptionsPreview({ answer }) {
	const AnswerComponent =
		answerTypes[answer.type] || (() => <div>Unsupported answer type</div>);
	return <AnswerComponent answer={answer} />;
}
